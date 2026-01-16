"""
Seed sample alerts for testing session-gated persistence.
Run from project root: python manage.py shell < scripts/seed_alerts.py
"""

import sys
import os

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from users.documents import UserDocument, get_next_sequence
from weather.documents import AlertDocument
from datetime import datetime, timedelta

def seed_alerts():
    """Create sample alerts for testing."""
    
    # Get or create test user in Mongo
    test_user = UserDocument.objects(username='testuser').first()
    created = False
    if not test_user:
        next_id = get_next_sequence('users')
        test_user = UserDocument(id=next_id, username='testuser', email='testuser@example.com')
        test_user.set_password('testpass123')
        test_user.save()
        created = True

    if created:
        print(f"✓ Created test user: {test_user.username}")
    else:
        print(f"✓ Using existing test user: {test_user.username}")
    
    # Clear existing alerts for this user
    AlertDocument.objects(user_id=test_user.id).delete()
    print(f"✓ Cleared existing alerts for user {test_user.id}")
    
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
        print(f"  ✓ Created alert: {alert_data['title']}")
    
    print(f"\n✓ Seeded {created_count} sample alerts for user {test_user.username} (id={test_user.id})")
    print("\nTo test:")
    print("  1. Log in as testuser:testpass123")
    print("  2. Navigate to /history page")
    print("  3. Should see 3 sample alerts from newest to oldest")

if __name__ == '__main__':
    seed_alerts()
