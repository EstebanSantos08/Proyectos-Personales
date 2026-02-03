# ============================================
# SCRIPT PARA CREAR BASE DE DATOS VENTAS
# ============================================

# Configuración
$PGPATH = "C:\Program Files\PostgreSQL\18\bin"
$env:PGPASSWORD = "123456"  # CAMBIAR CON TU CONTRASEÑA
$PGPORT = "5433"  # Puerto de PostgreSQL

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "CREANDO BASE DE DATOS VENTAS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Eliminar base de datos si existe
Write-Host "1. Eliminando base de datos si existe..." -ForegroundColor Yellow
& "$PGPATH\psql.exe" -U postgres -p $PGPORT -c "DROP DATABASE IF EXISTS ventas;"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: No se pudo conectar a PostgreSQL" -ForegroundColor Red
    Write-Host ""
    Write-Host "Soluciones:" -ForegroundColor Yellow
    Write-Host "- Verifica que PostgreSQL este corriendo"
    Write-Host "- Verifica tu contraseña de postgres"
    Write-Host "- Cambia la variable PGPASSWORD en este script (linea 7)"
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

# 2. Crear base de datos
Write-Host "2. Creando base de datos..." -ForegroundColor Yellow
& "$PGPATH\psql.exe" -U postgres -p $PGPORT -c "CREATE DATABASE ventas;"

# 3. Ejecutar script
Write-Host "3. Ejecutando script de tablas..." -ForegroundColor Yellow
& "$PGPATH\psql.exe" -U postgres -p $PGPORT -d ventas -f "back-end\database\crear_tablas.sql"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "BASE DE DATOS CREADA EXITOSAMENTE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Usuarios de prueba:" -ForegroundColor Cyan
Write-Host "- Admin: admin@ventas.com / admin123"
Write-Host "- Usuario: juan@ventas.com / usuario123"
Write-Host ""
Read-Host "Presiona Enter para continuar"
