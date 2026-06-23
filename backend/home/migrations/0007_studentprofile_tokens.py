from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0006_chatmessage'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentprofile',
            name='tokens',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
