import { useState, useEffect } from 'react';
import { Shield, Search, Calendar, User, Package, Filter } from 'lucide-react';
import { auditoriaService } from '../../services/services';
import toast from 'react-hot-toast';

const Auditoria = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroAccion, setFiltroAccion] = useState('todos');
  const [filtroTabla, setFiltroTabla] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarAuditorias();
  }, [filtroAccion, filtroTabla]);

  const cargarAuditorias = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtroAccion !== 'todos') params.accion = filtroAccion;
      if (filtroTabla !== 'todos') params.tabla = filtroTabla;
      
      const response = await auditoriaService.getAll(params);
      setAuditorias(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar auditorías:', error);
      toast.error('Error al cargar auditorías');
      setAuditorias([]);
    } finally {
      setLoading(false);
    }
  };

  const accionesFiltradas = auditorias.filter(a => {
    const matchBusqueda = busqueda === '' || 
      (a.descripcion && a.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (a.usuario_nombre && a.usuario_nombre.toLowerCase().includes(busqueda.toLowerCase()));
    
    return matchBusqueda;
  });

  const getAccionColor = (accion) => {
    switch (accion) {
      case 'INSERT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccionIcon = (accion) => {
    switch (accion) {
      case 'INSERT':
        return '✅';
      case 'UPDATE':
        return '✏️';
      case 'DELETE':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearDatos = (datos) => {
    if (!datos) return 'N/A';
    try {
      // Si ya es un objeto (JSONB de PostgreSQL), usarlo directamente
      const obj = typeof datos === 'string' ? JSON.parse(datos) : datos;
      return (
        <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
          {JSON.stringify(obj, null, 2)}
        </pre>
      );
    } catch {
      return <span className="text-gray-500">N/A</span>;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-96 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={32} />
          <h1 className="text-3xl font-bold">Auditoría de Sistema</h1>
        </div>
        <p className="text-purple-100">
          Registro completo de cambios en la base de datos mediante triggers
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="text-purple-100">Total de Registros</div>
            <div className="text-2xl font-bold">{auditorias.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="text-purple-100">Inserciones</div>
            <div className="text-2xl font-bold text-green-300">
              {auditorias.filter(a => a.operacion === 'INSERT').length}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="text-purple-100">Actualizaciones</div>
            <div className="text-2xl font-bold text-blue-300">
              {auditorias.filter(a => a.operacion === 'UPDATE').length}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="text-purple-100">Eliminaciones</div>
            <div className="text-2xl font-bold text-red-300">
              {auditorias.filter(a => a.operacion === 'DELETE').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Descripción, usuario..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Acción
            </label>
            <select
              value={filtroAccion}
              onChange={(e) => setFiltroAccion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="todos">Todas</option>
              <option value="INSERT">Inserción</option>
              <option value="UPDATE">Actualización</option>
              <option value="DELETE">Eliminación</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tabla
            </label>
            <select
              value={filtroTabla}
              onChange={(e) => setFiltroTabla(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="todos">Todas</option>
              <option value="productos">Productos</option>
              <option value="ventas">Ventas</option>
              <option value="usuarios">Usuarios</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              &nbsp;
            </label>
            <button
              onClick={() => {
                setFiltroAccion('todos');
                setFiltroTabla('todos');
                setBusqueda('');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Auditoría */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tabla
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No se encontraron registros de auditoría
                  </td>
                </tr>
              ) : (
                accionesFiltradas.map((auditoria) => (
                  <tr key={auditoria.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{auditoria.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {formatearFecha(auditoria.fecha_operacion)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getAccionColor(auditoria.operacion)}`}>
                        <span>{getAccionIcon(auditoria.operacion)}</span>
                        {auditoria.operacion}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{auditoria.tabla}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{auditoria.usuario_nombre || 'Sistema'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      {auditoria.tabla} - {auditoria.operacion} (ID: {auditoria.registro_id})
                    </td>
                    <td className="px-6 py-4">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium">
                          Ver cambios
                        </summary>
                        <div className="mt-2 space-y-2">
                          {auditoria.datos_anteriores && (
                            <div>
                              <div className="text-xs font-semibold text-gray-700 mb-1">Datos Anteriores:</div>
                              {formatearDatos(auditoria.datos_anteriores)}
                            </div>
                          )}
                          {auditoria.datos_nuevos && (
                            <div>
                              <div className="text-xs font-semibold text-gray-700 mb-1">Datos Nuevos:</div>
                              {formatearDatos(auditoria.datos_nuevos)}
                            </div>
                          )}
                        </div>
                      </details>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información sobre Triggers */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center gap-2">
          <Shield size={24} />
          Triggers Activos en la Base de Datos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-indigo-800 mb-2">Triggers de Validación:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>✓ <strong>validar_stock:</strong> Verifica stock antes de crear venta</li>
              <li>✓ <strong>calcular_subtotal:</strong> Calcula subtotal automáticamente</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-indigo-800 mb-2">Triggers de Actualización:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>✓ <strong>actualizar_stock:</strong> Reduce stock después de venta</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-indigo-800 mb-2">Triggers de Auditoría:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>✓ <strong>auditoria_productos:</strong> Registra cambios en productos</li>
              <li>✓ <strong>auditoria_ventas:</strong> Registra todas las ventas</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-indigo-800 mb-2">Ventajas:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>✓ Trazabilidad completa de cambios</li>
              <li>✓ Integridad de datos garantizada</li>
              <li>✓ Auditoría automática</li>
              <li>✓ Validaciones a nivel de base de datos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auditoria;
