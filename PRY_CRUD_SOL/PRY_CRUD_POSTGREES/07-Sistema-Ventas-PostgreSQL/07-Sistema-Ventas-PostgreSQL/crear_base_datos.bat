@echo off
echo ============================================
echo CREANDO BASE DE DATOS VENTAS
echo ============================================
echo.

REM Configurar la ruta de PostgreSQL
set PGPATH=C:\Program Files\PostgreSQL\18\bin
set PGPASSWORD=123456

echo 1. Eliminando base de datos si existe...
"%PGPATH%\psql.exe" -U postgres -c "DROP DATABASE IF EXISTS ventas;"
if %errorlevel% neq 0 (
    echo ERROR: No se pudo conectar a PostgreSQL
    echo.
    echo Soluciones:
    echo - Verifica que PostgreSQL este corriendo
    echo - Verifica tu contrasena de postgres
    echo - Cambia PGPASSWORD en este script
    pause
    exit /b 1
)

echo 2. Creando base de datos...
"%PGPATH%\psql.exe" -U postgres -c "CREATE DATABASE ventas;"

echo 3. Ejecutando script de tablas...
"%PGPATH%\psql.exe" -U postgres -d ventas -f back-end\database\crear_tablas.sql

echo.
echo ============================================
echo BASE DE DATOS CREADA EXITOSAMENTE!
echo ============================================
echo.
echo Usuarios de prueba:
echo - Admin: admin@ventas.com / admin123
echo - Usuario: juan@ventas.com / usuario123
echo.
pause
