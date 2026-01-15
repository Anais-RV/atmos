# 🌿 Estrategia de Branching - Atmos v2.0

## 📋 Resumen Ejecutivo

Debido a que un grupo reducido de alumnos continuará trabajando en una versión 2.0 del proyecto, hemos implementado una **estrategia de doble rama principal**:

- **`dev`** → Versión 1.0 (estable, mantenimiento mínimo)
- **`beta`** → Versión 2.0 (desarrollo activo, mejoras avanzadas)

---

## 🎯 Objetivos

1. **Preservar** la versión 1.0 estable en `dev`
2. **Permitir** desarrollo experimental sin afectar la versión estable
3. **Facilitar** que el grupo reducido trabaje sin bloqueos
4. **Mantener** calidad del código mediante PRs revisadas

---

## 📊 Estructura de Ramas

```
main (producción)
  ├── dev (v1.0 - mantenimiento)
  │    └── feat/* (solo hotfixes críticos)
  │
  └── beta (v2.0 - desarrollo activo)
       ├── feat/*
       ├── refactor/*
       └── fix/*
```

---

## 🔄 Flujo de Trabajo

### Para desarrollo en v2.0 (beta):

1. **Crear rama desde beta:**
   ```bash
   git checkout beta
   git pull origin beta
   git checkout -b feat/nueva-funcionalidad
   ```

2. **Desarrollar y hacer commits:**
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

3. **Subir y crear PR hacia beta:**
   ```bash
   git push origin feat/nueva-funcionalidad
   gh pr create --base beta --title "Feat: Nueva funcionalidad"
   ```

4. **Review y merge:** PR se mergea a `beta`, NO a `dev`

---

## 📝 Pull Requests Pendientes

### Estado Actual (15/01/2026)

#### PR #84: Refactor/resume_graphi
- **Rama:** `refactor/resume_graphi`
- **Base:** Debe cambiar a `beta`
- **Cambios:** 
  - Ajustes CSS en gráficos
  - Fix "Too Many Requests"
  - Mejoras responsive
- **Archivos:** 2 archivos, +47/-6 líneas
- **Status:** ⏳ Pendiente de review

#### PR #81: Refactor/search_city  
- **Rama:** `refactor/search_city`
- **Base:** Debe cambiar a `beta`
- **Cambios:**
  - Mejora estilos CitySelector
  - Filtro por comunidad autónoma
  - Mejoras UI
- **Archivos:** 3 archivos, +173/-9 líneas
- **Status:** ⏳ Pendiente de review

#### PR #78: Refactor Migration database (⚠️ CRÍTICA)
- **Rama:** `refactor/migration_database`
- **Base:** Debe cambiar a `beta`
- **Cambios:**
  - 🔄 **Migración de SQLite/PostgreSQL a MongoDB**
  - Implementación MongoEngine
  - Sistema de alertas
  - Contexto de autenticación
  - Scripts de migración
- **Archivos:** 76 archivos, +2929/-1419 líneas
- **Status:** ⏳ **REQUIERE REVIEW EXHAUSTIVA**
- **Notas:** 
  - Cambio arquitectónico mayor
  - Incluye backups de migraciones antiguas
  - Nuevos documentos MongoDB para users/weather
  - Tests adaptados a mongomock

---

## ⚠️ Consideraciones Importantes

### Para PR #78 (Migración MongoDB):

Esta PR representa un **cambio arquitectónico significativo**:

✅ **Aspectos positivos:**
- Scripts de migración bien documentados
- Backups de migraciones antiguas preservados
- Tests adaptados con mongomock
- Sistema de alertas implementado

⚠️ **Riesgos a revisar:**
1. **Compatibilidad:** ¿Todos los endpoints funcionan igual?
2. **Datos:** ¿Los scripts de migración son reversibles?
3. **Tests:** ¿Todos los tests pasan con MongoDB?
4. **Dependencias:** `mongoengine`, `pymongo`, `mongomock` agregados
5. **Configuración:** Cambios en `settings.py` y nuevo `mongo_config.py`

**Recomendación:** 
- ✅ Revisar exhaustivamente antes de aprobar
- ✅ Testear en entorno local completo
- ✅ Validar que no rompe funcionalidad existente
- ✅ Documentar proceso de rollback si falla

---

## 🔧 Cambio de Base de PRs

Las PRs pendientes deben cambiar su base de `dev` a `beta`:

```bash
# Desde la rama de la PR
git fetch origin
git rebase origin/beta
git push --force-with-lease
```

Luego en GitHub, editar la PR y cambiar base branch de `dev` a `beta`.

---

## 📦 Estrategia de Merge a Main

Cuando beta esté lista para producción:

```bash
# 1. Asegurar que beta está estable
git checkout beta
git pull origin beta

# 2. Mergear a main
git checkout main
git merge beta --no-ff -m "Release: v2.0 - Merge beta to main"

# 3. Taggear versión
git tag -a v2.0.0 -m "Version 2.0.0 - [descripción]"
git push origin main --tags

# 4. Actualizar dev desde main (opcional)
git checkout dev
git merge main --no-ff
```

---

## 🎓 Buenas Prácticas

### ✅ DO (Hacer):
- Crear ramas feature desde `beta`
- Hacer PRs hacia `beta`
- Revisar código antes de aprobar
- Testear localmente antes de PR
- Mantener commits descriptivos

### ❌ DON'T (No hacer):
- NO crear PRs hacia `dev` (solo hotfixes críticos)
- NO mergear sin review
- NO hacer push directo a `beta` o `dev`
- NO ignorar conflictos de merge
- NO subir archivos `.env` o credenciales

---

## 📞 Contacto

Si tienes dudas sobre esta estrategia, consulta con el equipo docente.

---

**Última actualización:** 15/01/2026  
**Versión del documento:** 1.0
