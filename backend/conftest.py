"""
pytest configuration for Django + MongoEngine tests.
"""
import os
import django
import mongomock
from mongoengine import connect, disconnect
from django.conf import settings
import pytest
from mongoengine import get_db

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Setup Django
django.setup()


def pytest_configure(config):
    """Configure pytest with MongoEngine mock database for testing."""
    # Disconnect any existing connections
    disconnect()
    
    # Use mongomock for in-memory MongoDB testing (no real MongoDB needed)
    connect('atmos_db_test', mongo_client_class=mongomock.MongoClient)


def pytest_unconfigure(config):
    """Clean up after tests."""
    disconnect()


# Note: we intentionally avoid an autouse fixture that drops Mongo
# collections between each test. Django's `setUpTestData` creates shared
# fixtures for TestCase classes; dropping collections between tests
# would remove that data. Tests should manage their own cleanup or use
# explicit commands like `call_command('load_cities', ...)` when needed.
