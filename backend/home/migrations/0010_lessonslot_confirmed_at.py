from django.db import migrations, models


def backfill_confirmed_at(apps, schema_editor):
    LessonSlot = apps.get_model('home', 'LessonSlot')
    LessonSlot.objects.filter(status='booked', confirmed_at__isnull=True).update(
        confirmed_at=models.F('updated_at'),
    )


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0009_set_localhost_site'),
    ]

    operations = [
        migrations.AddField(
            model_name='lessonslot',
            name='confirmed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.RunPython(backfill_confirmed_at, migrations.RunPython.noop),
    ]
