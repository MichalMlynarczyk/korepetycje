import json
from pathlib import Path
from datetime import date, datetime, time, timedelta
from smtplib import SMTPException

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.models import Group
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.core.cache import cache
from django.core.mail import BadHeaderError, send_mail
from django.db import models, transaction
from django.http import FileResponse, HttpResponseRedirect, JsonResponse
from django.middleware.csrf import get_token
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import constant_time_compare
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_http_methods, require_POST

from .models import ChatMessage, ChatReadState, LessonSlot, StudentMaterial, StudentNotification, StudentProfile


DEFAULT_SLOT_KEYS = {
    '0-7': 'available',
    '0-8': 'available',
    '1-6': 'available',
    '1-7': 'booked',
    '1-8': 'available',
    '1-9': 'available',
    '2-9': 'available',
    '2-10': 'available',
    '4-6': 'available',
    '4-7': 'available',
    '4-8': 'booked',
    '5-0': 'available',
    '5-1': 'available',
    '5-2': 'available',
    '5-4': 'available',
}

CALENDAR_WEEK_START = date(2026, 6, 15)
CALENDAR_START_HOUR = 9
CALENDAR_PAST_DAYS = 14
CALENDAR_FUTURE_DAYS = 28
TEACHER_USERNAMES = ['KubaCRF_876_@gmail.com', 'HubertCRH_987_@gmail.com']
ALLOWED_MATERIAL_CONTENT_TYPES = {
    'application/pdf': '.pdf',
    'image/png': '.png',
    'image/jpeg': '.jpg',
}
MAX_MATERIAL_SIZE = 15 * 1024 * 1024


def _json_body(request):
    try:
        return json.loads(request.body.decode('utf-8') or '{}')
    except json.JSONDecodeError:
        return None


def _user_payload(user):
    profile = getattr(user, 'student_profile', None)
    role = 'teacher' if user.groups.filter(name='teacher').exists() else 'student'
    joined_recently = user.date_joined >= timezone.now() - timedelta(hours=1)

    return {
        'id': user.id,
        'email': user.email,
        'full_name': profile.full_name if profile else user.get_full_name(),
        'role': role,
        'tokens': profile.tokens if profile else None,
        'onboarding_answers': profile.onboarding_answers if profile else {},
        'is_new_user': joined_recently,
    }


def _is_teacher(user):
    return user.groups.filter(name='teacher').exists()


def _display_name(user):
    profile = getattr(user, 'student_profile', None)
    return profile.full_name if profile else user.get_full_name() or user.email or user.username


def _initial(user):
    name = _display_name(user).strip()
    return (name[0] if name else '?').upper()


def _teacher_users():
    teacher_group = Group.objects.filter(name='teacher').first()
    if not teacher_group:
        return get_user_model().objects.none()

    return get_user_model().objects.filter(
        groups=teacher_group,
        username__in=TEACHER_USERNAMES,
    ).order_by('first_name', 'email')


def _notify_teachers_about_new_student(user, full_name):
    for teacher in _teacher_users():
        ChatMessage.objects.create(
            student=user,
            sender=user,
            recipient=teacher,
            body=f'Nowy uczeń {full_name} zarejestrował się w platformie.',
            is_system=True,
        )


def _email_verification_url(user):
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    path = reverse('auth-verify-email', args=[uidb64, token])
    return f'{settings.FRONTEND_URL.rstrip("/")}{path}'


def _send_verification_email(user):
    verification_url = _email_verification_url(user)
    subject = 'Potwierdź adres e-mail w NaSTOmatMa'
    message = (
        f'Cześć {user.first_name or "!"}\n\n'
        'Dziękujemy za rejestrację w NaSTOmatMa.\n'
        'Kliknij poniższy link, aby potwierdzić adres e-mail i aktywować konto:\n\n'
        f'{verification_url}\n\n'
        'Jeśli to nie Ty zakładasz konto, zignoruj tę wiadomość.\n'
    )

    send_mail(
        subject,
        message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def _send_account_deletion_backup_email(user, profile, deleted_at):
    local_deleted_at = timezone.localtime(deleted_at)
    local_joined_at = timezone.localtime(user.date_joined)
    onboarding_answers = profile.onboarding_answers if profile else {}
    subject = 'Usunięte konto ucznia NaSTOmatMa'
    message = (
        'Uczeń usunął konto z panelu NaSTOmatMa.\n'
        'Poniżej dane pomocnicze do szybkiego przywrócenia konta, jeśli usunięcie było pomyłką.\n\n'
        f'ID użytkownika: {user.id}\n'
        f'Imię i nazwisko: {_display_name(user)}\n'
        f'E-mail: {user.email or "Brak"}\n'
        f'Login: {user.username}\n'
        f'Liczba żetonów: {profile.tokens if profile else 0}\n'
        f'Data dodania konta: {local_joined_at:%d.%m.%Y %H:%M}\n'
        f'Data usunięcia konta: {local_deleted_at:%d.%m.%Y %H:%M}\n\n'
        'Odpowiedzi z ankiety:\n'
        f'{json.dumps(onboarding_answers, ensure_ascii=False, indent=2)}\n'
    )

    send_mail(
        subject,
        message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.DELETED_ACCOUNT_EMAIL],
        fail_silently=False,
    )


