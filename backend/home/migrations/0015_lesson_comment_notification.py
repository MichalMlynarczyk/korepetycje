from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0014_freelessonlead'),
    ]

    operations = [
        migrations.AddField(
            model_name='lessonslot',
            name='teacher_comment',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='studentnotification',
            name='kind',
            field=models.CharField(
                choices=[
                    ('lesson_accepted', 'Lesson accepted'),
                    ('lesson_rejected', 'Lesson rejected'),
                    ('lesson_comment', 'Lesson comment'),
                    ('tokens_added', 'Tokens added'),
                ],
                max_length=32,
            ),
        ),
    ]
