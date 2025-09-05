from django.core.management.base import BaseCommand
from django.utils import timezone
from projectcanvas.models import PendingUser

class Command(BaseCommand):
    help = 'Delete expired pending users older than specified time'

    def handle(self, *args, **options):
        # Calculate expiration time (e.g., 24 hours ago)
        expiration_time = timezone.now() - timezone.timedelta(hours=24)
        
        # Find pending users created before expiration time
        expired_users = PendingUser.objects.filter(created_at__lt=expiration_time)
        
        count = expired_users.count()
        expired_users.delete()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {count} expired pending user registrations')
        )