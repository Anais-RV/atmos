from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

def hashed_passwords_test():
    """
    Verifica que todas las contraseñas estén hasheadas
    """
    users = User.objects.all()
    users_problems = []

    for user in users:
        if not user.password.startswith('pbkdf2_sha256'):
            users_problems.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "password": user.password, # Solo para debugging
            })
    
    if users_problems:
        print("⚠️ ALERTA: Se encontraron usuarios con contraseñas sin encriptar o hasheadas")
        for u in users_problems:
            print(f" - Usuario: {u['username']} | Id: {u['id']}")
    else:
        print("🆗 Todas las contraseñas están encriptadas/hasheadas correctamente.")
    
    return len(users_problems) == 0

if __name__ == "__main__":
    hashed_passwords_test()

# En terminal ejecutar:
# python manage.py shell < check_passwords.py

# Otra manera de verificar contraseñas hasheadas
# SQLite Consulta SQL:
# --------------------------------------
# SELECT *
# FROM auth_user
# WHERE password LIKE 'pbkdf2_sha256$%'
# LIMIT 10;
# -------------------------------------- 