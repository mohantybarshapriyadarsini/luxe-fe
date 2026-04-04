import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import HelpCenter from './pages/HelpCenter';
import Trust from './pages/Trust';
import AdminDashboard from './pages/AdminDashboard';
import BrandRegister from './pages/BrandRegister';
import BestSellers from './pages/BestSellers';
import Toast from './components/Toast';
import Chatbot from './components/Chatbot';
import './index.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate('/login');
    return null;
  }
  return children;
}

function AppInner() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_cart')) || []; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);

  function showToast({ type, icon, title, sub }) {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, icon, title, sub }]);
    setTimeout(() => removeToast(id), 3500);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    const existing = cart.find(i => i._id === product._id);
    if (existing) {
      showToast({ type: 'cart', icon: '🛍️', title: 'Already in Cart', sub: `${product.name} quantity updated.` });
      setCart(prev => prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      showToast({ type: 'cart', icon: '🛍️', title: 'Added to Cart', sub: product.name });
      setCart(prev => [...prev, { ...product, qty: 1 }]);
    }
  }

  function removeFromCart(id) { setCart(prev => prev.filter(i => i._id !== id)); }

  function updateQty(id, qty) {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  }

  function clearCart() { setCart([]); }

  function toggleWishlist(product) {
    const exists = wishlist.find(p => p._id === product._id);
    if (exists) {
      showToast({ type: 'wishlist-remove', icon: '🤍', title: 'Removed from Wishlist', sub: product.name });
      setWishlist(prev => prev.filter(p => p._id !== product._id));
    } else {
      showToast({ type: 'wishlist-add', icon: '♥️', title: 'Added to Wishlist', sub: product.name });
      setWishlist(prev => [...prev, product]);
    }
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const isInWishlist = (id) => wishlist.some(p => p._id === id);

  if (loading) return null;

  const hideFooter = ['/login', '/signup', '/admin'].includes(location.pathname);

  return (
    <>
      {location.pathname !== '/admin' && <Navbar cartCount={cartCount} wishlistCount={wishlist.length} navigate={navigate} />}
      <Routes>
        <Route path="/" element={<Home onAddToCart={addToCart} onToggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products onAddToCart={addToCart} onToggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />} />
        <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} onToggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />} />
        <Route path="/cart" element={<Cart cart={cart} onRemove={removeFromCart} onUpdateQty={updateQty} onClearCart={clearCart} />} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist wishlist={wishlist} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/trust" element={<Trust />} />
        <Route path="/best-sellers" element={<BestSellers onAddToCart={addToCart} onToggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/brand-register" element={<BrandRegister />} />
      </Routes>
      {!hideFooter && <Footer navigate={navigate} />}
      <Toast toasts={toasts} onRemove={removeToast} />
      <Chatbot />
    </>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
