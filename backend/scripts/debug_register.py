import os
import django
import sys

# Ensure backend package root is on sys.path so `config` imports work
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# For local debugging ensure MongoEngine uses mongomock (same behavior as pytest conftest)
try:
    import mongomock
    from mongoengine import connect, disconnect
    disconnect()
    connect('atmos_db_test', mongo_client_class=mongomock.MongoClient)
except Exception:
    # If mongomock isn't available, tests will attempt real MongoDB (may fail)
    pass

from rest_framework.test import APIClient

client = APIClient()
url = '/api/auth/register/'
data = {
    'username': 'debuguser',
    'email': 'debug@example.com',
    'password': 'DebugPass123',
    'password2': 'DebugPass123'
}

resp = client.post(url, data, format='json')
print('status_code=', resp.status_code)
try:
    print('data=', resp.data)
except Exception:
    print('response content (raw)=', resp.content)
