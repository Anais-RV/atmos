"""MongoEngine configuration helper.

Initializes a connection to MongoDB Atlas using Django settings.
"""
import os
import mongoengine
import certifi
import traceback


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

    if not mongodb_uri:
        raise RuntimeError('MONGODB_URI not configured')

    # First attempt: default connect
    try:
        conn = mongoengine.connect(db=mongodb_db, host=mongodb_uri, connectTimeoutMS=connect_timeout_ms)
        return conn
    except Exception as e_default:
        # Try again with explicit TLS + certifi CA bundle
        try:
            cafile = certifi.where()
            # Provide clearer options for TLS; pymongo will accept these
            conn = mongoengine.connect(
                db=mongodb_db,
                host=mongodb_uri,
                tls=True,
                tlsCAFile=cafile,
                connectTimeoutMS=connect_timeout_ms,
            )
            return conn
        except Exception as e_tls:
            # Aggregate tracebacks to help debugging
            tb = traceback.format_exc()
            raise RuntimeError(
                f"Failed to initialize mongoengine. Default error: {e_default!r}; "
                f"TLS retry error: {e_tls!r}. Traceback: {tb}"
            )
