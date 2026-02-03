# Script para configurar el archivo .env con la contraseña correcta
Write-Host "================================" -ForegroundColor Cyan
Write-Host "CONFIGURAR BACKEND" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Leer contraseña de PostgreSQL
$securePassword = Read-Host "Ingresa tu contraseña de PostgreSQL (usuario postgres)" -AsSecureString
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

# Actualizar archivo .env
$envContent = @"
# Configuración del servidor
PORT=5000
NODE_ENV=development

# Configuración de la base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5433
DB_NAME=ventas
DB_USER=postgres
DB_PASSWORD=$password

# JWT Secret
JWT_SECRET=secreto_jwt
JWT_EXPIRES_IN=24h

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173
"@

$envPath = "back-end\.env"
$envContent | Out-File -FilePath $envPath -Encoding UTF8

Write-Host ""
Write-Host "✅ Archivo .env configurado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Iniciando servidor..." -ForegroundColor Yellow
Write-Host ""

# Ir al directorio back-end e iniciar servidor
cd back-end
npm run dev
