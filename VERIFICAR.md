# ✅ Checklist de Verificación - Atmos

**Usa esta lista para comprobar que todo funciona correctamente**

---

## 📋 Antes de Empezar

Marca cada item cuando lo completes:

- [ ] He leído [docs/00_INDEX.md](./docs/00_INDEX.md)
- [ ] He leído [docs/INICIO_RAPIDO.md](./docs/INICIO_RAPIDO.md)
- [ ] Tengo Python 3.10+ instalado (`python --version`)
- [ ] Tengo Node.js 18+ instalado (`node --version`)
- [ ] Tengo pnpm instalado (`pnpm --version`)
- [ ] Tengo Git configurado (`git config user.name`)

---

## 🔧 Verificación del Setup

### 1. Backend

```powershell
# Opción fácil: usa el script
.\run.ps1 backend

# Opción manual:
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

✅ **Debe mostrar**:
```
Starting development server at http://127.0.0.1:8000/
```

✅ **Abre el navegador**: http://127.0.0.1:8000/admin/

**¿Funciona?**
- [ ] ✅ Sí, veo la página de Django
- [ ] ❌ No funciona → Lee [docs/FAQ.md](./docs/FAQ.md)

---

### 2. Frontend

**⚠️ Abre una NUEVA terminal** (deja el backend corriendo)

```powershell
# Opción fácil: usa el script
.\run.ps1 frontend

# Opción manual:
cd frontend
pnpm dev
```

✅ **Debe mostrar**:
```
VITE v7.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

✅ **Abre el navegador**: http://localhost:5173/

**¿Funciona?**
- [ ] ✅ Sí, veo la aplicación React
- [ ] ❌ No funciona → Lee [docs/FAQ.md](./docs/FAQ.md)

---

## 🧪 Verificación de Tests

### Tests Backend

```powershell
# Opción fácil
.\run.ps1 test-backend

# Opción manual
cd backend
.\venv\Scripts\Activate.ps1
pytest
```

✅ **Debe mostrar**: `7 passed`

**¿Pasan todos?**
- [ ] ✅ Sí, 7/7 tests pasan
- [ ] ❌ Alguno falla → Pregunta al equipo

---

### Build Frontend

```powershell
# Opción fácil
.\run.ps1 build

# Opción manual
cd frontend
pnpm build
```

✅ **Debe mostrar**: `✓ built in XXXms`

**¿Compila sin errores?**
- [ ] ✅ Sí, build exitoso
- [ ] ❌ Hay errores → Pregunta al equipo

---

## 🔀 Verificación de Git

```bash
# Ver en qué rama estás
git branch

# Ver estado de cambios
git status

# Traer últimos cambios de dev
git checkout dev
git pull origin dev
```

**¿Funciona?**
- [ ] ✅ Puedo cambiar de rama
- [ ] ✅ Puedo hacer pull
- [ ] ❌ Tengo problemas → Lee [docs/FAQ.md](./docs/FAQ.md) sección Git

---

## 🎯 Flujo Completo (Test Final)

**Haz esto para comprobar que todo está OK**:

1. **Crea una rama de prueba**:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b test/verificacion
   ```

2. **Arranca backend y frontend**:
   ```powershell
   # Terminal 1
   .\run.ps1 backend

   # Terminal 2
   .\run.ps1 frontend
   ```

3. **Verifica que todo funciona**:
   - [ ] Backend: http://127.0.0.1:8000/admin/
   - [ ] Frontend: http://localhost:5173/
   - [ ] Navegación funciona (cambia de página en el frontend)

4. **Vuelve a dev y borra la rama de prueba**:
   ```bash
   git checkout dev
   git branch -D test/verificacion
   ```

---

## ✅ Resultado Final

### Si TODO funciona:
- ✅ Backend arranca
- ✅ Frontend arranca
- ✅ Tests pasan
- ✅ Build compila
- ✅ Git funciona

**🎉 ¡Estás listo para programar!**

### Si algo NO funciona:

1. **Lee [docs/FAQ.md](./docs/FAQ.md)** → Soluciones a problemas comunes
2. **Pregunta al equipo** → En el chat o abre un issue en GitHub
3. **No te quedes atascado/a** → Es mejor preguntar pronto

---

## 📞 Ayuda

**¿Todo OK?** → Empieza leyendo [docs/GUIA_CONTRIBUCION.md](./docs/GUIA_CONTRIBUCION.md)

**¿Algo falla?** → [docs/FAQ.md](./docs/FAQ.md) tiene soluciones

**¿Sigues atascado/a?** → Pregunta al equipo, estamos para ayudar 😊

---

**Última actualización**: 2 de diciembre de 2025
