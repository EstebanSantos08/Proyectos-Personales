# 🛍️ TiendaRopa - Sistema de Gestión de Tienda de Ropa

Sistema web completo para la gestión de una tienda de ropa, desarrollado con **Node.js/Express** en el backend y **React** en el frontend.

## 📋 Características

### 🔐 Autenticación y Roles
- **Admin**: Acceso completo al panel de administración
- **Cliente**: Navegación en tienda, carrito y pedidos

### 🛒 Funcionalidades de Cliente
- Catálogo de productos con filtros (categoría, género, precio, talla)
- Vista detallada de productos
- Carrito de compras persistente
- Proceso de checkout
- Historial de pedidos
- Perfil de usuario

### 👨‍💼 Panel de Administración
- Dashboard con estadísticas
- CRUD completo de productos
- Gestión de categorías
- Gestión de pedidos (cambio de estados)
- Gestión de usuarios

### 🎨 Características Técnicas
- Imágenes de productos con upload
- Sistema de stock e inventario
- Ofertas y precios especiales
- Tallas y colores por producto
- Paginación y búsqueda
- Diseño responsive

---

## 🛠️ Tecnologías

### Backend
- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- JWT para autenticación
- Multer para upload de imágenes
- bcryptjs para encriptación

### Frontend
- React 18 + Vite
- React Router DOM
- TailwindCSS
- Axios
- Lucide React (iconos)
- React Hot Toast (notificaciones)

---

## 📁 Estructura del Proyecto

```
PRY_CRUD_POSTGREES/
├── back-end/
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Controladores MVC
│   │   ├── middlewares/    # Auth y Upload
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Rutas API
│   │   ├── seeders/        # Datos de prueba
│   │   └── server.js       # Punto de entrada
│   ├── uploads/            # Imágenes subidas
│   └── package.json
│
└── frond-end/
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── context/        # Context API (Auth, Cart)
    │   ├── layouts/        # Layouts (Main, Admin)
    │   ├── pages/          # Páginas
    │   │   ├── admin/      # Páginas de admin
    │   │   └── ...         # Páginas públicas
    │   └── services/       # Servicios API
    └── package.json
```

---

## 🚀 Instalación

### Requisitos Previos
- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

### 1. Configurar Base de Datos

```sql
-- En PostgreSQL, crear la base de datos:
CREATE DATABASE tienda_ropa;
```

### 2. Configurar Backend

```bash
# Navegar al directorio del backend
cd back-end

# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar el archivo .env con tus credenciales de PostgreSQL:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=tienda_ropa
# DB_USER=postgres
# DB_PASSWORD=tu_password
# JWT_SECRET=tu_secreto_jwt

# Ejecutar seeds (datos de prueba)
npm run seed

# Iniciar servidor en desarrollo
npm run dev
```

El servidor estará disponible en: `http://localhost:5000`

### 3. Configurar Frontend

```bash
# Navegar al directorio del frontend
cd frond-end

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 👥 Usuarios de Prueba

Después de ejecutar los seeds, tendrás estos usuarios:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@tiendaropa.com | admin123 |
| Cliente | cliente@test.com | cliente123 |

---

## 🔗 API Endpoints

### Autenticación
```
POST   /api/auth/login      # Iniciar sesión
POST   /api/auth/registro   # Registrar usuario
GET    /api/auth/perfil     # Obtener perfil
PUT    /api/auth/perfil     # Actualizar perfil
PUT    /api/auth/password   # Cambiar contraseña
```

### Productos
```
GET    /api/productos              # Listar productos
GET    /api/productos/:id          # Obtener producto
GET    /api/productos/destacados   # Productos destacados
POST   /api/productos              # Crear producto (admin)
PUT    /api/productos/:id          # Actualizar producto (admin)
DELETE /api/productos/:id          # Eliminar producto (admin)
```

### Categorías
```
GET    /api/categorias         # Listar categorías
POST   /api/categorias         # Crear categoría (admin)
PUT    /api/categorias/:id     # Actualizar categoría (admin)
DELETE /api/categorias/:id     # Eliminar categoría (admin)
```

### Carrito
```
GET    /api/carrito              # Ver carrito
POST   /api/carrito/agregar      # Agregar producto
PUT    /api/carrito/item/:id     # Actualizar cantidad
DELETE /api/carrito/item/:id     # Eliminar item
DELETE /api/carrito/vaciar       # Vaciar carrito
```

### Pedidos
```
GET    /api/pedidos                    # Listar pedidos (admin)
GET    /api/pedidos/mis-pedidos        # Mis pedidos (cliente)
GET    /api/pedidos/:id                # Ver pedido
POST   /api/pedidos                    # Crear pedido
PUT    /api/pedidos/:id/estado         # Cambiar estado (admin)
PUT    /api/pedidos/:id/cancelar       # Cancelar pedido
GET    /api/pedidos/estadisticas       # Estadísticas (admin)
```

### Usuarios
```
GET    /api/usuarios           # Listar usuarios (admin)
GET    /api/usuarios/:id       # Ver usuario (admin)
POST   /api/usuarios           # Crear usuario (admin)
PUT    /api/usuarios/:id       # Actualizar usuario (admin)
DELETE /api/usuarios/:id       # Eliminar usuario (admin)
```

---

## 📸 Capturas

### Tienda (Cliente)
- Página de inicio con productos destacados
- Catálogo con filtros avanzados
- Vista detallada de producto
- Carrito y checkout
- Historial de pedidos

### Panel Admin
- Dashboard con métricas
- Gestión de productos con imágenes
- Control de categorías
- Seguimiento de pedidos
- Administración de usuarios

---

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm run seed     # Ejecutar seeders
```

### Frontend
```bash
npm run dev      # Desarrollo
npm run build    # Build para producción
npm run preview  # Vista previa del build
```

---

## 📝 Licencia

Este proyecto es para fines educativos.

---

## 👨‍💻 Autor

Desarrollado como proyecto de Programación Web Avanzada.
