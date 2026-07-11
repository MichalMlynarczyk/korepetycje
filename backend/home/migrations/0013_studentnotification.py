from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def notification_display_name(user):
    full_name = f'{user.first_name} {user.last_name}'.strip()
    return full_name or user.email or user.username


def create_existing_lesson_notifications(apps, schema_editor):
    LessonSlot = apps.get_model('home', 'LessonSlot')
    StudentNotification = apps.get_model('home', 'StudentNotification')

    for slot in LessonSlot.objects.select_related('teacher', 'student', 'rejected_student').all():
        teacher_name = notification_display_name(slot.teacher)
        time_message = f'{slot.date:%d.%m.%Y}, godz. {slot.start_time:%H:%M} - {slot.end_time:%H:%M}'

        if slot.status == 'booked' and slot.student_id:
            StudentNotification.objects.get_or_create(
                student_id=slot.student_id,
                lesson_slot_id=slot.id,
                kind='lesson_accepted',
                defaults={
                    'title': 'Korepetycje odbędą się',
                    'message': time_message,
                    'teacher_name': teacher_name,
                    'lesson_date': slot.date,
                    'start_time': slot.start_time,
                    'end_time': slot.end_time,
                },
            )

        if slot.rejected_student_id:
            StudentNotification.objects.get_or_create(
                student_id=slot.rejected_student_id,
                lesson_slot_id=slot.id,
                kind='lesson_rejected',
                defaults={
                    'title': 'Korepetycje nie odbędą się',
                    'message': time_message,
                    'teacher_name': teacher_name,
                    'lesson_date': slot.date,
                    'start_time': slot.start_time,
                    'end_time': slot.end_time,
                },
            )


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('home', '0012_chatreadstate'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kind', models.CharField(choices=[('lesson_accepted', 'Lesson accepted'), ('lesson_rejected', 'Lesson rejected'), ('tokens_added', 'Tokens added')], max_length=32)),
                ('title', models.CharField(max_length=180)),
                ('message', models.TextField()),
                ('teacher_name', models.CharField(blank=True, max_length=160)),
                ('lesson_date', models.DateField(blank=True, null=True)),
                ('start_time', models.TimeField(blank=True, null=True)),
                ('end_time', models.TimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('lesson_slot', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='notifications', to='home.lessonslot')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.RunPython(create_existing_lesson_notifications, migrations.RunPython.noop),
    ]
