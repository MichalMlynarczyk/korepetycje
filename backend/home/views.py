import json

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .models import StudentProfile


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


@require_GET
@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


@require_GET
def me(request):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False})

    return JsonResponse({
        'authenticated': True,
        'user': _user_payload(request.user),
    })


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
    login(request, user)

    return JsonResponse({'user': _user_payload(user)}, status=201)


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


@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({'detail': 'Wylogowano.'})
