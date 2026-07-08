from django.db import migrations


def set_localhost_site(apps, schema_editor):
    Site = apps.get_model('sites', 'Site')
    Site.objects.update_or_create(
        id=1,
        defaults={
            'domain': 'localhost:8000',
            'name': 'NaSTOmatMa local',
        },
    )


def restore_default_site(apps, schema_editor):
    Site = apps.get_model('sites', 'Site')
    Site.objects.update_or_create(
        id=1,
        defaults={
            'domain': 'example.com',
            'name': 'example.com',
        },
    )


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0008_studentmaterial'),
        ('sites', '0002_alter_domain_unique'),
    ]

    operations = [
        migrations.RunPython(set_localhost_site, restore_default_site),
    ]