def _send_new_student_notification_email(user, profile):
    created_at = profile.created_at if profile else user.date_joined
    local_created_at = timezone.localtime(created_at)
    onboarding_answers = profile.onboarding_answers if profile else {}
    message = (
        'Nowy uczeń zarejestrował się w NaSTOmatMa.\n\n'
        f'ID użytkownika: {user.id}\n'
        f'Imię i nazwisko: {_display_name(user)}\n'
        f'E-mail: {user.email or "Brak"}\n'
        f'Login: {user.username}\n'
        f'Liczba żetonów: {profile.tokens if profile else 0}\n'
        f'Data dodania konta: {local_created_at:%d.%m.%Y %H:%M}\n\n'
        'Odpowiedzi z ankiety:\n'
        f'{json.dumps(onboarding_answers, ensure_ascii=False, indent=2)}\n'
    )

    send_mail(
        subject='Nowy uczeń',
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.NEW_STUDENT_EMAIL],
        fail_silently=False,
    )


def _token_password_error(user, password):
    lock_key = f'teacher-token-password-lock:{user.id}'
    attempts_key = f'teacher-token-password-attempts:{user.id}'
    locked_until = cache.get(lock_key)
    now = timezone.now()

    if locked_until and locked_until > now:
        seconds_left = max(1, int((locked_until - now).total_seconds()))
        minutes_left = max(1, (seconds_left + 59) // 60)
        return JsonResponse({
            'error': f'Zbyt wiele błędnych prób. Spróbuj ponownie za {minutes_left} min.',
            'locked_seconds': seconds_left,
        }, status=429)

    if constant_time_compare(password, settings.TEACHER_TOKEN_PASSWORD):
        cache.delete(attempts_key)
        cache.delete(lock_key)
        return None

    attempts = int(cache.get(attempts_key, 0)) + 1
    limit = settings.TEACHER_TOKEN_PASSWORD_ATTEMPT_LIMIT
    lock_seconds = settings.TEACHER_TOKEN_PASSWORD_LOCK_SECONDS

    if attempts >= limit:
        locked_until = now + timedelta(seconds=lock_seconds)
        cache.set(lock_key, locked_until, timeout=lock_seconds)
        cache.delete(attempts_key)
        return JsonResponse({
            'error': 'Zbyt wiele błędnych prób. Spróbuj ponownie za 5 min.',
            'locked_seconds': lock_seconds,
        }, status=429)

    cache.set(attempts_key, attempts, timeout=lock_seconds)
    attempts_left = max(0, limit - attempts)
    return JsonResponse({
        'error': f'Nieprawidłowe hasło do żetonów. Pozostało prób: {attempts_left}.',
        'attempts_left': attempts_left,
    }, status=403)


def _teacher_user():
    return _teacher_users().first()


def _chat_queryset(student, teacher, include_system=True):
    messages = ChatMessage.objects.filter(student=student).filter(
        models.Q(sender=teacher) | models.Q(recipient=teacher)
    )
    if not include_system:
        messages = messages.filter(is_system=False)

    return messages


def _mark_chat_read(student, teacher, user):
    ChatReadState.objects.update_or_create(
        student=student,
        teacher=teacher,
        user=user,
        defaults={'last_read_at': timezone.now()},
    )


def _has_unread_chat(student, teacher, user):
    read_state = ChatReadState.objects.filter(
        student=student,
        teacher=teacher,
        user=user,
    ).first()
    messages = _chat_queryset(student, teacher, include_system=False).filter(recipient=user)
    if read_state:
        messages = messages.filter(created_at__gt=read_state.last_read_at)

    return messages.exists()


def _chat_message_payload(message, viewer):
    return {
        'id': message.id,
        'body': message.body,
        'author': 'System' if message.is_system or not message.sender else _display_name(message.sender),
        'own': message.sender_id == viewer.id,
        'is_system': message.is_system,
        'time': timezone.localtime(message.created_at).strftime('%H:%M'),
    }


def _material_payload(material):
    return {
        'id': material.id,
        'title': material.title,
        'message': material.message,
        'filename': material.original_filename,
        'content_type': material.content_type,
        'size': material.size,
        'teacher': _display_name(material.teacher),
        'created_at': timezone.localtime(material.created_at).strftime('%d.%m.%Y %H:%M'),
        'download_url': f'/api/auth/materials/{material.id}/download/',
    }


def _slot_start_datetime(slot):
    slot_datetime = datetime.combine(slot.date, slot.start_time)
    return timezone.make_aware(slot_datetime, timezone.get_current_timezone())


def _booked_cancellation_info(slot):
    if slot.status != LessonSlot.STATUS_BOOKED or not slot.student_id:
        return {
            'can_cancel': False,
            'cancel_deadline': None,
            'cancel_message': None,
        }

    now = timezone.localtime()
    slot_start = _slot_start_datetime(slot)
    if slot_start <= now:
        return {
            'can_cancel': False,
            'cancel_deadline': None,
            'cancel_message': 'Lekcja została już zrealizowana.',
        }

    confirmed_at = timezone.localtime(slot.confirmed_at or slot.updated_at)
    hours_to_start = (slot_start - now).total_seconds() / 3600

    if hours_to_start < 24:
        cancel_deadline = confirmed_at + timedelta(hours=1)
        cancel_message = 'Lekcję można anulować przez 1 godzinę od potwierdzenia.'
    elif hours_to_start <= 48:
        cancel_deadline = confirmed_at + timedelta(hours=4)
        cancel_message = 'Lekcję można anulować przez 4 godziny od potwierdzenia.'
    else:
        cancel_deadline = slot_start - timedelta(hours=24)
        cancel_message = 'Lekcję można anulować do 24 godzin przed rozpoczęciem.'

    return {
        'can_cancel': now < cancel_deadline,
        'cancel_deadline': timezone.localtime(cancel_deadline).isoformat(),
        'cancel_message': cancel_message,
    }


def _lesson_scope_for_slot(slot):
    if not slot.student_id:
        return ''

    prefix = (
        f'Zakres korepetycji ({slot.date.strftime("%d.%m.%Y")}, '
        f'{slot.start_time.strftime("%H:%M")} - {slot.end_time.strftime("%H:%M")}): '
    )
    body = ChatMessage.objects.filter(
        student=slot.student,
        sender=slot.student,
        recipient=slot.teacher,
        body__startswith=prefix,
    ).order_by('-created_at').values_list('body', flat=True).first()

    return body[len(prefix):].strip() if body else ''


def _slot_payload(slot):
    student_name = None
    if slot.student_id:
        student_profile = getattr(slot.student, 'student_profile', None)
        student_name = student_profile.full_name if student_profile else slot.student.get_full_name()
    rejected_student_name = None
    if slot.rejected_student_id:
        rejected_profile = getattr(slot.rejected_student, 'student_profile', None)
        rejected_student_name = rejected_profile.full_name if rejected_profile else slot.rejected_student.get_full_name()
    cancellation_info = _booked_cancellation_info(slot)

    return {
        'id': slot.id,
        'date': slot.date.isoformat(),
        'start_time': slot.start_time.strftime('%H:%M'),
        'end_time': slot.end_time.strftime('%H:%M'),
        'status': slot.status,
        'confirmed_at': timezone.localtime(slot.confirmed_at).isoformat() if slot.confirmed_at else None,
        'lesson_scope': _lesson_scope_for_slot(slot),
        **cancellation_info,
        'teacher': {
            'id': slot.teacher_id,
            'name': _display_name(slot.teacher),
        },
        'student': {
            'id': slot.student_id,
            'name': student_name,
        } if slot.student_id else None,
        'rejected_student': {
            'id': slot.rejected_student_id,
            'name': rejected_student_name,
        } if slot.rejected_student_id else None,
    }


def _lesson_notification_message(slot):
    return f'{slot.date:%d.%m.%Y}, godz. {slot.start_time:%H:%M} - {slot.end_time:%H:%M}'


def _create_lesson_notification(student, slot, kind):
    if not student:
        return None

    is_rejected = kind == StudentNotification.KIND_LESSON_REJECTED
    title = 'Korepetycje nie odbędą się' if is_rejected else 'Korepetycje odbędą się'

    notification, _ = StudentNotification.objects.get_or_create(
        student=student,
        lesson_slot=slot,
        kind=kind,
        defaults={
            'title': title,
            'message': _lesson_notification_message(slot),
            'teacher_name': _display_name(slot.teacher),
            'lesson_date': slot.date,
            'start_time': slot.start_time,
            'end_time': slot.end_time,
        },
    )
    return notification


def _create_tokens_notification(student, amount, tokens):
    if not student or amount <= 0:
        return None

    return StudentNotification.objects.create(
        student=student,
        kind=StudentNotification.KIND_TOKENS_ADDED,
        title='Żetony zostały dodane',
        message=f'Dodano {amount} żetonów. Aktualne saldo: {tokens}.',
    )


def _student_notification_payload(notification):
    type_map = {
        StudentNotification.KIND_LESSON_ACCEPTED: 'booked',
        StudentNotification.KIND_LESSON_REJECTED: 'rejected',
        StudentNotification.KIND_TOKENS_ADDED: 'tokens',
    }

    return {
        'id': notification.id,
        'type': type_map.get(notification.kind, notification.kind),
        'kind': notification.kind,
        'title': notification.title,
        'message': notification.message,
        'teacher_name': notification.teacher_name,
        'lesson_date': notification.lesson_date.isoformat() if notification.lesson_date else None,
        'start_time': notification.start_time.strftime('%H:%M') if notification.start_time else None,
        'end_time': notification.end_time.strftime('%H:%M') if notification.end_time else None,
        'created_at': timezone.localtime(notification.created_at).isoformat(),
    }


def _today():
    return timezone.localdate()


def _current_week_start():
    today = _today()
    return today - timedelta(days=today.weekday())


def _calendar_min_date():
    return _today() - timedelta(days=CALENDAR_PAST_DAYS)


def _calendar_max_date():
    return _today() + timedelta(days=CALENDAR_FUTURE_DAYS)


def _cleanup_old_slots():
    LessonSlot.objects.filter(date__lt=_calendar_min_date()).delete()


def _parse_week_start(request):
    raw_week_start = request.GET.get('week_start')
    if not raw_week_start:
        return _current_week_start(), None

    try:
        week_start = datetime.strptime(raw_week_start, '%Y-%m-%d').date()
    except ValueError:
        return None, JsonResponse({'error': 'Nieprawidłowy tydzień kalendarza.'}, status=400)

    return week_start - timedelta(days=week_start.weekday()), None


def _is_slot_in_allowed_window(slot_date, start_time):
    now = timezone.localtime()
    slot_datetime = datetime.combine(slot_date, start_time)
    slot_datetime = timezone.make_aware(slot_datetime, timezone.get_current_timezone())

    if slot_datetime <= now:
        return False, 'Nie można zmieniać ani rezerwować terminów z przeszłości.'

    if slot_date > _calendar_max_date():
        return False, 'Terminy można planować maksymalnie 4 tygodnie do przodu.'

    return True, None


def _parse_slot_datetime(data):
    try:
        slot_date = datetime.strptime(str(data.get('date')), '%Y-%m-%d').date()
        start_time = datetime.strptime(str(data.get('start_time')), '%H:%M').time()
    except (TypeError, ValueError):
        return None, None, None, JsonResponse({'error': 'Nieprawidłowa data lub godzina.'}, status=400)

    end_datetime = datetime.combine(slot_date, start_time) + timedelta(hours=1)
    return slot_date, start_time, end_datetime.time(), None


def _ensure_default_slots(teacher):
    if not teacher or LessonSlot.objects.filter(teacher=teacher).exists():
        return

    slots = []
    for key, status in DEFAULT_SLOT_KEYS.items():
        day_index, hour_index = [int(part) for part in key.split('-')]
        slot_date = CALENDAR_WEEK_START + timedelta(days=day_index)
        start_time = time(CALENDAR_START_HOUR + hour_index, 0)
        end_time = time(CALENDAR_START_HOUR + hour_index + 1, 0)
        slots.append(LessonSlot(
            teacher=teacher,
            date=slot_date,
            start_time=start_time,
            end_time=end_time,
            status=status,
        ))

    LessonSlot.objects.bulk_create(slots, ignore_conflicts=True)


@require_GET
@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


@require_GET
def me(request):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False})

    return JsonResponse({
        'authenticated': True,
        'user': _user_payload(request.user),
    })


