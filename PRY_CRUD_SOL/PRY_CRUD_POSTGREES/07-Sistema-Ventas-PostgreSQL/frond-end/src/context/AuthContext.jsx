import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUsuario = localStorage.getItem('usuario');
      
      if (savedToken && savedUsuario) {
        try {
          setToken(savedToken);
          setUsuario(JSON.parse(savedUsuario));
          // Verificar que el token sigue siendo válido
          const response = await authService.getPerfil();
          if (response.data) {
            setUsuario(response.data);
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(user));
    setToken(token);
    setUsuario(user);
    
    return response;
  };

  const registrar = async (userData) => {
    const response = await authService.registrar(userData);
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(user));
    setToken(token);
    setUsuario(user);
    
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  const actualizarUsuario = (nuevoUsuario) => {
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
  };

  const isAdmin = () => usuario?.rol === 'admin';
  const isAuthenticated = () => !!token && !!usuario;

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      loading,
      login,
      registrar,
      logout,
      actualizarUsuario,
      isAdmin,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
