import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Database, BarChart3, Shield, FileText, Zap } from 'lucide-react';
import { productService, ventaService } from '../../services/services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    ventasTotales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Obtener productos
      const productosRes = await productService.getAll();
      const productos = productosRes.data;
      const totalProductos = Array.isArray(productos) ? productos.length : 0;
      
      // Obtener ventas totales (desde stored procedure)
      try {
        const ventasRes = await ventaService.getReportes();
        const ventasData = ventasRes.data;
        setStats({
          totalProductos,
          ventasTotales: ventasData?.total || 0
        });
      } catch (error) {
        // Si falla, solo mostramos productos
        setStats({
          totalProductos,
          ventasTotales: 0
        });
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      setStats({ totalProductos: 0, ventasTotales: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Database,
      title: 'Stored Procedures',
      count: 7,
      description: 'Procedimientos almacenados para CRUD y reportes',
      items: [
        'sp_crear_producto',
        'sp_actualizar_producto', 
        'sp_eliminar_producto',
        'sp_crear_venta',
        'sp_ventas_totales',
        'sp_ventas_por_fecha',
        'sp_productos_mas_vendidos'
      ],
      color: 'blue',
      link: '/admin/productos'
    },
    {
      icon: Zap,
      title: 'Triggers',
      count: 5,
      description: 'Validaciones automáticas y auditoría',
      items: [
        'validar_stock - Verifica disponibilidad',
        'actualizar_stock - Actualiza inventario',
        'calcular_subtotal - Calcula totales',
        'auditoria_productos - Registra cambios',
        'auditoria_ventas - Registra ventas'
      ],
      color: 'purple',
      link: '/admin/auditoria'
    },
    {
      icon: BarChart3,
      title: 'Views',
      count: 3,
      description: 'Vistas para reportes y consultas',
      items: [
        'vista_reporte_ventas',
        'vista_inventario',
        'vista_auditoria_reciente'
      ],
      color: 'green',
      link: '/admin/reportes'
    },
    {
      icon: Shield,
      title: 'Tabla de Auditoría',
      count: 1,
      description: 'Registro completo de cambios',
      items: [
        'auditoria - Tracking de todas las operaciones'
      ],
      color: 'orange',
      link: '/admin/auditoria'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Dashboard - Sistema de Ventas</h1>
        <p className="text-primary-100">PostgreSQL con Stored Procedures, Triggers, Views y Auditoría</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Productos</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalProductos}</p>
              <p className="text-xs text-gray-500 mt-2">Gestionados con Stored Procedures</p>
            </div>
            <div className="p-4 bg-primary-100 rounded-lg">
              <Package className="text-primary-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Ventas Totales</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">${stats.ventasTotales.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">Calculado con sp_ventas_totales</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg">
              <BarChart3 className="text-green-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Features de Base de Datos */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Características de PostgreSQL</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.link}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[feature.color]}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-300">{feature.count}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                
                <div className="space-y-1">
                  {feature.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="text-primary-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-primary-600 font-medium">
                    Ver detalles →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/productos"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Package className="text-primary-600" size={20} />
            <div>
              <p className="font-medium text-gray-800">Gestión de Productos</p>
              <p className="text-xs text-gray-500">CRUD con SP</p>
            </div>
          </Link>
          
          <Link
            to="/admin/reportes"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <BarChart3 className="text-green-600" size={20} />
            <div>
              <p className="font-medium text-gray-800">Reportes</p>
              <p className="text-xs text-gray-500">SP y Views</p>
            </div>
          </Link>
          
          <Link
            to="/admin/auditoria"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <Shield className="text-orange-600" size={20} />
            <div>
              <p className="font-medium text-gray-800">Auditoría</p>
              <p className="text-xs text-gray-500">Triggers activos</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Info sobre la base de datos */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <FileText className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Base de Datos: ventas</h3>
            <p className="text-sm text-blue-800 mb-3">
              Sistema completo con PostgreSQL 18 que demuestra el uso de características avanzadas:
            </p>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>✓ <strong>Stored Procedures</strong> para encapsular lógica de negocio</li>
              <li>✓ <strong>Triggers</strong> para validaciones automáticas y auditoría</li>
              <li>✓ <strong>Views</strong> para consultas optimizadas y reportes</li>
              <li>✓ <strong>Tabla de Auditoría</strong> para trazabilidad completa</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
