# 🚀 Guía Completa - Aplicación OAuth con React

## ✅ Estado del Proyecto

### Backend
- ✅ Servidor corriendo en `http://localhost:3000`
- ✅ Endpoints configurados:
  - `POST /api/auth/login` - Login
  - `GET /api/users/profile` - Perfil (protegido)

### Frontend
- ✅ Aplicación React corriendo en `http://localhost:5173`
- ✅ Componentes creados:
  - Login con formulario y botones de prueba
  - Dashboard con perfil de usuario
  - Manejo de estados y errores

---

## 🎯 Cómo Usar la Aplicación

### 1. Acceder a la Aplicación

Abre tu navegador en: **http://localhost:5173**

### 2. Iniciar Sesión

Tienes dos opciones:

#### Opción A: Usar los botones de prueba rápida
- Haz clic en uno de los botones: **Admin**, **Doris** o **User 3**
- Las credenciales se autocompletarán
- Haz clic en "Iniciar Sesión"

#### Opción B: Ingresar manualmente
Usa cualquiera de estas credenciales:

| Usuario | Contraseña  |
|---------|-------------|
| admin   | password1   |
| doris   | password2   |
| user3   | password3   |

### 3. Explorar el Dashboard

Una vez autenticado, verás:

- **Avatar del usuario** con la inicial del nombre
- **Información del perfil**:
  - ID de usuario
  - Nombre completo
  - Correo electrónico
  - Estado de la sesión
- **Botones de acción**:
  - "Actualizar Perfil" - Recarga los datos del servidor
  - "Cerrar Sesión" - Cierra la sesión actual

### 4. Cerrar Sesión

Haz clic en el botón "Cerrar Sesión" en la esquina superior derecha.

---

## 🎨 Características del Frontend

### Diseño Moderno
- ✨ Tema oscuro con gradientes
- 🎭 Animaciones suaves
- 📱 Completamente responsive
- 🎨 Paleta de colores profesional

### Experiencia de Usuario
- ⚡ Carga rápida con Vite
- 🔄 Estados de carga visuales
- ❌ Manejo elegante de errores
- ✅ Feedback visual inmediato

### Seguridad
- 🔐 Token JWT en localStorage
- 🛡️ Rutas protegidas
- 🔒 Interceptores de Axios
- ⏱️ Expiración de sesión (1 hora)

---

## 📂 Estructura de Archivos Creados

```
8.OAUTH/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── config/
│   │   └── jwt.config.js
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   └── services/
│       ├── auth.service.js
│       └── user.service.js
│
└── frond-end/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── README.md
    ├── public/
    │   └── vite.svg
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── index.css
        ├── components/
        │   ├── Login.jsx
        │   ├── Login.css
        │   ├── Dashboard.jsx
        │   └── Dashboard.css
        └── services/
            └── api.js
```

---

## 🔧 Comandos Útiles

### Backend
```bash
# Iniciar el servidor
cd backend
node app.js

# Debería mostrar: "Servidor corriendo en http://localhost:3000"
```

### Frontend
```bash
# Instalar dependencias (solo la primera vez)
cd frond-end
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

---

## 🧪 Flujo de Autenticación

1. **Usuario ingresa credenciales** → Frontend
2. **POST /api/auth/login** → Backend valida
3. **Backend genera JWT** → Devuelve token + datos de usuario
4. **Frontend guarda token** → localStorage
5. **GET /api/users/profile** → Frontend envía token en header
6. **Backend valida token** → Devuelve perfil
7. **Frontend muestra Dashboard** → Usuario autenticado

---

## 🎨 Personalización

### Cambiar colores
Edita `frond-end/src/index.css`:

```css
:root {
  --primary: #6366f1;        /* Color principal */
  --primary-dark: #4f46e5;   /* Color principal oscuro */
  --primary-light: #818cf8;  /* Color principal claro */
  /* ... más colores */
}
```

### Cambiar URL del backend
Edita `frond-end/src/services/api.js`:

```javascript
const API_URL = 'http://localhost:3000/api';
```

### Cambiar puerto del frontend
Edita `frond-end/vite.config.js`:

```javascript
server: {
  port: 5173,  // Cambia este número
  open: true
}
```

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Cannot POST /api/auth/login"
**Solución**: Verifica que el backend esté corriendo en el puerto 3000

### ❌ Error de CORS
**Solución**: El backend ya tiene CORS configurado. Si persiste, reinicia el servidor backend.

### ❌ Error: "Token requerido"
**Solución**: Cierra sesión y vuelve a iniciar sesión para obtener un nuevo token.

### ❌ Error: "Token incorrecto"
**Solución**: El token expiró (1 hora). Cierra sesión e inicia sesión nuevamente.

### ❌ La página no carga
**Solución**: 
1. Verifica que ambos servidores estén corriendo
2. Backend: `http://localhost:3000`
3. Frontend: `http://localhost:5173`

---

## 📊 Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT)
- CORS

### Frontend
- React 18
- Vite
- Axios
- CSS3 (Variables CSS)
- Google Fonts (Inter)

---

## 🎓 Conceptos Aprendidos

1. **Autenticación JWT**: Tokens seguros para autenticación
2. **React Hooks**: useState, useEffect
3. **Axios Interceptors**: Agregar tokens automáticamente
4. **localStorage**: Persistencia de sesión
5. **CSS Variables**: Sistema de diseño escalable
6. **Componentes React**: Modularización y reutilización
7. **API REST**: Comunicación cliente-servidor
8. **Manejo de estados**: Loading, error, success

---

## 📝 Notas Importantes

- ⏱️ **Expiración del token**: 1 hora
- 🔒 **Seguridad**: No uses estas credenciales en producción
- 📱 **Responsive**: Funciona en móviles, tablets y desktop
- 🎨 **Personalizable**: Fácil de modificar colores y estilos

---

## 🚀 Próximos Pasos (Mejoras Opcionales)

1. Agregar registro de usuarios
2. Implementar "Recordar sesión"
3. Agregar recuperación de contraseña
4. Implementar refresh tokens
5. Agregar más información al perfil
6. Implementar edición de perfil
7. Agregar foto de perfil
8. Implementar roles y permisos

---

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía
2. Verifica que ambos servidores estén corriendo
3. Revisa la consola del navegador (F12)
4. Revisa la terminal del backend

---

**¡Disfruta tu aplicación OAuth! 🎉**
