import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const precio = parseFloat(product.precio);
  const precioOferta = product.precioOferta ? parseFloat(product.precioOferta) : null;
  const tieneOferta = precioOferta && precioOferta < precio;
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const talla = product.tallas?.[0] || null;
    const color = product.colores?.[0] || null;
    
    await addToCart(product.id, 1, talla, color);
  };
  
  return (
    <Link 
      to={`/productos/${product.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.imagen ? (
          <img
            src={`${API_URL}${product.imagen}`}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-6xl">👕</span>
          </div>
        )}
        
        {tieneOferta && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            OFERTA
          </span>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold">
              Agotado
            </span>
          </div>
        )}
        
        {product.destacado && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
            ⭐ Destacado
          </span>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">
          {product.categoria?.nombre || 'Sin categoría'}
        </p>
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.nombre}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tieneOferta ? (
              <>
                <span className="text-lg font-bold text-primary-600">
                  ${precioOferta.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${precio.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                ${precio.toFixed(2)}
              </span>
            )}
          </div>
          
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              title="Agregar al carrito"
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
        
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-orange-600 mt-2">
            ¡Solo quedan {product.stock} unidades!
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
