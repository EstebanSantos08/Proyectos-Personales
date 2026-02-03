# 🚀 GUÍA RÁPIDA - Instalación Base de Datos

## Opción 1: Paso a Paso (RECOMENDADO) ✅

### 1. Abrir PostgreSQL
```powershell
psql -U postgres
```

### 2. Crear la base de datos
```sql
CREATE DATABASE ventas;
\q
```

### 3. Ejecutar el script
```powershell
psql -U postgres -d ventas -f back-end/database/crear_tablas.sql
```

## Opción 2: Todo en un comando (Alternativa)

```powershell
# En PowerShell
cd "C:\Users\User\Desktop\Programacion Web Avanzada\PRY_CRUD_SOL\PRY_CRUD_POSTGREES"

# Crear base de datos y ejecutar script
psql -U postgres -c "DROP DATABASE IF EXISTS ventas;"
psql -U postgres -c "CREATE DATABASE ventas;"
psql -U postgres -d ventas -f back-end/database/crear_tablas.sql
```

## Opción 3: Desde pgAdmin (Interfaz Gráfica)

1. Abrir **pgAdmin**
2. Crear nueva base de datos llamada `ventas`
3. Click derecho en la base de datos → **Query Tool**
4. Abrir el archivo `crear_tablas.sql`
5. Ejecutar (F5)

## ✅ Verificar que funcionó

```powershell
psql -U postgres -d ventas

# Dentro de psql:
\dt
# Debe mostrar: usuarios, productos, ventas, detalle_ventas, auditoria

\df
# Debe mostrar los procedimientos almacenados

\dv
# Debe mostrar las vistas

SELECT * FROM usuarios;
# Debe mostrar 2 usuarios (admin y juan)

\q
```

## 📊 Usuarios Creados

| Email | Password | Rol |
|-------|----------|-----|
| admin@ventas.com | admin123 | admin |
| juan@ventas.com | usuario123 | usuario |

## ❌ Si hay errores

### Error: "database ventas already exists"
```powershell
psql -U postgres -c "DROP DATABASE ventas;"
psql -U postgres -c "CREATE DATABASE ventas;"
psql -U postgres -d ventas -f back-end/database/crear_tablas.sql
```

### Error: "psql: command not found"
Agregar PostgreSQL al PATH:
1. Buscar la carpeta de instalación de PostgreSQL (ej: `C:\Program Files\PostgreSQL\15\bin`)
2. Agregar al PATH del sistema

### Error: "password authentication failed"
- Verificar tu contraseña de PostgreSQL
- O cambiar el usuario: `psql -U tu_usuario -d ventas -f back-end/database/crear_tablas.sql`

## 🎯 Siguiente Paso

Una vez creada la base de datos, configurar el backend:

```powershell
cd back-end
copy .env.example .env
# Editar .env con tus credenciales
npm install
npm run dev
```

¡Listo! 🎉
