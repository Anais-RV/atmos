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


import inspect
from django.test import TestCase as DjangoTestCase


@pytest.fixture(autouse=True)
def clean_mongo_between_tests(request):
        """Autouse fixture to provide per-test DB isolation.

        - For plain pytest tests (functions, pytest-style classes) this drops
            all collections before and after each test.
        - For Django `TestCase` subclasses (which rely on `setUpTestData`),
            the fixture skips cleanup to avoid removing class-level fixtures.
        """
        cls = getattr(request.node, "cls", None)

        # Always drop collections before the test to ensure a clean slate.
        db = get_db()
        for coll in list(db.list_collection_names()):
            db.drop_collection(coll)

        # If the test is a Django TestCase, re-run its class-level
        # `setUpTestData` (if provided) so class fixtures are recreated.
        if cls and inspect.isclass(cls) and issubclass(cls, DjangoTestCase):
            setup = getattr(cls, 'setUpTestData', None)
            if callable(setup):
                try:
                    cls.setUpTestData()
                except Exception:
                    # If setUpTestData depends on a transactional DB or other
                    # environment not available in mongomock, ignore and continue.
                    pass

        yield

        # Clean after the test as well to avoid leaks between tests
        for coll in list(db.list_collection_names()):
            db.drop_collection(coll)
