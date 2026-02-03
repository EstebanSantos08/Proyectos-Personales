# 🛒 Sistema de Ventas - PostgreSQL

Sistema de ventas simple con **procedimientos almacenados**, **triggers**, **vistas** y **auditoría** en PostgreSQL.

## 📋 Características

### Backend
- ✅ **Login y Registro** con JWT
- ✅ **Roles**: Admin y Usuario
- ✅ **CRUD de Productos** con procedimientos almacenados
- ✅ **Sistema de Ventas** con procedimientos almacenados
- ✅ **Triggers** para validación de stock y auditoría
- ✅ **Vistas** para reportes
- ✅ **Auditoría automática** de todas las operaciones

### Base de Datos
- 📊 **Procedimientos Almacenados**: CRUD, ventas, reportes
- 🔒 **Triggers**: Validación de stock, cálculo automático, auditoría
- 📈 **Vistas**: Reportes de ventas, inventario, auditoría
- 🔍 **Tabla de Auditoría**: Seguimiento de cambios (INSERT, UPDATE, DELETE)

## 🚀 Instalación

### 1. Prerrequisitos
- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)

### 2. Configurar la Base de Datos

```bash
# Acceder a PostgreSQL
psql -U postgres

# Ejecutar el script de creación
\i back-end/database/schema.sql

# O manualmente:
# psql -U postgres -f back-end/database/schema.sql
```

Esto creará:
- Base de datos `ventas`
- Tablas: usuarios, productos, ventas, detalle_ventas, auditoria
- Procedimientos almacenados
- Triggers
- Vistas
- Datos de ejemplo

### 3. Instalar Backend

```bash
cd back-end

# Copiar archivo de configuración
copy .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DB_NAME=ventas
# DB_USER=postgres
# DB_PASSWORD=tu_password

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

El servidor estará en: `http://localhost:5000`

### 4. Probar la API

```bash
# Health check
curl http://localhost:5000/api/health

# Login admin (password: admin123)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ventas.com","password":"admin123"}'
```

## 📡 Endpoints de la API

### 🔐 Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere token)

### 📦 Productos (CRUD con Procedimientos Almacenados)
- `GET /api/productos` - Listar productos
- `GET /api/productos/:id` - Ver producto
- `POST /api/productos` - Crear producto (Admin) ✨ **sp_crear_producto**
- `PUT /api/productos/:id` - Actualizar producto (Admin) ✨ **sp_actualizar_producto**
- `DELETE /api/productos/:id` - Eliminar producto (Admin) ✨ **sp_eliminar_producto**

### 💰 Ventas
- `POST /api/ventas` - Crear venta ✨ **sp_crear_venta**
- `GET /api/ventas` - Listar ventas (propias o todas si es admin)
- `GET /api/ventas/:id` - Ver detalle de venta

### 📊 Reportes (Solo Admin)

#### Con Procedimientos Almacenados:
- `GET /api/ventas/reportes/totales` - Ventas totales ✨ **sp_ventas_totales**
- `GET /api/ventas/reportes/por-fecha?fecha_inicio=2024-01-01&fecha_fin=2024-12-31` ✨ **sp_ventas_por_fecha**
- `GET /api/ventas/reportes/mas-vendidos?limite=10` ✨ **sp_productos_mas_vendidos**

#### Con Vistas:
- `GET /api/ventas/reportes/ventas` - Reporte de ventas 📋 **vista_reporte_ventas**
- `GET /api/ventas/reportes/inventario` - Inventario actual 📋 **vista_inventario**
- `GET /api/ventas/reportes/auditoria` - Auditoría reciente 📋 **vista_auditoria_reciente**

## 👥 Usuarios de Prueba

### Admin
- **Email**: `admin@ventas.com`
- **Password**: `admin123`
- **Permisos**: Todos

### Usuario Normal
- **Email**: `juan@ventas.com`
- **Password**: `usuario123`
- **Permisos**: Ver productos, crear ventas, ver sus propias ventas

## 🔥 Características Especiales

### Triggers Implementados

