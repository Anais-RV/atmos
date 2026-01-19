from pymongo import MongoClient
import traceback
uri='mongodb+srv://sergiomadrid135:sergiomadrid135@cluster0.loijxvu.mongodb.net/'
print('Trying insecure TLS (allow invalid certs)')
try:
    c=MongoClient(uri, tls=True, tlsAllowInvalidCertificates=True, tlsAllowInvalidHostnames=True, serverSelectionTimeoutMS=5000)
    print('server_info keys:', list(c.server_info().keys())[:5])
except Exception:
    traceback.print_exc()
    raise
