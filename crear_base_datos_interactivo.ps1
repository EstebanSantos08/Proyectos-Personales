# ============================================
# SCRIPT PARA CREAR BASE DE DATOS VENTAS
# ============================================

$PGPATH = "C:\Program Files\PostgreSQL\18\bin"
$PGPORT = "5433"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "CREANDO BASE DE DATOS VENTAS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar contraseña
$securePassword = Read-Host "Ingresa la contraseña de PostgreSQL (usuario postgres)" -AsSecureString
$env:PGPASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

Write-Host ""

# 1. Eliminar base de datos si existe
Write-Host "1. Eliminando base de datos si existe..." -ForegroundColor Yellow
& "$PGPATH\psql.exe" -U postgres -p $PGPORT -c "DROP DATABASE IF EXISTS ventas;"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: No se pudo conectar a PostgreSQL" -ForegroundColor Red
    Write-Host ""
    Write-Host "Posibles causas:" -ForegroundColor Yellow
    Write-Host "- Contraseña incorrecta"
    Write-Host "- PostgreSQL no está corriendo"
    Write-Host "- Puerto incorrecto (actualmente usando 5433)"
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

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "BASE DE DATOS CREADA EXITOSAMENTE!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usuarios de prueba:" -ForegroundColor Cyan
    Write-Host "- Admin: admin@ventas.com / admin123"
    Write-Host "- Usuario: juan@ventas.com / usuario123"
    Write-Host ""
    Write-Host "Siguiente paso:" -ForegroundColor Yellow
    Write-Host "cd back-end"
    Write-Host "copy .env.example .env"
    Write-Host "npm install"
    Write-Host "npm run dev"
} else {
    Write-Host ""
    Write-Host "ERROR: Hubo un problema al crear las tablas" -ForegroundColor Red
}

Write-Host ""
Read-Host "Presiona Enter para continuar"
