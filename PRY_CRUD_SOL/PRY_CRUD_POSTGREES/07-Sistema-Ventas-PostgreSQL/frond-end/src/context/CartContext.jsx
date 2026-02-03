import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const addToCart = async (productId, cantidad = 1) => {
    try {
      setLoading(true);
      toast.success('Producto agregado al carrito');
      return true;
    } catch (error) {
      toast.error('Error al agregar producto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, cantidad) => {
    try {
      setLoading(true);
      toast.success('Cantidad actualizada');
    } catch (error) {
      toast.error('Error al actualizar cantidad');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      toast.error('Error al eliminar producto');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setCart({ items: [], subtotal: 0, totalItems: 0 });
      toast.success('Carrito vaciado');
    } catch (error) {
      toast.error('Error al vaciar carrito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
