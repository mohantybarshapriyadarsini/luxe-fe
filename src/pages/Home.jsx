import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const BRANDS = [
  { name: 'Louis Vuitton', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80' },
  { name: 'Chanel', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80' },
  { name: 'Hermès', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=300&q=80' },
  { name: 'Rolex', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&q=80' },
  { name: 'Gucci', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80' },
  { name: 'Prada', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=300&q=80' },
];

export default function Home({ onAddToCart, onToggleWishlist, isInWishlist }) {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('🏠 Home: Fetching featured products...');
    getFeaturedProducts()
      .then(data => {
        console.log('✅ Featured products loaded:', data.length, data);
        setFeatured(data);
        setError('');
      })
      .catch(err => {
        console.error('❌ Featured products error:', err.message);
        setError(err.message);
        setFeatured([]);
      });
  }, []);

  return (
    <main className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-overlay-gradient" />
        <div className="hero-content">
          <p className="section-label anim-fade-up">100% Authenticated Luxury</p>
          <div className="divider anim-fade-up anim-delay-1" />
          <h1 className="hero-title anim-fade-up anim-delay-1">
            Where Luxury<br /><em>Meets Certainty</em>
          </h1>
          <p className="hero-sub anim-fade-up anim-delay-2">
            Every piece on LUXE is verified authentic by certified experts. No fakes. No compromises.
          </p>
          <div className="hero-actions anim-fade-up anim-delay-3">
            <button className="btn btn-gold" onClick={() => navigate('/products')}>Shop Collections</button>
            <button className="btn btn-outline" onClick={() => navigate('/help')}>Learn More</button>
          </div>
        </div>
        <div className="hero-side-text anim-fade-in anim-delay-4">
          AUTHENTICATED · VERIFIED · GENUINE · LUXE
        </div>
        <div className="scroll-indicator anim-fade-in anim-delay-4"><span /></div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="trust-bar">
        <div className="container trust-inner">
          {['Expert Authentication','Certificate of Authenticity','Insured Worldwide Shipping','14-Day Returns'].map((item, i) => (
            <div key={i} className="trust-item">
              <span className="trust-icon">✦</span><span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Brands ── */}
      <section className="brands-section">
        <div className="container">
          <p className="section-label" style={{ textAlign: 'center' }}>Our Brands</p>
          <div className="divider" />
          <div className="brands-grid">
            {BRANDS.map(brand => (
              <button
                key={brand.name}
                className="brand-card"
                onClick={() => navigate('/products?brand=' + encodeURIComponent(brand.name))}
                title={brand.name}
              >
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=' + brand.name; }}
                />
                <span className="brand-name">{brand.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="featured-section">
        <div className="container">
          <p className="section-label" style={{ textAlign: 'center' }}>Featured Pieces</p>
          <div className="divider" />
          <h2 className="section-title">Curated for You</h2>
          {error && (
            <div style={{
              background: '#232326', border: '1px solid #e05555', borderRadius: '8px',
              padding: '24px', marginBottom: '32px', textAlign: 'center'
            }}>
              <p style={{ color: '#e05555', fontSize: '15px' }}>⚠️ Featured products could not load</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>{error}</p>
            </div>
          )}
          {featured.length > 0 ? (
            <div className="products-grid">
              {featured.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onView={p => navigate('/product/' + p._id)}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isInWishlist={isInWishlist}
                />
              ))}
            </div>
          ) : !error && (
            <div className="products-grid skeleton-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) || (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>No featured products available</p>
              <button className="btn btn-outline" onClick={() => navigate('/products')}>
                Browse All Products
              </button>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <button className="btn btn-outline" onClick={() => navigate('/products')}>
              View All Collections
            </button>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="categories-section">
        <div className="container">
          <p className="section-label" style={{ textAlign: 'center' }}>Shop by Category</p>
          <div className="divider" />
          <div className="categories-grid">
            {[['Handbags','👜'],['Watches','⌚'],['Jewellery','💎'],['Shoes','👠'],['Accessories','🧣'],['Electronics','🔌']].map(([cat, icon]) => (
              <button
                key={cat}
                className="category-card"
                onClick={() => navigate('/products?category=' + cat)}
              >
                <span className="cat-icon">{icon}</span>
                <span className="cat-name">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promise ── */}
      <section className="promise-section">
        <div className="container promise-inner">
          <div className="promise-text">
            <p className="section-label">Our Promise</p>
            <div className="divider" style={{ margin: '16px 0' }} />
            <h2>Zero Tolerance<br />for Fakes</h2>
            <p>Every item listed on LUXE undergoes a rigorous multi-point authentication process by our team of certified luxury goods experts.</p>
            <p style={{ marginTop: '16px' }}>
              If an item ever fails authentication after purchase, we offer a full refund — no questions asked.
            </p>
            <button
              className="btn btn-outline"
              style={{ marginTop: '32px' }}
              onClick={() => navigate('/trust')}
            >
              See How We Authenticate →
            </button>
          </div>
          <div className="promise-stats">
            {[['100%','Authenticated'],['50+','Luxury Brands'],['0','Counterfeits']].map(([num, label]) => (
              <div key={label} className="stat">
                <span className="stat-num">{num}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
