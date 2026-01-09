"""MongoEngine configuration helper.

Initializes a connection to MongoDB Atlas using Django settings.
"""
import os
import mongoengine
import traceback
import warnings

# mongomock is an optional dev dependency; import lazily when needed
try:
    import mongomock
except Exception:
    mongomock = None

try:
    import certifi
except Exception:
    certifi = None


def init_mongo(mongodb_uri=None, mongodb_db=None, connect_timeout_ms=20000):
    """Initialize mongoengine connection with safer TLS handling.

    Tries a default connect first. If it fails (common on some Windows/OpenSSL
    setups when connecting to Atlas SRV URIs), retries forcing TLS and
    providing certifi's CA bundle.

    Raises RuntimeError on failure with the inner exception message.
    """
    # If not provided, try environment variables first (so this function
    # can be used without Django settings configured), then fall back to
    # Django settings if needed.
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
            # If Django settings are not configured and env vars not present,
            # ensure we surface a clear error below.
            pass

    # If explicitly requested to use mongomock (dev/test), prefer that.
    use_mock = os.environ.get('USE_MOCK_MONGO') in ('1', 'true', 'True')
    if use_mock:
        if mongomock is None:
            raise RuntimeError('mongomock is not installed but USE_MOCK_MONGO is set')
        # Connect using mongomock's MongoClient
        return mongoengine.connect(db=mongodb_db or 'atmos_db', host='mongomock://localhost', mongo_client_class=mongomock.MongoClient)

    if not mongodb_uri:
        # If no URI provided, fallback to mongomock when available to avoid crashes in dev.
        if mongomock is not None:
            warnings.warn('MONGODB_URI not set — falling back to mongomock for development/testing')
            return mongoengine.connect(db=mongodb_db or 'atmos_db', host='mongomock://localhost', mongo_client_class=mongomock.MongoClient)
        raise RuntimeError('MONGODB_URI not configured')

    # First attempt: default connect
    # Attempt normal connection, with a TLS + certifi retry on failure.
    try:
        conn = mongoengine.connect(db=mongodb_db, host=mongodb_uri, connectTimeoutMS=connect_timeout_ms)
        return conn
    except Exception as e_default:
        # If certifi is available, retry with explicit TLS CA bundle
        if certifi is not None:
            try:
                cafile = certifi.where()
                conn = mongoengine.connect(
                    db=mongodb_db,
                    host=mongodb_uri,
                    tls=True,
                    tlsCAFile=cafile,
                    connectTimeoutMS=connect_timeout_ms,
                )
                return conn
            except Exception as e_tls:
                # If mongomock is available, fallback to it in dev
                if mongomock is not None:
                    warnings.warn(
                        'Connection to MongoDB failed; falling back to mongomock for development/testing'
                    )
                    return mongoengine.connect(db=mongodb_db or 'atmos_db', host='mongomock://localhost', mongo_client_class=mongomock.MongoClient)
                tb = traceback.format_exc()
                raise RuntimeError(
                    f"Failed to initialize mongoengine. Default error: {e_default!r}; TLS retry error: {e_tls!r}. Traceback: {tb}"
                )
        else:
            # No certifi: if mongomock exists, fallback; otherwise bubble up.
            if mongomock is not None:
                warnings.warn('Default Mongo connection failed and certifi not available; using mongomock')
                return mongoengine.connect(db=mongodb_db or 'atmos_db', host='mongomock://localhost', mongo_client_class=mongomock.MongoClient)
            tb = traceback.format_exc()
            raise RuntimeError(f"Failed to initialize mongoengine. Default error: {e_default!r}. Traceback: {tb}")
