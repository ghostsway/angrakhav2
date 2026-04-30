import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API } from '@/lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

function getGuestToken() {
  let token = localStorage.getItem('guest_token');
  if (!token) {
    token = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guest_token', token);
  }
  return token;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const headers = {};
      if (!user) headers['X-Guest-Token'] = getGuestToken();
      const res = await apiClient.get(`${API}/cart`, { withCredentials: true, headers });
      setCart(res.data);
    } catch {
      setCart({ items: [] });
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  useEffect(() => {
    if (user) {
      const gt = localStorage.getItem('guest_token');
      if (gt) {
        apiClient.post(`${API}/cart/merge`, { guest_token: gt }, { withCredentials: true })
          .then(() => { localStorage.removeItem('guest_token'); fetchCart(); })
          .catch(() => {});
      }
    }
  }, [user, fetchCart]);

  const addItem = async (item) => {
    setLoading(true);
    try {
      const headers = {};
      if (!user) headers['X-Guest-Token'] = getGuestToken();
      const res = await apiClient.post(`${API}/cart/items`, item, { withCredentials: true, headers });
      setCart(res.data);
    } finally { setLoading(false); }
  };

  const updateItem = async (itemId, quantity) => {
    const headers = {};
    if (!user) headers['X-Guest-Token'] = getGuestToken();
    const res = await apiClient.put(`${API}/cart/items/${itemId}`, { quantity }, { withCredentials: true, headers });
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    const headers = {};
    if (!user) headers['X-Guest-Token'] = getGuestToken();
    const res = await apiClient.delete(`${API}/cart/items/${itemId}`, { withCredentials: true, headers });
    setCart(res.data);
  };

  const itemCount = (cart.items || []).reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = (cart.items || []).reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, fetchCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
