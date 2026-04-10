import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState(null);


  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + parseInt(quantity) } : item
        );
      }
      return [...prev, { ...product, quantity: parseInt(quantity) }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/coupons/validate', { code });
      setCoupon(res.data);
      return { success: true, discount: res.data.discount };
    } catch (err) {
      setCoupon(null);
      return { success: false, message: err.response?.data?.message || 'Cupom inválido' };
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.finalPrice * item.quantity), 0);
  const discountAmount = coupon ? (subtotal * (coupon.discount / 100)) : 0;
  const total = subtotal - discountAmount;
  const totalWeight = cart.reduce((acc, item) => acc + (item.weight * item.quantity), 0);


  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, 
      subtotal, totalWeight, total, coupon, applyCoupon, 
      discountAmount 
    }}>
      {children}
    </CartContext.Provider>

  );
};

export const useCart = () => useContext(CartContext);