@require_GET
def calendar_slots(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    _cleanup_old_slots()
    week_start, error = _parse_week_start(request)
    if error:
        return error

    week_end = week_start + timedelta(days=6)
    teacher = request.user if _is_teacher(request.user) else None
    if not teacher:
        teacher_id = request.GET.get('teacher_id')
        teacher = _teacher_users().filter(id=teacher_id).first() if teacher_id else _teacher_user()
        if not teacher:
            return JsonResponse({'error': 'Nie znaleziono korepetytora.'}, status=404)
    _ensure_default_slots(teacher)

    slots = LessonSlot.objects.select_related('teacher', 'student', 'rejected_student').filter(
        date__gte=week_start,
        date__lte=week_end,
    )
    slots = slots.filter(teacher=teacher)

    response = {
        'slots': [_slot_payload(slot) for slot in slots],
        'window': {
            'week_start': week_start.isoformat(),
            'min_date': _calendar_min_date().isoformat(),
            'max_date': _calendar_max_date().isoformat(),
        },
    }
    if not _is_teacher(request.user):
        profile = getattr(request.user, 'student_profile', None)
        response['tokens'] = profile.tokens if profile else 0

    return JsonResponse(response)


@require_GET
def students_list(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if not _is_teacher(request.user):
        return JsonResponse({'error': 'Tylko korepetytor może pobrać listę uczniów.'}, status=403)

    teacher_group = Group.objects.filter(name='teacher').first()
    students = get_user_model().objects.select_related('student_profile').filter(
        student_profile__isnull=False,
    ).order_by('first_name', 'email')
    if teacher_group:
        students = students.exclude(groups=teacher_group)

    return JsonResponse({
        'students': [
            {
                'id': student.id,
                'name': _display_name(student),
                'initial': _initial(student),
                'email': student.email,
                'tokens': student.student_profile.tokens,
                'created_at': timezone.localtime(student.student_profile.created_at).strftime('%d.%m.%Y %H:%M'),
                'created_at_iso': timezone.localtime(student.student_profile.created_at).isoformat(),
                'onboarding_answers': student.student_profile.onboarding_answers,
                'has_unread': _has_unread_chat(student, request.user, request.user),
                'last_message': (
                    ChatMessage.objects.filter(student=student)
                    .filter(models.Q(recipient=request.user) | models.Q(sender=request.user))
                    .order_by('-created_at')
                    .values_list('body', flat=True)
                    .first()
                    or 'Brak wiadomości.'
                ),
            }
            for student in students
        ],
    })


@csrf_exempt
@require_http_methods(['GET', 'POST'])
def onboarding_answers(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if _is_teacher(request.user):
        return JsonResponse({'error': 'Ten widok jest przeznaczony dla ucznia.'}, status=403)

    profile = getattr(request.user, 'student_profile', None)
    if not profile:
        return JsonResponse({'error': 'Nie znaleziono profilu ucznia.'}, status=404)

    if request.method == 'GET':
        return JsonResponse({'answers': profile.onboarding_answers})

    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy format danych.'}, status=400)

    answers = data.get('answers', data)
    if not isinstance(answers, dict):
        return JsonResponse({'error': 'Odpowiedzi ankiety muszą być obiektem.'}, status=400)

    allowed_keys = {'subject', 'format', 'tutor', 'phone', 'fullName'}
    profile.onboarding_answers = {
        key: value
        for key, value in answers.items()
        if key in allowed_keys and isinstance(value, str)
    }
    profile.save(update_fields=['onboarding_answers', 'updated_at'])

    return JsonResponse({'answers': profile.onboarding_answers})


@require_GET
def materials_list(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if _is_teacher(request.user):
        return JsonResponse({'error': 'Ten widok jest przeznaczony dla ucznia.'}, status=403)

    materials = StudentMaterial.objects.select_related('teacher').filter(student=request.user)

    return JsonResponse({
        'materials': [_material_payload(material) for material in materials],
    })


@csrf_exempt
@require_http_methods(['POST'])
def material_upload(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if not _is_teacher(request.user):
        return JsonResponse({'error': 'Tylko korepetytor może wysyłać pliki.'}, status=403)

    teacher_group = Group.objects.filter(name='teacher').first()
    student = get_user_model().objects.select_related('student_profile').filter(
        id=request.POST.get('student_id'),
    ).first()
    if not student:
        return JsonResponse({'error': 'Nie znaleziono ucznia.'}, status=404)
    if not hasattr(student, 'student_profile'):
        return JsonResponse({'error': 'Wybrana osoba nie jest uczniem.'}, status=400)
    if teacher_group and student.groups.filter(id=teacher_group.id).exists():
        return JsonResponse({'error': 'Wybrana osoba nie jest uczniem.'}, status=400)

    title = str(request.POST.get('title', '')).strip()
    message = str(request.POST.get('message', '')).strip()
    upload = request.FILES.get('file')

    if not title:
        return JsonResponse({'error': 'Wpisz tytuł materiału.'}, status=400)
    if not upload:
        return JsonResponse({'error': 'Wybierz plik.'}, status=400)
    if upload.size > MAX_MATERIAL_SIZE:
        return JsonResponse({'error': 'Plik może mieć maksymalnie 15 MB.'}, status=400)

    extension = Path(upload.name).suffix.lower()
    allowed_extensions = {'.pdf', '.png', '.jpg', '.jpeg'}
    if upload.content_type not in ALLOWED_MATERIAL_CONTENT_TYPES or extension not in allowed_extensions:
        return JsonResponse({'error': 'Dozwolone pliki: PDF, PNG, JPG.'}, status=400)

    material = StudentMaterial.objects.create(
        student=student,
        teacher=request.user,
        title=title,
        message=message,
        file=upload,
        original_filename=upload.name,
        content_type=upload.content_type,
        size=upload.size,
    )

    ChatMessage.objects.create(
        student=student,
        sender=request.user,
        recipient=student,
        body=f'Przesłano nowy materiał: {title}.',
        is_system=True,
    )

    return JsonResponse({'material': _material_payload(material)}, status=201)


@require_GET
def material_download(request, material_id):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    material = StudentMaterial.objects.select_related('student', 'teacher').filter(id=material_id).first()
    if not material:
        return JsonResponse({'error': 'Nie znaleziono pliku.'}, status=404)

    can_download = (
        material.student_id == request.user.id
        or material.teacher_id == request.user.id
        or _is_teacher(request.user)
    )
    if not can_download:
        return JsonResponse({'error': 'Nie masz dostępu do tego pliku.'}, status=403)

    response = FileResponse(
        material.file.open('rb'),
        as_attachment=True,
        filename=material.original_filename,
        content_type=material.content_type,
    )
    response['Content-Length'] = material.size
    return response


@csrf_exempt
@require_http_methods(['POST'])
def student_tokens(request, student_id):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if not _is_teacher(request.user):
        return JsonResponse({'error': 'Tylko korepetytor może zmieniać żetony ucznia.'}, status=403)

    teacher_group = Group.objects.filter(name='teacher').first()
    student = get_user_model().objects.select_related('student_profile').filter(id=student_id).first()
    if not student:
        return JsonResponse({'error': 'Nie znaleziono ucznia.'}, status=404)
    if not hasattr(student, 'student_profile'):
        return JsonResponse({'error': 'Wybrana osoba nie jest uczniem.'}, status=400)
    if teacher_group and student.groups.filter(id=teacher_group.id).exists():
        return JsonResponse({'error': 'Wybrana osoba nie jest uczniem.'}, status=400)

    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

    password = str(data.get('password', ''))
    password_error = _token_password_error(request.user, password)
    if password_error:
        return password_error

    action = data.get('action')
    try:
        amount = int(data.get('amount'))
    except (TypeError, ValueError):
        return JsonResponse({'error': 'Podaj poprawną liczbę żetonów.'}, status=400)

    if amount < 0:
        return JsonResponse({'error': 'Liczba żetonów nie może być ujemna.'}, status=400)

    profile = student.student_profile
    previous_tokens = profile.tokens
    if action == 'add':
        profile.tokens += amount
    elif action == 'set':
        profile.tokens = amount
    else:
        return JsonResponse({'error': 'Nieprawidłowa akcja.'}, status=400)

    profile.save(update_fields=['tokens', 'updated_at'])

    if action == 'add' and profile.tokens > previous_tokens:
        _create_tokens_notification(student, profile.tokens - previous_tokens, profile.tokens)

    return JsonResponse({
        'student': {
            'id': student.id,
            'name': _display_name(student),
            'initial': _initial(student),
            'email': student.email,
            'tokens': profile.tokens,
        },
    })


@require_GET
def teachers_list(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if _is_teacher(request.user):
        return JsonResponse({'error': 'Ten widok jest przeznaczony dla ucznia.'}, status=403)

    teachers = _teacher_users()
    return JsonResponse({
        'teachers': [
            {
                'id': teacher.id,
                'name': _display_name(teacher),
                'initial': _initial(teacher),
                'email': teacher.email,
                'has_unread': _has_unread_chat(request.user, teacher, request.user),
                'last_message': (
                    _chat_queryset(request.user, teacher, include_system=False)
                    .order_by('-created_at')
                    .values_list('body', flat=True)
                    .first()
                    or 'Brak wiadomości.'
                ),
            }
            for teacher in teachers
        ],
    })


@require_GET
def student_notifications(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if _is_teacher(request.user):
        return JsonResponse({'error': 'Ten widok jest przeznaczony dla ucznia.'}, status=403)

    notifications = StudentNotification.objects.filter(student=request.user).order_by('-created_at')[:100]

    return JsonResponse({
        'notifications': [
            _student_notification_payload(notification)
            for notification in notifications
        ],
    })


@csrf_exempt
@require_http_methods(['GET', 'POST'])
def student_chat_messages(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if _is_teacher(request.user):
        return JsonResponse({'error': 'Ten widok czatu jest przeznaczony dla ucznia.'}, status=403)

    teacher_id = request.GET.get('teacher_id')
    data = None
    if request.method == 'POST':
        data = _json_body(request)
        if data is None:
            return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)
        teacher_id = data.get('teacher_id')

    teacher = _teacher_users().filter(id=teacher_id).first() if teacher_id else _teacher_user()
    if not teacher:
        return JsonResponse({'error': 'Nie znaleziono korepetytora.'}, status=404)

    if request.method == 'POST':
        body = str(data.get('body', '')).strip()
        if not body:
            return JsonResponse({'error': 'Wpisz wiadomość.'}, status=400)

        ChatMessage.objects.create(
            student=request.user,
            sender=request.user,
            recipient=teacher,
            body=body,
        )

    messages = _chat_queryset(request.user, teacher, include_system=False).select_related('sender', 'recipient')
    _mark_chat_read(request.user, teacher, request.user)

    return JsonResponse({
        'teacher': {
            'id': teacher.id,
            'name': _display_name(teacher),
            'initial': _initial(teacher),
            'email': teacher.email,
        },
        'messages': [_chat_message_payload(message, request.user) for message in messages],
    })


@csrf_exempt
@require_http_methods(['GET', 'POST'])
def chat_messages(request, student_id):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if not _is_teacher(request.user):
        return JsonResponse({'error': 'Tylko korepetytor może korzystać z tego widoku czatu.'}, status=403)

    teacher_group = Group.objects.filter(name='teacher').first()
    student = get_user_model().objects.filter(id=student_id).first()
    if not student:
        return JsonResponse({'error': 'Nie znaleziono ucznia.'}, status=404)
    if not hasattr(student, 'student_profile'):
        return JsonResponse({'error': 'Wybrana osoba nie jest uczniem.'}, status=400)
    if teacher_group and student.groups.filter(id=teacher_group.id).exists():
        return JsonResponse({'error': 'Wybrana osoba nie jest uczniem.'}, status=400)

    if request.method == 'POST':
        data = _json_body(request)
        if data is None:
            return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

        body = str(data.get('body', '')).strip()
        if not body:
            return JsonResponse({'error': 'Wpisz wiadomość.'}, status=400)

        ChatMessage.objects.create(
            student=student,
            sender=request.user,
            recipient=student,
            body=body,
        )

    messages = _chat_queryset(student, request.user).select_related('sender', 'recipient')
    _mark_chat_read(student, request.user, request.user)

    return JsonResponse({
        'student': {
            'id': student.id,
            'name': _display_name(student),
            'initial': _initial(student),
            'email': student.email,
        },
        'messages': [_chat_message_payload(message, request.user) for message in messages],
    })


@csrf_exempt
@require_http_methods(['POST'])
def calendar_toggle_slot(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if not _is_teacher(request.user):
        return JsonResponse({'error': 'Tylko korepetytor może zmieniać dostępność.'}, status=403)

    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

    slot_date, start_time, end_time, error = _parse_slot_datetime(data)
    if error:
        return error

    is_allowed, message = _is_slot_in_allowed_window(slot_date, start_time)
    if not is_allowed:
        return JsonResponse({'error': message}, status=400)

    slot = LessonSlot.objects.filter(
        teacher=request.user,
        date=slot_date,
        start_time=start_time,
    ).first()

    if not slot:
        slot = LessonSlot.objects.create(
            teacher=request.user,
            date=slot_date,
            start_time=start_time,
            end_time=end_time,
        )
        return JsonResponse({'slot': _slot_payload(slot)}, status=201)

    if slot.status != LessonSlot.STATUS_AVAILABLE:
        return JsonResponse({'error': 'Ten termin jest już zarezerwowany.'}, status=409)

    slot.delete()
    return JsonResponse({'deleted': True})


@csrf_exempt
@require_http_methods(['POST'])
def calendar_teacher_reserve_slot(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if not _is_teacher(request.user):
        return JsonResponse({'error': 'Tylko korepetytor może rezerwować termin w tym widoku.'}, status=403)

    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

    slot_date, start_time, end_time, error = _parse_slot_datetime(data)
    if error:
        return error

    is_allowed, message = _is_slot_in_allowed_window(slot_date, start_time)
    if not is_allowed:
        return JsonResponse({'error': message}, status=400)

    student = None
    student_id = data.get('student_id')
    if student_id:
        teacher_group = Group.objects.filter(name='teacher').first()
        student = get_user_model().objects.filter(id=student_id).first()
        if not student:
            return JsonResponse({'error': 'Nie znaleziono ucznia.'}, status=404)
        if teacher_group and student.groups.filter(id=teacher_group.id).exists():
            return JsonResponse({'error': 'Wybrana osoba nie jest uczniem.'}, status=400)

    slot, _ = LessonSlot.objects.get_or_create(
        teacher=request.user,
        date=slot_date,
        start_time=start_time,
        defaults={
            'end_time': end_time,
        },
    )
    slot.end_time = end_time
    slot.status = LessonSlot.STATUS_BOOKED
    slot.student = student
    slot.rejected_student = None
    slot.confirmed_at = timezone.now() if student else None
    slot.save(update_fields=['end_time', 'status', 'student', 'rejected_student', 'confirmed_at', 'updated_at'])
    if student:
        _create_lesson_notification(student, slot, StudentNotification.KIND_LESSON_ACCEPTED)

    return JsonResponse({'slot': _slot_payload(slot)})


@csrf_exempt
@require_http_methods(['POST'])
def calendar_decide_slot(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if not _is_teacher(request.user):
        return JsonResponse({'error': 'Tylko korepetytor może zaakceptować lub odrzucić termin.'}, status=403)

    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

    action = data.get('action')
    if action not in ['accept', 'reject']:
        return JsonResponse({'error': 'Nieprawidłowa decyzja.'}, status=400)

    with transaction.atomic():
        slot = LessonSlot.objects.select_for_update().filter(
            id=data.get('slot_id'),
            teacher=request.user,
            status=LessonSlot.STATUS_PENDING,
        ).first()
        if not slot:
            return JsonResponse({'error': 'Nie znaleziono oczekującej rezerwacji.'}, status=404)

        if action == 'accept':
            slot.status = LessonSlot.STATUS_BOOKED
            slot.rejected_student = None
            slot.confirmed_at = timezone.now()
            slot.save(update_fields=['status', 'rejected_student', 'confirmed_at', 'updated_at'])
            _create_lesson_notification(slot.student, slot, StudentNotification.KIND_LESSON_ACCEPTED)
        else:
            rejected_student = slot.student
            if rejected_student_id := slot.student_id:
                StudentProfile.objects.select_for_update().filter(user_id=rejected_student_id).update(
                    tokens=models.F('tokens') + 1,
                    updated_at=timezone.now(),
                )
            slot.rejected_student = rejected_student
            slot.student = None
            slot.status = LessonSlot.STATUS_AVAILABLE
            slot.confirmed_at = None
            slot.save(update_fields=['status', 'student', 'rejected_student', 'confirmed_at', 'updated_at'])
            _create_lesson_notification(rejected_student, slot, StudentNotification.KIND_LESSON_REJECTED)

    return JsonResponse({'slot': _slot_payload(slot)})


@csrf_exempt
@require_http_methods(['POST'])
def calendar_book_slot(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if _is_teacher(request.user):
        return JsonResponse({'error': 'Korepetytor nie rezerwuje terminów jako uczeń.'}, status=403)

    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

    with transaction.atomic():
        profile = StudentProfile.objects.select_for_update().filter(user=request.user).first()
        if not profile:
            return JsonResponse({'error': 'Nie znaleziono profilu ucznia.'}, status=404)
        if profile.tokens < 1:
            return JsonResponse({'error': 'Brak żetonów. Nie można rezerwować lekcji.'}, status=400)

        slot_id = data.get('slot_id')
        slot = LessonSlot.objects.select_for_update().filter(id=slot_id).first()
        if not slot:
            return JsonResponse({'error': 'Nie znaleziono terminu.'}, status=404)

        if slot.status != LessonSlot.STATUS_AVAILABLE:
            return JsonResponse({'error': 'Ten termin jest już zarezerwowany.'}, status=409)

        is_allowed, message = _is_slot_in_allowed_window(slot.date, slot.start_time)
        if not is_allowed:
            return JsonResponse({'error': message}, status=400)

        profile.tokens -= 1
        profile.save(update_fields=['tokens', 'updated_at'])

        slot.student = request.user
        slot.status = LessonSlot.STATUS_PENDING
        slot.rejected_student = None
        slot.confirmed_at = None
        slot.save(update_fields=['student', 'status', 'rejected_student', 'confirmed_at', 'updated_at'])

    return JsonResponse({'slot': _slot_payload(slot), 'tokens': profile.tokens})


@csrf_exempt
@require_http_methods(['POST'])
def calendar_cancel_slot(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if _is_teacher(request.user):
        return JsonResponse({'error': 'Korepetytor nie anuluje terminów jako uczeń.'}, status=403)

    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

    with transaction.atomic():
        profile = StudentProfile.objects.select_for_update().filter(user=request.user).first()
        if not profile:
            return JsonResponse({'error': 'Nie znaleziono profilu ucznia.'}, status=404)

        slot = LessonSlot.objects.select_for_update().filter(
            id=data.get('slot_id'),
            student=request.user,
        ).first()
        if not slot:
            return JsonResponse({'error': 'Nie znaleziono rezerwacji do anulowania.'}, status=404)
        if slot.status not in [LessonSlot.STATUS_PENDING, LessonSlot.STATUS_BOOKED]:
            return JsonResponse({'error': 'Tego terminu nie można anulować.'}, status=400)
        if slot.status == LessonSlot.STATUS_BOOKED:
            cancellation_info = _booked_cancellation_info(slot)
            if not cancellation_info['can_cancel']:
                return JsonResponse({'error': 'Minął czas na anulowanie tych zajęć.'}, status=400)

        profile.tokens += 1
        profile.save(update_fields=['tokens', 'updated_at'])

        slot.student = None
        slot.status = LessonSlot.STATUS_AVAILABLE
        slot.rejected_student = None
        slot.confirmed_at = None
        slot.save(update_fields=['student', 'status', 'rejected_student', 'confirmed_at', 'updated_at'])

    return JsonResponse({'slot': _slot_payload(slot), 'tokens': profile.tokens})


@csrf_exempt
@require_POST
def contact_message(request):
    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

    message = str(data.get('message', '')).strip()
    if not message:
        return JsonResponse({'error': 'Wpisz wiadomość przed wysłaniem.'}, status=400)

    if len(message) > 5000:
        return JsonResponse({'error': 'Wiadomość jest za długa.'}, status=400)

    sender_label = 'Gość ze strony startowej'
    if request.user.is_authenticated:
        sender_label = _display_name(request.user)
        if request.user.email:
            sender_label = f'{sender_label} <{request.user.email}>'

    body = (
        'Nowa wiadomość z formularza kontaktowego NaSTOmatMa.\n\n'
        f'Nadawca: {sender_label}\n\n'
        f'{message}'
    )

    try:
        send_mail(
            subject='pytanie od Klienta',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_EMAIL],
            fail_silently=False,
        )
    except BadHeaderError:
        return JsonResponse({'error': 'Nieprawidłowy nagłówek wiadomości.'}, status=400)
    except Exception:
        return JsonResponse({'error': 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.'}, status=502)

    return JsonResponse({'detail': 'Wiadomość została wysłana.'})


@csrf_exempt
@require_POST
def package_contact_message(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    if _is_teacher(request.user):
        return JsonResponse({'error': 'Ten widok jest przeznaczony dla ucznia.'}, status=403)

    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

    message = str(data.get('message', '')).strip()
    if not message:
        return JsonResponse({'error': 'Wpisz wiadomość przed wysłaniem.'}, status=400)

    if len(message) > 5000:
        return JsonResponse({'error': 'Wiadomość jest za długa.'}, status=400)

    teacher_name = str(data.get('teacher_name', '')).strip().lower()
    teachers = list(_teacher_users())
    teacher = next(
        (user for user in teachers if _display_name(user).strip().lower() == teacher_name),
        None,
    ) if teacher_name else None
    teacher = teacher or _teacher_user()
    if not teacher:
        return JsonResponse({'error': 'Nie znaleziono korepetytora.'}, status=404)

    sender_label = _display_name(request.user)
    if request.user.email:
        sender_label = f'{sender_label} <{request.user.email}>'

    body = (
        'Nowa wiadomość o zakupie pakietu NaSTOmatMa.\n\n'
        f'Nadawca: {sender_label}\n'
        f'Korepetytor: {_display_name(teacher)}\n\n'
        f'{message}'
    )

    try:
        send_mail(
            subject='Zakup żetonów NaSTOmatMa',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_EMAIL],
            fail_silently=False,
        )
    except BadHeaderError:
        return JsonResponse({'error': 'Nieprawidłowy nagłówek wiadomości.'}, status=400)
    except Exception:
        return JsonResponse({'error': 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.'}, status=502)

    ChatMessage.objects.create(
        student=request.user,
        sender=request.user,
        recipient=teacher,
        body=message,
    )

    return JsonResponse({
        'detail': 'Wiadomość została wysłana.',
        'teacher': {
            'id': teacher.id,
            'name': _display_name(teacher),
            'initial': _initial(teacher),
            'email': teacher.email,
        },
    })


@csrf_exempt
@require_POST
def register(request):
    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

    full_name = str(data.get('full_name', '')).strip()
    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))
    password_confirm = str(data.get('password_confirm', ''))

    if not full_name:
        return JsonResponse({'error': 'Podaj imię i nazwisko.'}, status=400)

    if not email:
        return JsonResponse({'error': 'Podaj adres e-mail.'}, status=400)

    if len(password) < 6:
        return JsonResponse({'error': 'Hasło musi mieć minimum 6 znaków.'}, status=400)

    if password != password_confirm:
        return JsonResponse({'error': 'Hasła nie są takie same.'}, status=400)

    User = get_user_model()
    existing_user = User.objects.filter(models.Q(username=email) | models.Q(email=email)).first()
    if existing_user and not existing_user.is_active:
        try:
            _send_verification_email(existing_user)
        except (BadHeaderError, OSError, SMTPException):
            return JsonResponse({'error': 'Nie udało się wysłać maila weryfikacyjnego. Spróbuj ponownie później.'}, status=502)

        return JsonResponse({
            'detail': 'Konto już istnieje, ale nie zostało potwierdzone. Wysłaliśmy nowy link aktywacyjny.',
            'requires_email_verification': True,
        })

    if existing_user:
        return JsonResponse({'error': 'Konto z tym adresem e-mail już istnieje.'}, status=409)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=full_name[:150],
        is_active=False,
    )
    profile = StudentProfile.objects.create(user=user, full_name=full_name)
    try:
        _send_verification_email(user)
        _send_new_student_notification_email(user, profile)
    except (BadHeaderError, OSError, SMTPException):
        return JsonResponse({'error': 'Konto zostało utworzone, ale nie udało się wysłać wymaganych wiadomości e-mail. Spróbuj zarejestrować się ponownie za chwilę.'}, status=502)

    return JsonResponse({
        'detail': 'Konto zostało utworzone. Sprawdź skrzynkę e-mail i kliknij link aktywacyjny.',
        'requires_email_verification': True,
    }, status=201)


@require_GET
def verify_email(request, uidb64, token):
    User = get_user_model()

    try:
        user_id = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=user_id)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is None or not default_token_generator.check_token(user, token):
        return HttpResponseRedirect(f'{settings.FRONTEND_URL.rstrip("/")}/?email_verified=invalid')

    if not user.is_active:
        user.is_active = True
        user.save(update_fields=['is_active'])
        profile = getattr(user, 'student_profile', None)
        _notify_teachers_about_new_student(user, profile.full_name if profile else user.get_full_name() or user.email)

    return HttpResponseRedirect(f'{settings.FRONTEND_URL.rstrip("/")}/?email_verified=success')


@csrf_exempt
@require_POST
def login_view(request):
    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'Nieprawidłowy JSON.'}, status=400)

    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))

    user = authenticate(request, username=email, password=password)
    if user is None:
        inactive_user = get_user_model().objects.filter(username=email, is_active=False).first()
        if inactive_user and inactive_user.check_password(password):
            return JsonResponse({'error': 'Potwierdź adres e-mail przed logowaniem. Link aktywacyjny wysłaliśmy na Twoją skrzynkę.'}, status=403)

        return JsonResponse({'error': 'Nieprawidłowy e-mail lub hasło.'}, status=400)

    login(request, user)
    return JsonResponse({'user': _user_payload(user)})


@csrf_exempt
@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({'detail': 'Wylogowano.'})


@csrf_exempt
@require_http_methods(['DELETE'])
def account_delete(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Musisz być zalogowany.'}, status=401)

    user = request.user
    if _is_teacher(user):
        return JsonResponse({'error': 'Konto korepetytora nie może być usunięte z panelu ucznia.'}, status=403)

    profile = getattr(user, 'student_profile', None)
    deleted_at = timezone.now()

    try:
        _send_account_deletion_backup_email(user, profile, deleted_at)
    except BadHeaderError:
        return JsonResponse({'error': 'Nieprawidłowy nagłówek wiadomości.'}, status=400)
    except (OSError, SMTPException, Exception):
        return JsonResponse({'error': 'Nie udało się wysłać kopii danych konta do supportu. Konto nie zostało usunięte.'}, status=502)

    with transaction.atomic():
        LessonSlot.objects.filter(student=user).update(
            student=None,
            status=LessonSlot.STATUS_AVAILABLE,
        )
        LessonSlot.objects.filter(rejected_student=user).update(rejected_student=None)
        user.delete()

    logout(request)
    return JsonResponse({'detail': 'Konto zostało usunięte.'})
