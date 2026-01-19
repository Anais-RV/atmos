"""Finalize migration to MongoDB.

Runs the existing migration scripts to copy users and weather data
to MongoDB. Optionally removes Django migration files for the apps
`users` and `weather` (keeps __init__.py).

Usage:
  python backend/scripts/finalize_mongo_migration.py [--remove-django-migrations]

Warning: Removing migration files is irreversible in this script.
Make sure you have backups before using --remove-django-migrations.
"""
import os
import sys
import argparse

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from config.mongo_config import init_mongo


def log(msg):
    try:
        # LOG_FH is created in main() before any logging occurs
        LOG_FH.write(msg + '\n')
        LOG_FH.flush()
    except Exception:
        pass


def run_migrations():
    """Import and run the existing migration functions."""
    try:
        # import the migration modules and call their migrate functions
        from backend.scripts.migrate_users_to_mongo import migrate as migrate_users
        from backend.scripts.migrate_weather_to_mongo import migrate as migrate_weather
    except Exception:
        # fallback to relative imports if running from repo root
        from scripts.migrate_users_to_mongo import migrate as migrate_users
        from scripts.migrate_weather_to_mongo import migrate as migrate_weather

    # ensure mongo connection
    init_mongo()

    print('Migrating users...')
    log('Migrating users...')
    migrate_users()
    log('Users migration finished')

    print('Migrating weather...')
    log('Migrating weather...')
    migrate_weather()
    log('Weather migration finished')


def remove_django_migrations(apps=('users', 'weather')):
    """Delete migration files in the given apps, keep __init__.py."""
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_root = os.path.join(repo_root)
    for app in apps:
        mig_dir = os.path.join(backend_root, app, 'migrations')
        if not os.path.isdir(mig_dir):
            print(f'No migrations directory for {app} at {mig_dir}')
            continue
        for fname in os.listdir(mig_dir):
            if fname == '__init__.py':
                continue
            path = os.path.join(mig_dir, fname)
            try:
                os.remove(path)
                print(f'Removed {path}')
            except Exception as e:
                print(f'Failed to remove {path}: {e}')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--remove-django-migrations', action='store_true', help='Delete Django migration files for users and weather')
    args = parser.parse_args()

    # open log file
    global LOG_FH
    logdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'migration_logs')
    os.makedirs(logdir, exist_ok=True)
    logpath = os.path.join(logdir, 'finalize_migration.log')
    LOG_FH = open(logpath, 'a', encoding='utf-8')

    print('Initializing MongoDB connection...')
    log('Initializing MongoDB connection...')
    try:
        init_mongo()
    except Exception as e:
        print(f'Failed to initialize MongoDB: {e}')
        log(f'Failed to initialize MongoDB: {e}')
        LOG_FH.close()
        sys.exit(1)

    run_migrations()

    if args.remove_django_migrations:
        print('Removing Django migration files for apps: users, weather')
        log('Removing Django migration files for apps: users, weather')
        remove_django_migrations()

    print('Finalize migration complete. Verify your MongoDB data before further cleanup.')
    log('Finalize migration complete.')
    LOG_FH.close()


if __name__ == '__main__':
    main()


