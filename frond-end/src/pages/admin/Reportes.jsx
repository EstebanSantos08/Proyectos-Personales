import { useState, useEffect } from 'react';
import { BarChart3, Calendar, Package, TrendingUp, Database, FileText } from 'lucide-react';
import { ventaService, productService } from '../../services/services';
import toast from 'react-hot-toast';

const Reportes = () => {
  const [reporteVentas, setReporteVentas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [auditoria, setAuditoria] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [ventasPorFecha, setVentasPorFecha] = useState([]);
  const [ventasTotales, setVentasTotales] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    cargarReportesIniciales();
  }, []);

  const cargarReportesIniciales = async () => {
    setLoading(true);
    try {
      await Promise.all([
        cargarReporteVentas(),
        cargarInventario(),
        cargarAuditoria(),
        cargarProductosMasVendidos(),
        cargarVentasTotales()
      ]);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      toast.error('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const cargarReporteVentas = async () => {
    try {
      const res = await ventaService.getReportes();
      setReporteVentas(res.data || []);
    } catch (error) {
      console.error('Error al cargar reporte de ventas:', error);
    }
  };

  const cargarInventario = async () => {
    try {
      const res = await productService.getAll();
      setInventario(res.data || []);
    } catch (error) {
      console.error('Error al cargar inventario:', error);
    }
  };

  const cargarAuditoria = async () => {
    try {
      // Llamar a la vista de auditoría reciente si existe en el backend
      const res = await ventaService.getReportes();
      setAuditoria(res.data?.slice(0, 10) || []);
    } catch (error) {
      console.error('Error al cargar auditoría:', error);
    }
  };

  const cargarProductosMasVendidos = async () => {
    try {
      const res = await ventaService.getProductosMasVendidos();
      setProductosMasVendidos(res.data || []);
    } catch (error) {
      console.error('Error al cargar productos más vendidos:', error);
    }
  };

  const cargarVentasTotales = async () => {
    try {
      const res = await ventaService.getReportes();
      if (res.data && res.data.length > 0) {
        const total = res.data.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
        setVentasTotales(total);
      }
    } catch (error) {
      console.error('Error al cargar ventas totales:', error);
    }
  };

  const buscarVentasPorFecha = async () => {
    if (!fechaInicio || !fechaFin) {
      toast.error('Selecciona ambas fechas');
      return;
    }
    
    setLoading(true);
    try {
      const res = await ventaService.getVentasPorFecha(fechaInicio, fechaFin);
      setVentasPorFecha(res.data || []);
      toast.success('Reporte generado');
    } catch (error) {
      console.error('Error al buscar ventas por fecha:', error);
      toast.error('Error al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-xl"></div>
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-primary-600" />
          Reportes y Consultas
        </h1>
        <p className="text-gray-600">Vista de stored procedures, triggers y vistas de la base de datos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Ventas Totales</p>
              <p className="text-3xl font-bold mt-2">${ventasTotales?.toFixed(2) || '0.00'}</p>
              <p className="text-blue-100 text-xs mt-1">Stored Procedure: sp_ventas_totales</p>
            </div>
            <TrendingUp size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Ventas</p>
              <p className="text-3xl font-bold mt-2">{reporteVentas.length}</p>
              <p className="text-green-100 text-xs mt-1">Vista: vista_reporte_ventas</p>
            </div>
            <FileText size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Productos en Stock</p>
              <p className="text-3xl font-bold mt-2">{inventario.length}</p>
              <p className="text-purple-100 text-xs mt-1">Vista: vista_inventario</p>
            </div>
            <Package size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Búsqueda por Fechas */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-primary-600" />
          Ventas por Rango de Fechas
          <span className="text-xs text-gray-500 ml-2">(Stored Procedure: sp_ventas_por_fecha)</span>
        </h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={buscarVentasPorFecha}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Buscar
          </button>
        </div>
        
        {ventasPorFecha.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ventasPorFecha.map((venta) => (
                  <tr key={venta.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{venta.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(venta.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      ${parseFloat(venta.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{venta.usuario_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Productos Más Vendidos */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary-600" />
          Productos Más Vendidos
          <span className="text-xs text-gray-500 ml-2">(Stored Procedure: sp_productos_mas_vendidos)</span>
        </h2>
        {productosMasVendidos.length > 0 ? (
          <div className="space-y-3">
            {productosMasVendidos.map((producto, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{producto.nombre}</p>
                    <p className="text-sm text-gray-500">ID: {producto.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">{producto.total_vendido || 0}</p>
                  <p className="text-xs text-gray-500">unidades vendidas</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
        )}
      </div>

      {/* Reporte de Ventas (Vista) */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Database className="text-primary-600" />
          Vista: Reporte de Ventas Completo
          <span className="text-xs text-gray-500 ml-2">(vista_reporte_ventas)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Venta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reporteVentas.slice(0, 10).map((venta) => (
                <tr key={venta.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{venta.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(venta.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${parseFloat(venta.total || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{venta.usuario_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventario (Vista) */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="text-primary-600" />
          Vista: Inventario de Productos
          <span className="text-xs text-gray-500 ml-2">(vista_inventario)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventario.slice(0, 10).map((producto) => (
                <tr key={producto.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{producto.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      producto.stock <= 5 ? 'bg-red-100 text-red-800' : 
                      producto.stock <= 10 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {producto.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    ${parseFloat(producto.precio || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {producto.stock > 0 ? (
                      <span className="text-green-600 font-semibold">Disponible</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Agotado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información sobre la Base de Datos */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-indigo-900 mb-3">📊 Funcionalidades de Base de Datos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-indigo-800 mb-2">Stored Procedures:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>✓ sp_crear_producto</li>
              <li>✓ sp_actualizar_producto</li>
              <li>✓ sp_eliminar_producto</li>
              <li>✓ sp_crear_venta</li>
              <li>✓ sp_ventas_totales</li>
              <li>✓ sp_ventas_por_fecha</li>
              <li>✓ sp_productos_mas_vendidos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-800 mb-2">Triggers Activos:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>✓ validar_stock (antes de insertar venta)</li>
              <li>✓ actualizar_stock (después de insertar venta)</li>
              <li>✓ calcular_subtotal (antes de insertar detalle)</li>
              <li>✓ auditoria_productos (después de actualizar)</li>
              <li>✓ auditoria_ventas (después de insertar)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-800 mb-2">Vistas:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>✓ vista_reporte_ventas</li>
              <li>✓ vista_inventario</li>
              <li>✓ vista_auditoria_reciente</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-800 mb-2">Auditoría:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>✓ Tabla de auditoría activa</li>
              <li>✓ Registro de cambios en productos</li>
              <li>✓ Registro de ventas realizadas</li>
              <li>✓ Historial completo de operaciones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
