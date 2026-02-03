import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  LogOut,
  Package,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { usuario, logout, isAuthenticated, isAdmin } = useAuth();
  const { cart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">👗</span>
              <span className="text-xl font-bold text-gray-800">Fashion Store</span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                Inicio
              </Link>
              <Link to="/productos" className="text-gray-600 hover:text-primary-600 transition-colors">
                Productos
              </Link>
            </nav>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated() ? (
                <>
                  {/* Cart */}
                  <Link 
                    to="/carrito" 
                    className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <ShoppingCart size={24} />
                    {cart.totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {cart.totalItems}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {usuario?.nombre?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:block text-gray-700">{usuario?.nombre}</span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                        {/* Indicador de Rol */}
                        <div className={`mx-2 mb-2 px-3 py-2 rounded-lg ${
                          isAdmin() 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
                            : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                        }`}>
                          <div className="text-xs font-semibold">
                            {isAdmin() ? '👑 ADMINISTRADOR' : '👤 USUARIO'}
                          </div>
                          <div className="text-xs mt-1 opacity-90">
                            {isAdmin() 
                              ? 'Acceso completo al sistema' 
                              : 'Acceso limitado - Solo compras'}
                          </div>
                        </div>

                        {isAdmin() && (
                          <>
                            <Link
                              to="/admin"
                              className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Settings size={18} className="mr-3 text-purple-600" />
                              <div>
                                <div className="font-medium">Panel Admin</div>
                                <div className="text-xs text-gray-500">CRUD, Reportes, Auditoría</div>
                              </div>
                            </Link>
                            <hr className="my-2" />
                          </>
                        )}
                        
                        <Link
                          to="/perfil"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={18} className="mr-3" />
                          Mi Perfil
                        </Link>
                        <Link
                          to="/mis-pedidos"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package size={18} className="mr-3" />
                          Mis Pedidos
                        </Link>
                        
                        {!isAdmin() && (
                          <div className="mx-2 mt-2 px-3 py-2 bg-blue-50 rounded text-xs text-blue-800">
                            ℹ️ Usuario normal: solo puede ver productos y realizar compras
                          </div>
                        )}
                        
                        <hr className="my-2" />
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          <LogOut size={18} className="mr-3" />
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Registrarse
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-600"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="px-4 py-4 space-y-3">
              <Link 
                to="/" 
                className="block text-gray-600 hover:text-primary-600"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/productos" 
                className="block text-gray-600 hover:text-primary-600"
                onClick={() => setMenuOpen(false)}
              >
                Productos
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">👗</span>
                <span className="text-xl font-bold">Fashion Store</span>
              </div>
              <p className="text-gray-400">
                Tu tienda de ropa favorita con las últimas tendencias en moda.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Inicio</Link></li>
                <li><Link to="/productos" className="hover:text-white">Productos</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Mi Cuenta</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/perfil" className="hover:text-white">Mi Perfil</Link></li>
                <li><Link to="/mis-pedidos" className="hover:text-white">Mis Pedidos</Link></li>
                <li><Link to="/carrito" className="hover:text-white">Carrito</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@fashionstore.com</li>
                <li>📞 +1 234 567 890</li>
                <li>📍 Calle Principal 123</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fashion Store. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Click outside to close menus */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
