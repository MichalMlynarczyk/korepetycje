import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

import home.models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0007_studentprofile_tokens'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentMaterial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=180)),
                ('message', models.TextField(blank=True)),
                ('file', models.FileField(upload_to=home.models.student_material_upload_path)),
                ('original_filename', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=120)),
                ('size', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_materials', to=settings.AUTH_USER_MODEL)),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_materials', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
