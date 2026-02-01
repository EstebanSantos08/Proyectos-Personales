# Guía de Pruebas en Postman - API OAuth

## 📋 Endpoints Disponibles

Tu API tiene 2 endpoints principales:

1. **POST** `/api/auth/login` - Login (público)
2. **GET** `/api/users/profile` - Obtener perfil (protegido con JWT)

---

## 🔐 Prueba 1: Login (Autenticación)

### Configuración en Postman:

1. **Método**: `POST`
2. **URL**: `http://localhost:3000/api/auth/login`
3. **Headers**:
   - `Content-Type`: `application/json`

4. **Body** (selecciona "raw" y "JSON"):
```json
{
  "username": "admin",
  "password": "password1"
}
```

### Usuarios disponibles para probar:

```json
// Usuario 1
{
  "username": "admin",
  "password": "password1"
}

// Usuario 2
{
  "username": "doris",
  "password": "password2"
}

// Usuario 3
{
  "username": "user3",
  "password": "password3"
}
```

### Respuesta esperada (200 OK):
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "nombreCompleto": "Admin",
    "email": "admin@web.com"
  }
}
```

### Respuesta de error (401 Unauthorized):
```json
{
  "message": "Usuario o contraseña incorrecta"
}
```

**⚠️ IMPORTANTE**: Copia el valor del `token` que recibes, lo necesitarás para la siguiente prueba.

---

## 👤 Prueba 2: Obtener Perfil (Ruta Protegida)

### Configuración en Postman:

1. **Método**: `GET`
2. **URL**: `http://localhost:3000/api/users/profile`
3. **Headers**:
   - `Authorization`: `Bearer TU_TOKEN_AQUI`
   
   ⚠️ **Importante**: Reemplaza `TU_TOKEN_AQUI` con el token que obtuviste en el login.
   
   Ejemplo completo:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MzIyMDg0NzEsImV4cCI6MTczMjIxMjA3MX0.xyz123...
   ```

4. **Body**: No necesitas enviar body en esta petición

### Respuesta esperada (200 OK):
```json
{
  "ok": true,
  "Data": {
    "id": 1,
    "username": "admin",
    "nombreCompleto": "Admin",
    "email": "admin@web.com"
  }
}
```

### Posibles errores:

**Sin token (401 Unauthorized):**
```json
{
  "msg": "Token requerido"
}
```

**Token inválido (401 Unauthorized):**
```json
{
  "msg": "Token incorrecto"
}
```

**Formato incorrecto (401 Unauthorized):**
```json
{
  "msg": "Formato inválido"
}
```

---

## 📝 Paso a Paso Completo

### 1️⃣ Hacer Login

1. Abre Postman
2. Crea una nueva petición
3. Selecciona método `POST`
4. Ingresa URL: `http://localhost:3000/api/auth/login`
5. Ve a la pestaña "Headers" y agrega:
   - Key: `Content-Type`
   - Value: `application/json`
6. Ve a la pestaña "Body"
7. Selecciona "raw" y "JSON"
8. Pega este JSON:
   ```json
   {
     "username": "admin",
     "password": "password1"
   }
   ```
9. Haz clic en "Send"
10. **COPIA EL TOKEN** de la respuesta

### 2️⃣ Obtener Perfil

1. Crea una nueva petición en Postman
2. Selecciona método `GET`
3. Ingresa URL: `http://localhost:3000/api/users/profile`
4. Ve a la pestaña "Headers" y agrega:
   - Key: `Authorization`
   - Value: `Bearer [PEGA_AQUI_TU_TOKEN]`
5. Haz clic en "Send"
6. Deberías ver tu perfil de usuario

---

## 🎯 Tips para Postman

### Usar Variables de Entorno

Para no estar copiando y pegando el token manualmente:

1. **Crear una variable de entorno**:
   - Clic en el ícono de ojo (👁️) en la esquina superior derecha
   - Clic en "Add" para crear un nuevo entorno
   - Nombre: `OAuth API`
   - Agrega estas variables:
     - `base_url`: `http://localhost:3000`
     - `token`: (déjalo vacío por ahora)

2. **Guardar el token automáticamente después del login**:
   - En la petición de login, ve a la pestaña "Tests"
   - Agrega este script:
   ```javascript
   if (pm.response.code === 200) {
       const response = pm.response.json();
       pm.environment.set("token", response.token);
   }
   ```

3. **Usar las variables**:
   - En la URL usa: `{{base_url}}/api/auth/login`
   - En el header Authorization usa: `Bearer {{token}}`

---

## ✅ Checklist de Pruebas

- [ ] Login exitoso con credenciales correctas
- [ ] Login fallido con credenciales incorrectas
- [ ] Obtener perfil con token válido
- [ ] Obtener perfil sin token (debe fallar)
- [ ] Obtener perfil con token inválido (debe fallar)
- [ ] Obtener perfil con formato incorrecto (sin "Bearer")

---

## 🔍 Verificar que el servidor esté corriendo

Antes de hacer las pruebas, asegúrate de que el servidor esté corriendo:

```bash
# Deberías ver este mensaje en la terminal:
Servidor corriendo en http://localhost:3000
```

Si no está corriendo, ejecuta:
```bash
cd backend
node app.js
```

---

## 🐛 Solución de Problemas

### Error: "Cannot POST /api/auth/login"
- Verifica que el servidor esté corriendo
- Verifica que la URL sea correcta: `http://localhost:3000/api/auth/login`

### Error: "Token requerido"
- Asegúrate de incluir el header `Authorization`
- Verifica que el formato sea: `Bearer [token]` (con espacio después de Bearer)

### Error: "Token incorrecto"
- El token puede haber expirado (dura 1 hora)
- Haz login nuevamente para obtener un token nuevo

### Error: "Usuario o contraseña incorrecta"
- Verifica que estés usando uno de los usuarios disponibles
- Revisa que no haya espacios extra en el JSON
