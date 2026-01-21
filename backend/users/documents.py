from mongoengine import Document, StringField, EmailField, BooleanField, DateTimeField, ReferenceField, IntField, ListField, EmbeddedDocument, EmbeddedDocumentField
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime


class TagDocument(Document):
    meta = {'collection': 'tags'}
    id = IntField(primary_key=True)
    user_id = IntField(required=True)
    name = StringField(max_length=100)
    color = StringField(max_length=32)
    created_at = DateTimeField(default=datetime.utcnow)


# Simple counter collection to generate incremental integer IDs when needed
class Counter(Document):
    meta = {'collection': 'counters'}
    id = StringField(primary_key=True)
    seq = IntField(default=0)

def get_next_sequence(name):
    """Atomically increment and return the next sequence number for `name`."""
    # Use modify with upsert to increment atomically
    counter = Counter.objects(id=name).modify(upsert=True, new=True, inc__seq=1)
    return counter.seq


class UserPreferencesDocument(EmbeddedDocument):
    theme = StringField(max_length=20, default='light')
    language = StringField(max_length=10, default='es', choices=['es', 'en', 'pt', 'pt_BR', 'ru'])
    favourite_weather_station = StringField(max_length=200, null=True)


class UserDocument(Document):
    meta = {'collection': 'users'}
    id = IntField(primary_key=True)
    username = StringField(max_length=150, required=True)
    email = EmailField(required=True)
    password = StringField(required=True)  # hashed
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    is_superuser = BooleanField(default=False)
    preferences = EmbeddedDocumentField(UserPreferencesDocument, null=True)
    tags = ListField(IntField())
    date_joined = DateTimeField(default=datetime.utcnow)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)


class PasswordResetTokenDocument(Document):
    meta = {'collection': 'password_reset_tokens', 'ordering': ['-created_at']}
    user_id = IntField(required=True)
    token = StringField(required=True, unique=True)
    created_at = DateTimeField(default=datetime.utcnow)
    expires_at = DateTimeField()
    is_used = BooleanField(default=False)

    def is_valid(self):
        from datetime import datetime
        if self.is_used:
            return False
        if datetime.utcnow() > self.expires_at:
            return False
        return True

    def mark_as_used(self):
        self.is_used = True
        self.save()

    @classmethod
    def invalidate_user_tokens(cls, user_id):
        cls.objects(user_id=user_id, is_used=False).update(set__is_used=True)
