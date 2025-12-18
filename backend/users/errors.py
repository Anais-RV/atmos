# Archivo que contiene los códigos de error

class PasswordResetError:
    """
    Códigos de error para la recuperación de contraseña.
    """
    TOKEN_EXPIRED = "token_expired"
    TOKEN_USED = "token_used"
    TOKEN_INVALID = "token_invalid"
    EMAIL_NOT_FOUND = "email_not_found"
    ACCOUNT_DISABLED = "account_disabled"
    EMAIL_SEND_FAILED = "email_send_failed"
    PASSWORD_VALIDATION_FAILED = "password_validation_failed"