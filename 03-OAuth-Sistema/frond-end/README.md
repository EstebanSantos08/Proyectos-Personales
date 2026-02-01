# Frontend OAuth - HTML, CSS y JavaScript Vanilla

Aplicación frontend moderna desarrollada con **HTML5, CSS3 y JavaScript puro** (sin frameworks) para autenticación OAuth con JWT.

## 🚀 Características

- ✅ **Sin dependencias**: HTML, CSS y JavaScript vanilla
- ✅ Autenticación con JWT
- ✅ Diseño moderno y responsive
- ✅ Tema oscuro con gradientes
- ✅ Animaciones CSS suaves
- ✅ Manejo de estados (loading, error, success)
- ✅ Persistencia de sesión con localStorage
- ✅ Botones de prueba rápida para credenciales
- ✅ Fetch API para llamadas HTTP

## 📋 Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Backend corriendo en `http://localhost:3000`
- Servidor web local (opcional pero recomendado)

## 🛠️ Instalación y Uso

### Opción 1: Abrir directamente (puede tener problemas de CORS)

Simplemente abre el archivo `index.html` en tu navegador.

### Opción 2: Usar un servidor web local (RECOMENDADO)

#### Con Python:
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

#### Con Node.js (http-server):
```bash
# Instalar http-server globalmente (solo una vez)
npm install -g http-server

# Ejecutar servidor
http-server -p 8080
```

#### Con PHP:
```bash
php -S localhost:8080
```

#### Con Live Server (VS Code):
1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

Luego abre tu navegador en: `http://localhost:8080`

## 📁 Estructura del Proyecto

```
frond-end/
├── index.html      # HTML principal con estructura de la app
├── styles.css      # Estilos CSS con sistema de diseño
├── app.js          # Lógica JavaScript de la aplicación
└── README.md       # Este archivo
```

## 🎨 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos con variables CSS, animaciones y grid/flexbox
- **JavaScript ES6+** - Lógica de la aplicación
- **Fetch API** - Peticiones HTTP
- **localStorage** - Persistencia de sesión
- **Google Fonts (Inter)** - Tipografía moderna

## 🔐 Credenciales de Prueba

La aplicación incluye botones de prueba rápida con estas credenciales:

| Usuario | Contraseña  | Nombre Completo |
|---------|-------------|-----------------|
| admin   | password1   | Admin           |
| doris   | password2   | Doris           |
| user3   | password3   | User 3          |

## 🎯 Funcionalidades

### Login
- Formulario de autenticación
- Validación de campos
- Mensajes de error descriptivos
- Botones de prueba rápida
- Animaciones de carga

### Dashboard
- Visualización del perfil de usuario
- Información detallada (ID, email, username)
- Estado de sesión activa
- Botón para actualizar perfil
- Botón para cerrar sesión
- Manejo de errores con opción de reintentar

## 🎨 Sistema de Diseño

La aplicación utiliza un sistema de diseño moderno con:

- **Colores**: Variables CSS para fácil personalización
- **Tipografía**: Inter (Google Fonts)
- **Animaciones**: Transiciones CSS suaves
- **Sombras**: Sistema de elevación
- **Bordes**: Bordes redondeados consistentes

### Variables CSS Principales

```css
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #818cf8;
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  /* ... más variables */
}
```

## 🔒 Seguridad

- Token JWT almacenado en localStorage
- Headers de autorización en peticiones protegidas
- Validación de sesión al cargar la aplicación
- Limpieza de datos al cerrar sesión
- Manejo de tokens expirados

## 📱 Responsive

La aplicación es completamente responsive y se adapta a:
- 📱 Móviles (< 480px)
- 📱 Tablets (< 768px)
- 💻 Desktop (> 768px)

## 🔧 Configuración

### Cambiar URL del Backend

Edita `app.js` línea 2:

```javascript
const API_URL = 'http://localhost:3000/api';
```

### Personalizar Colores

Edita `styles.css` en la sección `:root`:

```css
:root {
  --primary: #6366f1;  /* Tu color aquí */
  /* ... */
}
```

## 🐛 Solución de Problemas

### Error de CORS
Si recibes errores de CORS al abrir directamente el HTML:

**Solución**: Usa un servidor web local (ver sección de instalación)

### Error de conexión
Verifica que el backend esté corriendo en `http://localhost:3000`

### Token expirado
El token JWT expira después de 1 hora. Cierra sesión y vuelve a iniciar sesión.

### La aplicación no carga
1. Verifica que el backend esté corriendo
2. Abre la consola del navegador (F12) para ver errores
3. Usa un servidor web local en lugar de abrir el HTML directamente

## 📊 Flujo de la Aplicación

1. **Carga inicial**: Verifica si hay sesión guardada en localStorage
2. **Login**: Usuario ingresa credenciales → POST a `/api/auth/login`
3. **Guardar sesión**: Token y datos de usuario se guardan en localStorage
4. **Dashboard**: Muestra perfil del usuario
5. **Actualizar**: GET a `/api/users/profile` con token JWT
6. **Logout**: Limpia localStorage y vuelve al login

## 🎓 Conceptos Implementados

1. **Fetch API**: Peticiones HTTP asíncronas
2. **Async/Await**: Manejo de promesas
3. **localStorage**: Persistencia de datos
4. **DOM Manipulation**: Actualización dinámica de la UI
5. **Event Listeners**: Manejo de eventos del usuario
6. **CSS Variables**: Sistema de diseño escalable
7. **CSS Animations**: Animaciones y transiciones
8. **Responsive Design**: Media queries y flexbox/grid

## 📝 Código Destacado

### Autenticación con Fetch API

```javascript
async function login(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    return await response.json();
}
```

### Persistencia con localStorage

```javascript
function saveToLocalStorage(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}
```

## 🚀 Ventajas de esta Implementación

- ✅ **Sin build tools**: No necesita compilación
- ✅ **Sin dependencias**: No requiere npm install
- ✅ **Ligero**: Carga rápida
- ✅ **Fácil de entender**: Código JavaScript vanilla
- ✅ **Fácil de modificar**: Sin abstracciones complejas
- ✅ **Compatible**: Funciona en todos los navegadores modernos

## 📄 Licencia

ISC

---

Desarrollado con ❤️ usando HTML, CSS y JavaScript vanilla