1. **Validación de Stock** (`trigger_validar_stock`)
   - Valida que haya stock suficiente antes de crear una venta
   - Se ejecuta BEFORE INSERT en detalle_ventas

2. **Actualización Automática de Stock** (`trigger_actualizar_stock`)
   - Descuenta automáticamente el stock después de una venta
   - Se ejecuta AFTER INSERT en detalle_ventas

3. **Cálculo Automático de Subtotal** (`trigger_calcular_subtotal`)
   - Calcula el subtotal (cantidad × precio) automáticamente
   - Se ejecuta BEFORE INSERT/UPDATE en detalle_ventas

4. **Auditoría Automática** (`trigger_auditoria_productos`, `trigger_auditoria_ventas`)
   - Registra todos los cambios (INSERT, UPDATE, DELETE)
   - Guarda estado anterior y nuevo en formato JSON
   - Se ejecuta AFTER INSERT/UPDATE/DELETE

### Procedimientos Almacenados

- **sp_crear_producto**: Crear producto con validaciones
- **sp_actualizar_producto**: Actualizar producto
- **sp_eliminar_producto**: Soft delete de producto
- **sp_crear_venta**: Crear venta completa con detalles
- **sp_ventas_totales**: Estadísticas generales de ventas
- **sp_ventas_por_fecha**: Ventas filtradas por rango de fechas
- **sp_productos_mas_vendidos**: Top N productos más vendidos

### Vistas

- **vista_reporte_ventas**: Reporte completo de ventas con información del usuario
- **vista_inventario**: Estado actual del inventario con alertas de stock bajo
- **vista_auditoria_reciente**: Últimos 100 registros de auditoría

## 📊 Diagrama de Base de Datos

```
usuarios (id, nombre, email, password, rol, activo)
    ↓
ventas (id, usuario_id, total, fecha_venta, estado)
    ↓
detalle_ventas (id, venta_id, producto_id, cantidad, precio_unitario, subtotal)
    ↓
productos (id, nombre, descripcion, precio, stock, activo)

auditoria (id, tabla, operacion, registro_id, datos_anteriores, datos_nuevos, usuario_id, fecha)
```

## 🧪 Ejemplo de Uso

### 1. Crear una venta

```javascript
POST /api/ventas
Authorization: Bearer <token>
Content-Type: application/json

{
  "productos": [
    {
      "producto_id": 1,
      "cantidad": 2,
      "precio_unitario": 599.99
    },
    {
      "producto_id": 2,
      "cantidad": 3,
      "precio_unitario": 15.99
    }
  ]
}
```

**Lo que sucede automáticamente:**
1. ✅ Trigger valida stock disponible
2. ✅ Procedimiento almacenado crea la venta
3. ✅ Trigger calcula subtotales
4. ✅ Trigger actualiza stock
5. ✅ Trigger registra en auditoría

### 2. Ver ventas por fecha

```
GET /api/ventas/reportes/por-fecha?fecha_inicio=2024-01-01&fecha_fin=2024-12-31
Authorization: Bearer <admin_token>
```

### 3. Ver auditoría

```
GET /api/ventas/reportes/auditoria
Authorization: Bearer <admin_token>
```

## 🛠 Tecnologías

- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL 12+
- **Autenticación**: JWT (jsonwebtoken)
- **Seguridad**: bcryptjs
- **Cliente BD**: node-postgres (pg)

## 📝 Notas Importantes

1. **Las contraseñas de ejemplo son débiles** - Cámbialas en producción
2. **El JWT_SECRET debe ser seguro** - Genera uno aleatorio para producción
3. **Los triggers y procedimientos ya están en schema.sql** - No es necesario crearlos manualmente
4. **La auditoría captura TODO automáticamente** - Revisa la tabla `auditoria`

## 🚦 Próximos Pasos

1. Ejecutar `back-end/database/schema.sql` en PostgreSQL
2. Configurar `.env` en back-end
3. Instalar dependencias con `npm install`
4. Iniciar servidor con `npm run dev`
5. Probar con usuario admin o crear tu propio usuario

¡Listo! 🎉
