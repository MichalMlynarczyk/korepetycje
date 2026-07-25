from django.contrib import admin

from .models import FreeLessonLead


@admin.register(FreeLessonLead)
class FreeLessonLeadAdmin(admin.ModelAdmin):
    list_display = (
        'created_at',
        'parent_full_name',
        'student_full_name',
        'school_class',
        'email',
        'phone',
        'notification_sent_at',
    )
    search_fields = ('parent_full_name', 'student_full_name', 'email', 'phone')
    list_filter = ('school_class', 'created_at', 'notification_sent_at')
    readonly_fields = ('created_at', 'notification_sent_at', 'notification_error', 'source_path', 'user_agent')
