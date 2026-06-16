import json
from datetime import date, datetime, time, timedelta

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.models import Group
from django.db import models
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_http_methods, require_POST

from .models import ChatMessage, LessonSlot, StudentProfile


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


def _json_body(request):
    try:
        return json.loads(request.body.decode('utf-8') or '{}')
    except json.JSONDecodeError:
        return None


def _user_payload(user):
    profile = getattr(user, 'student_profile', None)
    role = 'teacher' if user.groups.filter(name='teacher').exists() else 'student'

    return {
        'id': user.id,
        'email': user.email,
        'full_name': profile.full_name if profile else user.get_full_name(),
        'role': role,
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

    return get_user_model().objects.filter(groups=teacher_group).order_by('id')


def _teacher_user():
    return _teacher_users().first()


def _chat_queryset(student, teacher, include_system=True):
    messages = ChatMessage.objects.filter(student=student).filter(
        models.Q(sender=teacher) | models.Q(recipient=teacher)
    )
    if not include_system:
        messages = messages.filter(is_system=False)

    return messages


def _chat_message_payload(message, viewer):
    return {
        'id': message.id,
        'body': message.body,
        'author': 'System' if message.is_system or not message.sender else _display_name(message.sender),
        'own': message.sender_id == viewer.id,
        'is_system': message.is_system,
        'time': timezone.localtime(message.created_at).strftime('%H:%M'),
    }


def _slot_payload(slot):
    student_name = None
    if slot.student_id:
        student_profile = getattr(slot.student, 'student_profile', None)
        student_name = student_profile.full_name if student_profile else slot.student.get_full_name()
    rejected_student_name = None
    if slot.rejected_student_id:
        rejected_profile = getattr(slot.rejected_student, 'student_profile', None)
        rejected_student_name = rejected_profile.full_name if rejected_profile else slot.rejected_student.get_full_name()

    return {
        'id': slot.id,
        'date': slot.date.isoformat(),
        'start_time': slot.start_time.strftime('%H:%M'),
        'end_time': slot.end_time.strftime('%H:%M'),
        'status': slot.status,
        'teacher': {
            'id': slot.teacher_id,
            'name': slot.teacher.get_full_name() or slot.teacher.email or slot.teacher.username,
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
    teacher = request.user if _is_teacher(request.user) else _teacher_user()
    _ensure_default_slots(teacher)

    slots = LessonSlot.objects.select_related('teacher', 'student', 'rejected_student').filter(
        date__gte=week_start,
        date__lte=week_end,
    )
    if _is_teacher(request.user):
        slots = slots.filter(teacher=request.user)

    return JsonResponse({
        'slots': [_slot_payload(slot) for slot in slots],
        'window': {
            'week_start': week_start.isoformat(),
            'min_date': _calendar_min_date().isoformat(),
            'max_date': _calendar_max_date().isoformat(),
        },
    })


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
    slot.save(update_fields=['end_time', 'status', 'student', 'rejected_student', 'updated_at'])

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

    slot = LessonSlot.objects.select_related('teacher', 'student').filter(
        id=data.get('slot_id'),
        teacher=request.user,
        status=LessonSlot.STATUS_PENDING,
    ).first()
    if not slot:
        return JsonResponse({'error': 'Nie znaleziono oczekującej rezerwacji.'}, status=404)

    if action == 'accept':
        slot.status = LessonSlot.STATUS_BOOKED
        slot.rejected_student = None
        slot.save(update_fields=['status', 'rejected_student', 'updated_at'])
    else:
        slot.rejected_student = slot.student
        slot.student = None
        slot.status = LessonSlot.STATUS_AVAILABLE
        slot.save(update_fields=['status', 'student', 'rejected_student', 'updated_at'])

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

    slot_id = data.get('slot_id')
    slot = LessonSlot.objects.select_related('teacher', 'student', 'rejected_student').filter(id=slot_id).first()
    if not slot:
        return JsonResponse({'error': 'Nie znaleziono terminu.'}, status=404)

    if slot.status != LessonSlot.STATUS_AVAILABLE:
        return JsonResponse({'error': 'Ten termin jest już zarezerwowany.'}, status=409)

    is_allowed, message = _is_slot_in_allowed_window(slot.date, slot.start_time)
    if not is_allowed:
        return JsonResponse({'error': message}, status=400)

    slot.student = request.user
    slot.status = LessonSlot.STATUS_PENDING
    slot.rejected_student = None
    slot.save(update_fields=['student', 'status', 'rejected_student', 'updated_at'])

    return JsonResponse({'slot': _slot_payload(slot)})


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
    if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Konto z tym adresem e-mail już istnieje.'}, status=409)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=full_name[:150],
    )
    StudentProfile.objects.create(user=user, full_name=full_name)
    for teacher in _teacher_users():
        ChatMessage.objects.create(
            student=user,
            sender=user,
            recipient=teacher,
            body=f'Nowy uczeń {full_name} zarejestrował się w platformie.',
            is_system=True,
        )
    login(request, user)

    return JsonResponse({'user': _user_payload(user)}, status=201)


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
        return JsonResponse({'error': 'Nieprawidłowy e-mail lub hasło.'}, status=400)

    login(request, user)
    return JsonResponse({'user': _user_payload(user)})


@csrf_exempt
@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({'detail': 'Wylogowano.'})
