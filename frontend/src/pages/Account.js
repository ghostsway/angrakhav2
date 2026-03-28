import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Account() {
  const { user, login, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!user && !authLoading) return;
    if (user) {
      setLoadingOrders(true);
      axios.get(`${API}/orders`, { withCredentials: true })
        .then(r => setOrders(r.data.orders || []))
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center" data-testid="account-login-prompt">
        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
        <h1 className="font-serif text-3xl font-light text-foreground mb-3">Welcome</h1>
        <p className="text-sm font-sans text-muted-foreground mb-8">Sign in to view your orders, saved addresses and account details.</p>
        <button onClick={login}
          className="bg-primary text-primary-foreground px-8 py-3 text-xs font-sans uppercase tracking-[0.2em] hover:bg-primary/90 transition-all"
          data-testid="account-login-btn">
          Sign in with Google
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="py-12 lg:py-20" data-testid="account-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-serif text-xl">
                {user.name?.[0] || 'U'}
              </div>
            )}
            <div>
              <h1 className="font-serif text-2xl font-light text-foreground">{user.name}</h1>
              <p className="text-sm font-sans text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            data-testid="logout-btn">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-brand-border mb-8">
          <button onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-sans uppercase tracking-[0.2em] transition-colors ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            data-testid="tab-orders">
            Orders
          </button>
          <button onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-sans uppercase tracking-[0.2em] transition-colors ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            data-testid="tab-profile">
            Profile
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div data-testid="orders-list">
            {loadingOrders ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-brand-surface animate-pulse" />)}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.order_id} className="border border-brand-border p-5 bg-brand-surface" data-testid={`order-${order.order_id}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <p className="text-sm font-sans font-medium text-foreground">{order.order_number}</p>
                        <p className="text-xs font-sans text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-sans uppercase tracking-widest px-2 py-1 ${order.status === 'confirmed' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                          {order.status}
                        </span>
                        <span className="font-serif text-lg text-primary">Rs {order.total?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 overflow-x-auto">
                      {order.items?.map((item, i) => (
                        <div key={i} className="w-14 aspect-[3/4] bg-brand-bg shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-10 h-10 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                <p className="font-serif text-xl text-foreground mb-2">No orders yet</p>
                <p className="text-sm font-sans text-muted-foreground">Your order history will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-lg space-y-6" data-testid="profile-section">
            <div className="bg-brand-surface border border-brand-border p-6 space-y-4">
              <div>
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground mb-1">Name</p>
                <p className="text-sm font-sans text-foreground">{user.name}</p>
              </div>
              <div>
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-sans text-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground mb-1">Member Since</p>
                <p className="text-sm font-sans text-foreground">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : 'Recently joined'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
