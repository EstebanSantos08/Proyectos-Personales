import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_URL = 'http://localhost:5000';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-gray-100 rounded-lg">
              <div className="w-24 h-24 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-8">¡Agrega algunos productos para empezar!</p>
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Ver Productos
          <ArrowRight size={20} />
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border-b border-gray-100 last:border-0">
                {/* Imagen */}
                <Link to={`/productos/${item.productId}`} className="shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
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
                </Link>

                {/* Detalles */}
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/productos/${item.productId}`}
                    className="font-semibold text-gray-800 hover:text-primary-600 line-clamp-1"
                  >
                    {item.producto?.nombre}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.talla && <span>Talla: {item.talla}</span>}
                    {item.talla && item.color && <span className="mx-2">•</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <p className="text-primary-600 font-semibold mt-2">
                    ${(item.producto?.precioOferta || item.producto?.precio || 0).toFixed(2)}
                  </p>
                </div>

                {/* Cantidad */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-semibold">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      disabled={item.cantidad >= (item.producto?.stock || 0)}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Link
              to="/productos"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              ← Continuar comprando
            </Link>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos (12%)</span>
                <span className="font-semibold">${impuestos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-semibold">
                  {envio === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    `$${envio.toFixed(2)}`
                  )}
                </span>
              </div>
              {envio > 0 && (
                <p className="text-xs text-gray-500">
                  Envío gratis en compras mayores a $50
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Proceder al Pago
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
