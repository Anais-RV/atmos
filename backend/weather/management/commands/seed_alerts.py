from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from weather.documents import AlertDocument
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = "Seed sample alerts for testing session-gated persistence"

    def handle(self, *args, **options):
        # Get or create test user
        test_user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'testuser@example.com',
                'first_name': 'Test',
                'last_name': 'User'
            }
        )
        
        if created:
            test_user.set_password('testpass123')
            test_user.save()
            self.stdout.write(self.style.SUCCESS(f"✓ Created test user: {test_user.username}"))
        else:
            self.stdout.write(self.style.SUCCESS(f"✓ Using existing test user: {test_user.username}"))
        
        # Clear existing alerts for this user
        AlertDocument.objects(user_id=test_user.id).delete()
        self.stdout.write(self.style.SUCCESS(f"✓ Cleared existing alerts for user {test_user.id}"))
        
        # Sample alerts
        sample_alerts = [
            {
                'user_id': test_user.id,
                'city_id': 1,
                'title': 'Alerta de temperatura extrema',
                'type': 'temperature_extreme',
                'message': 'Se esperan temperaturas máximas superiores a 40°C en Madrid.',
                'created_at': datetime.utcnow() - timedelta(hours=2),
            },
            {
                'user_id': test_user.id,
                'city_id': 2,
                'title': 'Aviso de tormenta',
                'type': 'storm_warning',
                'message': 'Posibles tormentas eléctricas con granizo en Barcelona.',
                'created_at': datetime.utcnow() - timedelta(hours=1),
            },
            {
                'user_id': test_user.id,
                'city_id': 3,
                'title': 'Alerta de lluvia intensa',
                'type': 'heavy_rain',
                'message': 'Se esperan precipitaciones abundantes en Valencia.',
                'created_at': datetime.utcnow(),
            },
        ]
        
        created_count = 0
        for alert_data in sample_alerts:
            alert = AlertDocument(**alert_data)
            alert.save()
            created_count += 1
            self.stdout.write(f"  ✓ Created alert: {alert_data['title']}")
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\n✓ Seeded {created_count} sample alerts for user {test_user.username} (id={test_user.id})"
            )
        )
        self.stdout.write("\nTo test:")
        self.stdout.write("  1. Log in as testuser:testpass123")
        self.stdout.write("  2. Navigate to /history page")
        self.stdout.write("  3. Should see 3 sample alerts from newest to oldest")
