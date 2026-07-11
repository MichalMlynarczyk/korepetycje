from allauth.account.signals import user_signed_up
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.mail import BadHeaderError, send_mail
from django.db import transaction
from django.dispatch import receiver
from django.utils import timezone
from smtplib import SMTPException
import json

from .models import ChatMessage, StudentProfile


TEACHER_USERNAMES = ['KubaCRF_876_@gmail.com', 'HubertCRH_987_@gmail.com']


def _social_full_name(user, sociallogin):
    extra_data = {}
    if sociallogin and sociallogin.account:
        extra_data = sociallogin.account.extra_data or {}

    full_name = (
        extra_data.get('name')
        or user.get_full_name()
        or user.email
        or user.username
        or 'Uczeń'
    )
    return str(full_name).strip()[:160]


def _teacher_users():
    teacher_group = Group.objects.filter(name='teacher').first()
    if not teacher_group:
        return get_user_model().objects.none()

    return get_user_model().objects.filter(
        groups=teacher_group,
        username__in=TEACHER_USERNAMES,
    )


def _send_new_student_notification_email(user, profile):
    created_at = profile.created_at if profile else user.date_joined
    local_created_at = timezone.localtime(created_at)
    onboarding_answers = profile.onboarding_answers if profile else {}
    message = (
        'Nowy uczeń zarejestrował się w NaSTOmatMa.\n\n'
        f'ID użytkownika: {user.id}\n'
        f'Imię i nazwisko: {profile.full_name if profile else user.get_full_name() or user.email or user.username}\n'
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


@receiver(user_signed_up)
def create_student_profile_for_social_signup(request, user, sociallogin=None, **kwargs):
    if user.groups.filter(name='teacher').exists():
        return

    full_name = _social_full_name(user, sociallogin)

    with transaction.atomic():
        profile, created = StudentProfile.objects.get_or_create(
            user=user,
            defaults={'full_name': full_name},
        )

        if not created:
            return

        if not user.first_name:
            user.first_name = full_name[:150]
            user.save(update_fields=['first_name'])

        for teacher in _teacher_users():
            ChatMessage.objects.create(
                student=user,
                sender=user,
                recipient=teacher,
                body=f'Nowy uczeń {full_name} zarejestrował się w platformie.',
                is_system=True,
            )

    try:
        _send_new_student_notification_email(user, profile)
    except (BadHeaderError, OSError, SMTPException):
        return
