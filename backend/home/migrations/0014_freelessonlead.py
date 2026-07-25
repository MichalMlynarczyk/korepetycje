from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0013_studentnotification'),
    ]

    operations = [
        migrations.CreateModel(
            name='FreeLessonLead',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parent_full_name', models.CharField(max_length=160)),
                ('student_full_name', models.CharField(max_length=160)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=32)),
                ('school_class', models.CharField(max_length=80)),
                ('source_path', models.CharField(blank=True, max_length=180)),
                ('user_agent', models.TextField(blank=True)),
                ('notification_sent_at', models.DateTimeField(blank=True, null=True)),
                ('notification_error', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
