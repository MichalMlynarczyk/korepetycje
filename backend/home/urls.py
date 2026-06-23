from django.urls import path

from . import views


urlpatterns = [
    path('csrf/', views.csrf, name='auth-csrf'),
    path('me/', views.me, name='auth-me'),
    path('register/', views.register, name='auth-register'),
    path('login/', views.login_view, name='auth-login'),
    path('logout/', views.logout_view, name='auth-logout'),
    path('calendar/', views.calendar_slots, name='calendar-slots'),
    path('calendar/toggle/', views.calendar_toggle_slot, name='calendar-toggle-slot'),
    path('calendar/reserve/', views.calendar_teacher_reserve_slot, name='calendar-teacher-reserve-slot'),
    path('calendar/decide/', views.calendar_decide_slot, name='calendar-decide-slot'),
    path('calendar/book/', views.calendar_book_slot, name='calendar-book-slot'),
    path('calendar/cancel/', views.calendar_cancel_slot, name='calendar-cancel-slot'),
    path('students/', views.students_list, name='students-list'),
    path('students/<int:student_id>/tokens/', views.student_tokens, name='student-tokens'),
    path('materials/', views.materials_list, name='materials-list'),
    path('materials/upload/', views.material_upload, name='material-upload'),
    path('materials/<int:material_id>/download/', views.material_download, name='material-download'),
    path('teachers/', views.teachers_list, name='teachers-list'),
    path('chat/', views.student_chat_messages, name='student-chat-messages'),
    path('chat/<int:student_id>/', views.chat_messages, name='chat-messages'),
]
