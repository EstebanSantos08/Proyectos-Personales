import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, TrendingUp, Package, Shield, Database } from 'lucide-react';
import { productService } from '../services/services';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [productosFeatured, setProductosFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await productService.getAll({ limit: 4 });
      setProductosFeatured(res.data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Sistema de Ventas Completo
              </h1>
              <p className="text-xl text-purple-100">
                Base de datos PostgreSQL con Stored Procedures, Triggers, Vistas y Auditoría
              </p>
              
              {isAuthenticated() ? (
                <div className="flex gap-4">
                  <Link
                    to="/productos"
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                  >
                    Ver Productos
                    <ArrowRight size={20} />
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-2 bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-800 transition-all transform hover:scale-105 shadow-xl"
                    >
                      Panel Admin
                      <Shield size={20} />
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                  >
                    Iniciar Sesión
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/registro"
                    className="inline-flex items-center gap-2 bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-800 transition-all transform hover:scale-105 shadow-xl"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl transform hover:scale-105 transition-all">
                  <Database size={40} className="mb-3" />
                  <h3 className="font-bold text-lg">Stored Procedures</h3>
                  <p className="text-sm text-purple-100">CRUD optimizado</p>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl transform hover:scale-105 transition-all">
                  <Shield size={40} className="mb-3" />
                  <h3 className="font-bold text-lg">Triggers</h3>
                  <p className="text-sm text-purple-100">Validación automática</p>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl transform hover:scale-105 transition-all">
                  <TrendingUp size={40} className="mb-3" />
                  <h3 className="font-bold text-lg">Reportes</h3>
                  <p className="text-sm text-purple-100">Vistas SQL</p>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl transform hover:scale-105 transition-all">
                  <Package size={40} className="mb-3" />
                  <h3 className="font-bold text-lg">Auditoría</h3>
                  <p className="text-sm text-purple-100">Trazabilidad total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades del Sistema
            </h2>
            <p className="text-xl text-gray-600">
              Base de datos PostgreSQL con características avanzadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">CRUD Completo</h3>
              <p className="text-gray-600">
                Crear, leer, actualizar y eliminar usando stored procedures
              </p>
              <ul className="mt-4 space-y-1 text-sm text-gray-500">
                <li>✓ sp_crear_producto</li>
                <li>✓ sp_actualizar_producto</li>
                <li>✓ sp_eliminar_producto</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Reportes Avanzados</h3>
              <p className="text-gray-600">
                Consultas con stored procedures y vistas
              </p>
              <ul className="mt-4 space-y-1 text-sm text-gray-500">
                <li>✓ sp_ventas_totales</li>
                <li>✓ sp_ventas_por_fecha</li>
                <li>✓ vista_reporte_ventas</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Triggers Activos</h3>
              <p className="text-gray-600">
                Validaciones automáticas en la BD
              </p>
              <ul className="mt-4 space-y-1 text-sm text-gray-500">
                <li>✓ validar_stock</li>
                <li>✓ actualizar_stock</li>
                <li>✓ auditoria_productos</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Auditoría Total</h3>
              <p className="text-gray-600">
                Registro completo de cambios
              </p>
              <ul className="mt-4 space-y-1 text-sm text-gray-500">
                <li>✓ Tabla auditoria</li>
                <li>✓ vista_auditoria_reciente</li>
                <li>✓ Trazabilidad completa</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Admin */}
      {isAuthenticated() && isAdmin() && (
        <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Panel de Administración</h2>
            <p className="text-xl mb-8 text-purple-100">
              CRUD, Reportes con Stored Procedures, Auditoría con Triggers
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              <Shield size={24} />
              Ir al Panel Admin
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
