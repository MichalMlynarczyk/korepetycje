from allauth.account.signals import user_signed_up
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import transaction
from django.dispatch import receiver

from .models import ChatMessage, StudentProfile


TEACHER_USERNAMES = ['kuba@admin.com', 'norber@admin.com']


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
