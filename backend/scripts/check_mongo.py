"""Check MongoDB collections and document counts.

Usage:
  Set `MONGODB_URI` in the environment, then run:
    python backend/scripts/check_mongo.py
"""
import os
import sys

uri = os.environ.get('MONGODB_URI')
if not uri:
    print('MONGODB_URI not set in environment', file=sys.stderr)
    sys.exit(1)
try:
    from mongoengine import connect
    from mongoengine.connection import get_db
    import pymongo
    import certifi
except Exception as e:
    print('Missing dependency (mongoengine/pymongo/certifi):', e, file=sys.stderr)
    sys.exit(1)


# 1) Try mongoengine (simple path)
try:
    connect(db='atmos_db', host=uri)
    db = get_db()
    cols = list(db.list_collection_names())
    print('collections (via mongoengine):', cols)
    for c in cols:
        try:
            cnt = db[c].count_documents({})
            print(c, cnt)
        except Exception as e:
            print(c, 'count_error', e)
    sys.exit(0)
except Exception as e_me:
    print('mongoengine connect failed:', repr(e_me), file=sys.stderr)

# 2) Try direct pymongo with certifi CA bundle
try:
    cafile = certifi.where()
    print('Trying direct pymongo connection with CA file:', cafile)
    client = pymongo.MongoClient(uri, tls=True, tlsCAFile=cafile, serverSelectionTimeoutMS=20000)
    db = client.get_database('atmos_db')
    cols = db.list_collection_names()
    print('collections (via pymongo):', cols)
    for c in cols:
        try:
            print(c, db[c].count_documents({}))
        except Exception as e:
            print(c, 'count_error', e)
    sys.exit(0)
except Exception as e_pym:
    print('pymongo connect failed:', repr(e_pym), file=sys.stderr)

# 3) Last resort: allow invalid certs (INSECURE) — only for debugging
try:
    print('\nRetrying with tlsAllowInvalidCertificates=True (INSECURE, only for debugging)', file=sys.stderr)
    client = pymongo.MongoClient(uri, tls=True, tlsAllowInvalidCertificates=True, serverSelectionTimeoutMS=20000)
    db = client.get_database('atmos_db')
    cols = db.list_collection_names()
    print('collections (via pymongo - insecure):', cols)
    for c in cols:
        try:
            print(c, db[c].count_documents({}))
        except Exception as e:
            print(c, 'count_error', e)
    sys.exit(0)
except Exception as e_insecure:
    print('Insecure pymongo attempt failed:', repr(e_insecure), file=sys.stderr)
    print('All connection attempts failed.', file=sys.stderr)
    sys.exit(2)
