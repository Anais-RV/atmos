"""MongoEngine configuration helper.

Initializes a connection to MongoDB Atlas using Django settings.
Falls back to mongomock if MongoDB Atlas SSL connection fails (Windows compatibility).
"""
import os
import mongoengine
import warnings

try:
    import certifi
except Exception:
    certifi = None

try:
    import mongomock
except Exception:
    mongomock = None


def init_mongo(mongodb_uri=None, mongodb_db=None, connect_timeout_ms=20000):
    """Initialize mongoengine connection to MongoDB Atlas with mongomock fallback.
    
    Args:
        mongodb_uri: MongoDB connection URI (default: from MONGODB_URI env/settings)
        mongodb_db: Database name (default: from MONGODB_DB env/settings)
        connect_timeout_ms: Connection timeout in milliseconds
    """
    # Get URI and DB name from env or settings
    if mongodb_uri is None:
        mongodb_uri = os.environ.get('MONGODB_URI')
    if mongodb_db is None:
        mongodb_db = os.environ.get('MONGODB_DB')

    if mongodb_uri is None or mongodb_db is None:
        try:
            from django.conf import settings
            mongodb_uri = mongodb_uri or getattr(settings, 'MONGODB_URI', None)
            mongodb_db = mongodb_db or getattr(settings, 'MONGODB_DB', 'atmos_db')
        except Exception:
            pass

    # Validate configuration
    if not mongodb_uri:
        raise RuntimeError('MONGODB_URI not configured')
    if not mongodb_db:
        mongodb_db = 'atmos_db'

    # Try to connect to MongoDB Atlas with SSL configuration for Windows
    try:
        connect_kwargs = {
            'db': mongodb_db,
            'host': mongodb_uri,
            'connectTimeoutMS': connect_timeout_ms,
            'serverSelectionTimeoutMS': 5000,
            # Use secure TLS with system CA bundle from certifi
            'tls': True,
            'retryWrites': False,
        }
        
        if certifi:
            # Provide certifi CA bundle for TLS verification
            connect_kwargs['tlsCAFile'] = certifi.where()
        
        conn = mongoengine.connect(**connect_kwargs)
        warnings.warn(f'✅ Connected to MongoDB Atlas: {mongodb_db}')
        return conn
    except Exception as e_connection:
        error_msg = str(e_connection).lower()
        is_ssl_error = 'ssl' in error_msg or 'handshake' in error_msg or 'tls' in error_msg
        
        # Fallback to mongomock for Windows SSL issues
        if is_ssl_error and mongomock is not None:
            warnings.warn(
                f'⚠️  MongoDB Atlas SSL connection failed (Windows compatibility issue). '
                f'Using mongomock in-memory database.\n   Original error: {str(e_connection)[:80]}'
            )
            try:
                conn = mongoengine.connect(
                    db=mongodb_db or 'atmos_db',
                    host='mongodb://localhost:27017',
                    mongo_client_class=mongomock.MongoClient
                )
                warnings.warn('✅ mongomock initialized successfully as fallback')
                return conn
            except Exception as e_mock:
                raise RuntimeError(f"mongomock fallback also failed: {e_mock}")
        else:
            raise RuntimeError(f"MongoDB connection failed: {e_connection}")
