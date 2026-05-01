#  Crumbskate

E-commerce de ropa y accesorios skater orientado a jóvenes argentinos.
Los pagos se procesan a través de Mercado Libre.

---

##  Equipo

| Integrante | Rol |
|---|---|
| Fernando Flor | Líder + Backend + Frontend|
| Santiago Medina | Base de datos + Backend |
| Liz Benitez | Diseño + Documentación |

---

##  Estructura del repositorio

```
crumbskate/
├── backend/          → API Node.js + Express (Fernando Flor y Santiago Medina)
├── frontend/         → React + Vite (Fernando Flor
├── database/         → Scripts SQL (Santiago Medina)
└── docs/             → Documentación (Liz Benitez) 
```

---

##  Cómo levantar el proyecto localmente

### 1. Backend

```bash
cd backend
cp .env.example .env      # Completar con tus datos
npm install
npm run dev               # Corre en http://localhost:3000
```

### 2. Frontend

```bash
cd backend
npm install
npm run dev               # Corre en http://localhost:5173/
```

### 3. Base de datos

En MySQL Workbench o terminal:
```sql
source database/01_crear_tablas.sql
source database/02_datos_prueba.sql
```

---

##  Endpoints de la API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | /api/auth/registro | ❌ | Registrar usuario |
| POST | /api/auth/login | ❌ | Iniciar sesión |
| GET | /api/auth/perfil | ✅ | Ver perfil |
| GET | /api/productos | ❌ | Listar productos |
| GET | /api/productos/:id | ❌ | Detalle de producto |
| POST | /api/productos | ✅ Admin | Crear producto |
| PUT | /api/productos/:id | ✅ Admin | Editar producto |
| DELETE | /api/productos/:id | ✅ Admin | Desactivar producto |
| GET | /api/categorias | ❌ | Listar categorías |
| GET | /api/carrito | ✅ | Ver carrito |
| POST | /api/carrito/agregar | ✅ | Agregar item |
| DELETE | /api/carrito/item/:id | ✅ | Eliminar item |
| DELETE | /api/carrito/vaciar | ✅ | Vaciar carrito |
| POST | /api/pedidos | ✅ | Crear pedido |
| GET | /api/pedidos | ✅ | Historial |
| GET | /api/pedidos/:id | ✅ | Detalle pedido |

---

##  Seguridad implementada

- Contraseñas hasheadas con **bcryptjs**
- Autenticación con **JWT** (expira en 7 días)
- Headers HTTP protegidos con **Helmet**
- CORS restringido al origen del frontend
- Rate limiting: 100 req/15min (10 para login)
- Validación de inputs con **express-validator**
- Variables sensibles en **.env** (nunca en el repo)
- Baja lógica en productos (no se borran físicamente)
- Transacciones SQL en pedidos (todo o nada)

---

## ☁️ Deploy

| Servicio | Plataforma | Costo |
|---|---|---|
| Backend + DB | Railway | $5/mes |
| Frontend | Vercel | Gratis |

Cuando estén listos para deploy, cambiar `API_URL` en `frontend/js/api.js`.
