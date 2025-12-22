"""MongoEngine configuration helper.

Initializes a connection to MongoDB Atlas using Django settings.
"""
import mongoengine


def init_mongo(mongodb_uri=None, mongodb_db=None):
    """Initialize mongoengine connection.

    Uses provided parameters or reads from Django settings.
    Returns the connection object.
    """
    # If not provided, read from Django settings
    if mongodb_uri is None or mongodb_db is None:
        from django.conf import settings
        mongodb_uri = mongodb_uri or getattr(settings, 'MONGODB_URI', None)
        mongodb_db = mongodb_db or getattr(settings, 'MONGODB_DB', 'atmos_db')

    if not mongodb_uri:
        raise RuntimeError('MONGODB_URI not configured')

    # mongoengine.connect accepts host=uri
    conn = mongoengine.connect(db=mongodb_db, host=mongodb_uri)
    return conn
