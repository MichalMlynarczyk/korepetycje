from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0010_lessonslot_confirmed_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentprofile',
            name='onboarding_answers',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
