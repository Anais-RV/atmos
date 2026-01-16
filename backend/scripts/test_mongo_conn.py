"""Test script: attempt direct pymongo connection using certifi CA bundle.

Run: python scripts/test_mongo_conn.py
"""
from pymongo import MongoClient
import certifi
import os

MONGODB_URI = os.environ.get('MONGODB_URI','mongodb+srv://sergiomadrid135:sergiomadrid135@cluster0.loijxvu.mongodb.net/')

print('Using URI:', MONGODB_URI)
try:
    client = MongoClient(MONGODB_URI, tls=True, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
    info = client.server_info()
    print('Connected OK, server info keys:', list(info.keys())[:5])
except Exception as e:
    import traceback
    print('Connection failed:')
    traceback.print_exc()
    raise
