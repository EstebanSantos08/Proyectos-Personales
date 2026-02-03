import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ventaService } from '../services/services';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000';

const Checkout = () => {
  const { cart } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    direccionEnvio: usuario?.direccion || '',
    telefonoContacto: usuario?.telefono || '',
    metodoPago: 'efectivo',
    notas: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.direccionEnvio) {
      toast.error('Ingresa una dirección de envío');
      return;
    }

    try {
      setLoading(true);
      // Crear venta usando stored procedure
      const ventaData = {
        productos: cart.items.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio
        }))
      };
      const response = await ventaService.create(ventaData);
      toast.success('¡Pedido realizado con éxito!');
      navigate('/mis-pedidos');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No hay productos en el carrito</h2>
        <Link to="/productos" className="text-primary-600 hover:text-primary-700 font-semibold">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const subtotal = parseFloat(cart.subtotal);
  const impuestos = subtotal * 0.12;
  const envio = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + impuestos + envio;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de envío */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="text-primary-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Información de Envío</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de Envío *
                  </label>
                  <textarea
                    name="direccionEnvio"
                    value={formData.direccionEnvio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ingresa tu dirección completa"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    name="telefonoContacto"
                    value={formData.telefonoContacto}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0999999999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas del pedido (opcional)
                  </label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Instrucciones especiales para la entrega..."
                  />
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-primary-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Método de Pago</h2>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'efectivo', label: 'Pago en Efectivo', desc: 'Paga al recibir tu pedido' },
                  { value: 'transferencia', label: 'Transferencia Bancaria', desc: 'Te enviaremos los datos de la cuenta' },
                  { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito', desc: 'Próximamente disponible' }
                ].map((metodo) => (
                  <label
                    key={metodo.value}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.metodoPago === metodo.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${metodo.value === 'tarjeta' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value={metodo.value}
                      checked={formData.metodoPago === metodo.value}
                      onChange={handleChange}
                      disabled={metodo.value === 'tarjeta'}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                      formData.metodoPago === metodo.value
                        ? 'border-primary-600'
                        : 'border-gray-300'
                    }`}>
                      {formData.metodoPago === metodo.value && (
                        <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{metodo.label}</p>
                      <p className="text-sm text-gray-500">{metodo.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del Pedido</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {item.producto?.imagen ? (
                        <img
                          src={`${API_URL}${item.producto.imagen}`}
                          alt={item.producto?.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">👕</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.producto?.nombre}
                      </p>
                      <p className="text-xs text-gray-500">Cant: {item.cantidad}</p>
                      <p className="text-sm font-semibold text-primary-600">
                        ${item.subtotal?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos (12%)</span>
                  <span className="font-semibold">${impuestos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold">
                    {envio === 0 ? <span className="text-green-600">Gratis</span> : `$${envio.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Check size={20} />
                    Confirmar Pedido
                  </>
                )}
              </button>

              <Link
                to="/carrito"
                className="block text-center mt-4 text-gray-600 hover:text-gray-800"
              >
                ← Volver al carrito
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
