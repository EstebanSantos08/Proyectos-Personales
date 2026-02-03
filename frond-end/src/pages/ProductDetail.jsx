import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus, Check } from 'lucide-react';
import { productService } from '../services/services';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000';

const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const res = await productService.getById(id);
        setProducto(res.data);
        if (res.data.tallas?.length > 0) {
          setTallaSeleccionada(res.data.tallas[0]);
        }
        if (res.data.colores?.length > 0) {
          setColorSeleccionado(res.data.colores[0]);
        }
      } catch (error) {
        console.error('Error al cargar producto:', error);
        toast.error('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleAddToCart = async () => {
    if (producto.tallas?.length > 0 && !tallaSeleccionada) {
      toast.error('Selecciona una talla');
      return;
    }
    
    const success = await addToCart(producto.id, cantidad, tallaSeleccionada, colorSeleccionado);
    if (success) {
      setCantidad(1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 aspect-square rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
        <Link to="/productos" className="text-primary-600 hover:text-primary-700 font-semibold">
          Volver a productos
        </Link>
      </div>
    );
  }

  const precio = parseFloat(producto.precio);
  const precioOferta = producto.precioOferta ? parseFloat(producto.precioOferta) : null;
  const tieneOferta = precioOferta && precioOferta < precio;
  const precioFinal = tieneOferta ? precioOferta : precio;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        to="/productos"
        className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Volver a productos
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imagen */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {producto.imagen ? (
              <img
                src={`${API_URL}${producto.imagen}`}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-9xl">👕</span>
              </div>
            )}
          </div>
          
          {tieneOferta && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
              -{Math.round(((precio - precioOferta) / precio) * 100)}%
            </span>
          )}
        </div>

        {/* Detalles */}
        <div>
          <p className="text-sm text-primary-600 font-medium mb-2">
            {producto.categoria?.nombre}
          </p>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {producto.nombre}
          </h1>

          {/* Precio */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-800">
              ${precioFinal.toFixed(2)}
            </span>
            {tieneOferta && (
              <span className="text-xl text-gray-400 line-through">
                ${precio.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {producto.stock > 0 ? (
              <p className="text-green-600 flex items-center gap-2">
                <Check size={18} />
                En stock ({producto.stock} disponibles)
              </p>
            ) : (
              <p className="text-red-600">Agotado</p>
            )}
          </div>

          {/* Descripción */}
          <p className="text-gray-600 mb-6">
            {producto.descripcion}
          </p>

          {/* Tallas */}
          {producto.tallas?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Talla</h3>
              <div className="flex flex-wrap gap-2">
                {producto.tallas.map((talla) => (
                  <button
                    key={talla}
                    onClick={() => setTallaSeleccionada(talla)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      tallaSeleccionada === talla
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {talla}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colores */}
          {producto.colores?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Color: {colorSeleccionado}</h3>
              <div className="flex flex-wrap gap-2">
                {producto.colores.map((color) => (
                  <button
                    key={color}
                    onClick={() => setColorSeleccionado(color)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      colorSeleccionado === color
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad y agregar al carrito */}
          {producto.stock > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="px-6 font-semibold">{cantidad}</span>
                <button
                  onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-8 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                <ShoppingCart size={20} />
                Agregar al Carrito
              </button>
            </div>
          )}

          {/* Info adicional */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {producto.sku && (
                <div>
                  <span className="text-gray-500">SKU:</span>
                  <span className="ml-2 font-medium">{producto.sku}</span>
                </div>
              )}
              {producto.marca && (
                <div>
                  <span className="text-gray-500">Marca:</span>
                  <span className="ml-2 font-medium">{producto.marca}</span>
                </div>
              )}
              <div>
                <span className="text-gray-500">Género:</span>
                <span className="ml-2 font-medium capitalize">{producto.genero}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
