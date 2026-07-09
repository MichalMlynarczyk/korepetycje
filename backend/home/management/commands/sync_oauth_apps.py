import os
from urllib.parse import urlparse

from allauth.socialaccount.models import SocialApp
from django.conf import settings
from django.contrib.sites.models import Site
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Synchronizes social login apps from environment variables.'

    def handle(self, *args, **options):
        site_domain = self._site_domain()
        site, _ = Site.objects.update_or_create(
            id=settings.SITE_ID,
            defaults={
                'domain': site_domain,
                'name': 'NaSTOmatMa',
            },
        )

        self._sync_app(
            site=site,
            provider='google',
            name='Google',
            client_id=os.getenv('GOOGLE_OAUTH_CLIENT_ID', '').strip(),
            secret=os.getenv('GOOGLE_OAUTH_CLIENT_SECRET', '').strip(),
        )
        self._sync_app(
            site=site,
            provider='facebook',
            name='Facebook',
            client_id=os.getenv('FACEBOOK_OAUTH_CLIENT_ID', '').strip(),
            secret=os.getenv('FACEBOOK_OAUTH_CLIENT_SECRET', '').strip(),
        )

        self.stdout.write(self.style.SUCCESS(f'OAuth apps synced for {site_domain}.'))

    def _site_domain(self):
        base_url = os.getenv('WAGTAILADMIN_BASE_URL', '').strip() or os.getenv('BACKEND_URL', '').strip()
        parsed = urlparse(base_url)
        if parsed.netloc:
            return parsed.netloc

        allowed_hosts = [
            host.strip()
            for host in os.getenv('DJANGO_ALLOWED_HOSTS', '').split(',')
            if host.strip() and host.strip() != 'backend'
        ]
        return allowed_hosts[-1] if allowed_hosts else 'localhost:8000'

    def _sync_app(self, site, provider, name, client_id, secret):
        if not client_id or not secret:
            return

        app, _ = SocialApp.objects.update_or_create(
            provider=provider,
            defaults={
                'name': name,
                'client_id': client_id,
                'secret': secret,
            },
        )
        app.sites.set([site])
