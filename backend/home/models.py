from django.conf import settings
from django.db import models
from django.utils import timezone


def student_material_upload_path(instance, filename):
    return f'student-materials/student-{instance.student_id}/{filename}'


class StudentProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile',
    )
    full_name = models.CharField(max_length=160)
    tokens = models.PositiveIntegerField(default=0)
    onboarding_answers = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


class LessonSlot(models.Model):
    STATUS_AVAILABLE = 'available'
    STATUS_PENDING = 'pending'
    STATUS_BOOKED = 'booked'
    STATUS_CHOICES = [
        (STATUS_AVAILABLE, 'Available'),
        (STATUS_PENDING, 'Pending'),
        (STATUS_BOOKED, 'Booked'),
    ]

    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teaching_slots',
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='booked_slots',
        null=True,
        blank=True,
    )
    rejected_student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='rejected_slots',
        null=True,
        blank=True,
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'start_time']
        constraints = [
            models.UniqueConstraint(
                fields=['teacher', 'date', 'start_time'],
                name='unique_teacher_lesson_slot',
            ),
        ]

    def __str__(self):
        return f'{self.teacher} {self.date} {self.start_time}-{self.end_time}'


class ChatMessage(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_chat_messages',
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='sent_chat_messages',
        null=True,
        blank=True,
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_chat_messages',
    )
    body = models.TextField()
    is_system = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'{self.created_at:%Y-%m-%d %H:%M} {self.body[:40]}'


class ChatReadState(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_chat_read_states',
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teacher_chat_read_states',
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_read_states',
    )
    last_read_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'teacher', 'user'],
                name='unique_chat_read_state',
            ),
        ]


class StudentNotification(models.Model):
    KIND_LESSON_ACCEPTED = 'lesson_accepted'
    KIND_LESSON_REJECTED = 'lesson_rejected'
    KIND_TOKENS_ADDED = 'tokens_added'
    KIND_CHOICES = [
        (KIND_LESSON_ACCEPTED, 'Lesson accepted'),
        (KIND_LESSON_REJECTED, 'Lesson rejected'),
        (KIND_TOKENS_ADDED, 'Tokens added'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    lesson_slot = models.ForeignKey(
        LessonSlot,
        on_delete=models.SET_NULL,
        related_name='notifications',
        null=True,
        blank=True,
    )
    kind = models.CharField(max_length=32, choices=KIND_CHOICES)
    title = models.CharField(max_length=180)
    message = models.TextField()
    teacher_name = models.CharField(max_length=160, blank=True)
    lesson_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.student_id} {self.kind} {self.created_at:%Y-%m-%d %H:%M}'


class StudentMaterial(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_materials',
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_materials',
    )
    title = models.CharField(max_length=180)
    message = models.TextField(blank=True)
    file = models.FileField(upload_to=student_material_upload_path)
    original_filename = models.CharField(max_length=255)
    content_type = models.CharField(max_length=120)
    size = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
