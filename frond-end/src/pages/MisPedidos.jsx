import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, X } from 'lucide-react';
import { ventaService } from '../services/services';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000';

const estadoColors = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-blue-100 text-blue-800',
  enviado: 'bg-purple-100 text-purple-800',
  entregado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800'
};

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const res = await ventaService.getAll();
      setPedidos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error('Error al cargar los pedidos');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (pedidoId) => {
    toast.info('Función de cancelación no disponible');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No tienes pedidos aún</h2>
          <p className="text-gray-600 mb-8">¡Empieza a comprar y aquí verás tus pedidos!</p>
          <Link
            to="/productos"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-800">{pedido.numeroPedido}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColors[pedido.estado]}`}>
                      {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(pedido.createdAt)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {pedido.items?.length} {pedido.items?.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      ${parseFloat(pedido.total).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPedido(pedido)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>

              {/* Preview de items */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {pedido.items?.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                  >
                    {item.producto?.imagen ? (
                      <img
                        src={`${API_URL}${item.producto.imagen}`}
                        alt={item.producto?.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                    )}
                  </div>
                ))}
                {pedido.items?.length > 4 && (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm shrink-0">
                    +{pedido.items.length - 4}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {selectedPedido && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Detalle del Pedido</h2>
              <button
                onClick={() => setSelectedPedido(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-lg">{selectedPedido.numeroPedido}</p>
                  <p className="text-sm text-gray-500">{formatDate(selectedPedido.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${estadoColors[selectedPedido.estado]}`}>
                  {selectedPedido.estado.charAt(0).toUpperCase() + selectedPedido.estado.slice(1)}
                </span>
              </div>

              {/* Productos */}
              <div className="border rounded-lg divide-y mb-6">
                {selectedPedido.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {item.producto?.imagen ? (
                        <img
                          src={`${API_URL}${item.producto.imagen}`}
                          alt={item.producto?.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">👕</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.producto?.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {item.talla && `Talla: ${item.talla}`}
                        {item.talla && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="font-semibold">${parseFloat(item.subtotal).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${parseFloat(selectedPedido.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos</span>
                  <span>${parseFloat(selectedPedido.impuestos).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span>${parseFloat(selectedPedido.envio).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">${parseFloat(selectedPedido.total).toFixed(2)}</span>
                </div>
              </div>

              {/* Info adicional */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
                <p><strong>Dirección:</strong> {selectedPedido.direccionEnvio}</p>
                {selectedPedido.telefonoContacto && (
                  <p><strong>Teléfono:</strong> {selectedPedido.telefonoContacto}</p>
                )}
                <p><strong>Método de pago:</strong> {selectedPedido.metodoPago}</p>
              </div>

              {/* Botón cancelar */}
              {['pendiente', 'confirmado'].includes(selectedPedido.estado) && (
                <button
                  onClick={() => handleCancelar(selectedPedido.id)}
                  className="mt-6 w-full py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-semibold transition-colors"
                >
                  Cancelar Pedido
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
