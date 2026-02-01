// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Estado de la aplicación
let currentUser = null;
let authToken = null;

// Elementos del DOM
const loadingScreen = document.getElementById('loading-screen');
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const refreshBtn = document.getElementById('refresh-btn');
const testButtons = document.querySelectorAll('.btn-test');

// Elementos del perfil
const profileAvatar = document.getElementById('profile-avatar');
const avatarInitial = document.getElementById('avatar-initial');
const profileName = document.getElementById('profile-name');
const profileUsername = document.getElementById('profile-username');
const profileId = document.getElementById('profile-id');
const profileEmail = document.getElementById('profile-email');

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

function showScreen(screen) {
    loadingScreen.style.display = 'none';
    loginScreen.style.display = 'none';
    dashboardScreen.style.display = 'none';

    if (screen === 'loading') {
        loadingScreen.style.display = 'flex';
    } else if (screen === 'login') {
        loginScreen.style.display = 'flex';
    } else if (screen === 'dashboard') {
        dashboardScreen.style.display = 'flex';
    }
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    errorMessage.classList.add('slide-in');
}

function hideError() {
    errorMessage.style.display = 'none';
    errorMessage.classList.remove('slide-in');
}

function setLoading(isLoading) {
    if (isLoading) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="spinner"></span> Iniciando sesión...';
    } else {
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Iniciar Sesión';
    }
}

// ============================================
// FUNCIONES DE ALMACENAMIENTO LOCAL
// ============================================

function saveToLocalStorage(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function getFromLocalStorage() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
}

function clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// ============================================
// FUNCIONES DE API
// ============================================

async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al iniciar sesión');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

async function getProfile() {
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener el perfil');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

async function handleLogin(e) {
    e.preventDefault();
    hideError();
    setLoading(true);

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        const response = await login(username, password);

        if (response.ok && response.token && response.user) {
            authToken = response.token;
            currentUser = response.user;

            // Guardar en localStorage
            saveToLocalStorage(authToken, currentUser);

            // Mostrar dashboard
            updateProfileUI(currentUser);
            showScreen('dashboard');

            // Limpiar formulario
            loginForm.reset();
        } else {
            showError('Respuesta inválida del servidor');
        }
    } catch (error) {
        showError(error.message || 'Error al iniciar sesión');
    } finally {
        setLoading(false);
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    clearLocalStorage();
    showScreen('login');
}

async function handleRefresh() {
    try {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span class="spinner"></span> Actualizando...';

        const response = await getProfile();

        if (response.ok && response.Data) {
            updateProfileUI(response.Data);
        }
    } catch (error) {
        showError(error.message || 'Error al actualizar el perfil');

        // Si el token expiró, cerrar sesión
        if (error.message.includes('Token') || error.message.includes('401')) {
            setTimeout(() => {
                handleLogout();
            }, 2000);
        }
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Actualizar Perfil
        `;
    }
}

// ============================================
// FUNCIONES DE UI
// ============================================

function updateProfileUI(user) {
    const initial = user.nombreCompleto ? user.nombreCompleto.charAt(0).toUpperCase() : 'U';

    avatarInitial.textContent = initial;
    profileName.textContent = user.nombreCompleto || 'Usuario';
    profileUsername.textContent = `@${user.username || 'usuario'}`;
    profileId.textContent = user.id || '-';
    profileEmail.textContent = user.email || '-';
}

function fillTestCredentials(username, password) {
    usernameInput.value = username;
    passwordInput.value = password;
    hideError();
}

// ============================================
// INICIALIZACIÓN
// ============================================

async function init() {
    // Verificar si hay sesión guardada
    const { token, user } = getFromLocalStorage();

    if (token && user) {
        authToken = token;
        currentUser = user;

        // Intentar obtener el perfil actualizado
        try {
            const response = await getProfile();
            if (response.ok && response.Data) {
                updateProfileUI(response.Data);
                showScreen('dashboard');
            } else {
                // Token inválido, mostrar login
                clearLocalStorage();
                showScreen('login');
            }
        } catch (error) {
            // Error al obtener perfil, mostrar login
            clearLocalStorage();
            showScreen('login');
        }
    } else {
        // No hay sesión, mostrar login
        showScreen('login');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Login form
loginForm.addEventListener('submit', handleLogin);

// Logout button
logoutBtn.addEventListener('click', handleLogout);

// Refresh button
refreshBtn.addEventListener('click', handleRefresh);

// Test credentials buttons
testButtons.forEach(button => {
    button.addEventListener('click', () => {
        const username = button.getAttribute('data-username');
        const password = button.getAttribute('data-password');
        fillTestCredentials(username, password);
    });
});

// Limpiar error al escribir
usernameInput.addEventListener('input', hideError);
passwordInput.addEventListener('input', hideError);

// ============================================
// INICIAR APLICACIÓN
// ============================================

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
