"""
Compatibility layer: expose `User`, `PasswordResetToken`, `UserPreferences`,
and `Tag` symbols backed by MongoEngine documents so imports from
`users.models` continue to work when using MongoDB.

Signals and Django ORM behavior are intentionally removed here — the
application should use `users.documents` APIs when creating users or
managing preferences in MongoDB mode.
"""

from .documents import (
    UserDocument as User,
    PasswordResetTokenDocument as PasswordResetToken,
    UserPreferencesDocument as UserPreferences,
    TagDocument as Tag,
)
