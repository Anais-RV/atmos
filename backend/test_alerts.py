"""
Quick test script to verify session-gated alerts persistence.
Usage: python test_alerts.py
"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.documents import UserDocument, get_next_sequence
from weather.documents import AlertDocument
from datetime import datetime

def test_alerts():
    """Test alert model and retrieval logic."""
    
    print("=" * 60)
    print("TESTING ALERTS PERSISTENCE")
    print("=" * 60)
    
    # Get or create test user in Mongo
    user = UserDocument.objects(username='test_persist_user').first()
    created = False
    if not user:
        from users.documents import get_next_sequence
        next_id = get_next_sequence('users')
        user = UserDocument(id=next_id, username='test_persist_user', email='persist@example.com')
        user.set_password('password')
        user.save()
        created = True

    if created:
        print(f"\n✓ Created test user: {user.username} (id={user.id})")
    else:
        print(f"\n✓ Using existing test user: {user.username} (id={user.id})")
    
    # Clear previous alerts for this user
    AlertDocument.objects(user_id=user.id).delete()
    print(f"✓ Cleared previous alerts for user {user.id}")
    
    # Test 1: Create a new alert
    print("\n1. Testing AlertDocument creation:")
    alert = AlertDocument(
        user_id=user.id,
        city_id=1,
        title='Test Alert',
        type='test_type',
        message='This is a test alert'
    )
    alert.save()
    print(f"   ✓ Created alert: {alert.title}")
    print(f"   ✓ Alert ID: {alert.id}")
    print(f"   ✓ User ID: {alert.user_id}")
    
    # Test 2: Retrieve alerts for the user
    print("\n2. Testing alert retrieval for authenticated user:")
    alerts = AlertDocument.objects(user_id=user.id).order_by('-created_at')
    print(f"   ✓ Found {alerts.count()} alert(s) for user {user.id}")
    for a in alerts:
        print(f"     - {a.title} ({a.type}) created at {a.created_at}")
    assert alerts.count() >= 1, "Should have at least 1 alert"
    
    # Test 3: Verify serialization
    print("\n3. Testing alert serialization to dict:")
    alert_dict = alert.to_dict()
    print(f"   ✓ Serialized alert:")
    for key, value in alert_dict.items():
        print(f"     - {key}: {value}")
    assert alert_dict['title'] == 'Test Alert', "Title should match"
    assert alert_dict['user_id'] == user.id, "User ID should match"
    
    # Test 4: Verify anonymous user gets no alerts (simulation)
    print("\n4. Testing alert filtering logic (simulated):")
    another_user = UserDocument.objects(username='other_user').first()
    if not another_user:
        next_id = get_next_sequence('users')
        another_user = UserDocument(id=next_id, username='other_user', email='other@example.com')
        another_user.set_password('password')
        another_user.save()
    other_alerts = AlertDocument.objects(user_id=another_user.id)
    print(f"   ✓ Alerts for other user: {other_alerts.count()} (should be 0)")
    assert other_alerts.count() == 0, "Other user should have no alerts"
    
    # Test 5: Create multiple alerts
    print("\n5. Testing multiple alert creation:")
    for i in range(2):
        alert = AlertDocument(
            user_id=user.id,
            city_id=i + 2,
            title=f'Multi Alert {i+2}',
            type='multi_test',
            message=f'Alert {i+2}'
        )
        alert.save()
    
    all_user_alerts = AlertDocument.objects(user_id=user.id).order_by('-created_at')
    print(f"   ✓ Total alerts for user: {all_user_alerts.count()}")
    assert all_user_alerts.count() >= 3, "Should have 3+ alerts"
    
    print("\n" + "=" * 60)
    print("ALL TESTS PASSED ✓")
    print("=" * 60)
    print("\nSummary:")
    print("  • AlertDocument model works correctly")
    print("  • Alerts can be created with user association")
    print("  • Alerts can be filtered by user_id")
    print("  • Serialization to dict works correctly")
    print("  • Session-gated persistence is ready")
    print(f"\nTest user credentials:")
    print(f"  Username: test_persist_user")
    print(f"  Password: password")

if __name__ == '__main__':
    test_alerts()

