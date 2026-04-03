import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import { priceINR } from '../utils/currency';
import './BestSellers.css';

// Curated best seller data with purchase counts and featured reviews
const BEST_SELLER_DATA = [
  {
    name: 'Birkin 30',
    brand: 'Hermès',
    purchases: 2847,
    badge: '🏆 #1 Best Seller',
    reviews: [
      { author: 'Priya S.', city: 'Mumbai',    rating: 5, text: 'Absolutely stunning. The craftsmanship is unmatched. LUXE delivered it perfectly authenticated with certificate.' },
      { author: 'Ananya K.', city: 'Delhi',    rating: 5, text: 'My dream bag finally arrived. Worth every rupee. The authentication process gave me complete confidence.' },
      { author: 'Sneha R.', city: 'Bangalore', rating: 5, text: 'Flawless condition, original packaging, certificate included. LUXE is the only place I trust for luxury.' },
    ],
  },
  {
    name: 'Rolex Submariner Date',
    brand: 'Rolex',
    purchases: 2341,
    badge: '🥈 #2 Best Seller',
    reviews: [
      { author: 'Arjun M.',  city: 'Delhi',     rating: 5, text: 'Received with original box and papers. The watch is in perfect condition. Highly recommend LUXE.' },
      { author: 'Vikram P.', city: 'Chennai',   rating: 5, text: 'Verified authentic, exactly as described. The Submariner is a timeless piece. Very happy with my purchase.' },
      { author: 'Rohan T.',  city: 'Pune',      rating: 4, text: 'Great experience overall. Fast shipping, well packaged, and the watch is stunning.' },
    ],
  },
  {
    name: 'Chanel Classic Flap Bag',
    brand: 'Chanel',
    purchases: 1986,
    badge: '🥉 #3 Best Seller',
    reviews: [
      { author: 'Meera L.',  city: 'Kolkata',   rating: 5, text: 'The Classic Flap is iconic and LUXE delivered it in pristine condition. Authentication certificate is a great touch.' },
      { author: 'Divya N.',  city: 'Jaipur',    rating: 5, text: 'Bought as a gift for my mother. She was overjoyed. Genuine Chanel, no doubts whatsoever.' },
      { author: 'Kavya S.',  city: 'Hyderabad', rating: 5, text: 'Perfect in every way. The lambskin is buttery soft. LUXE is my go-to for luxury purchases.' },
    ],
  },
  {
    name: 'Dyson Airwrap Complete',
    brand: 'Dyson',
    purchases: 1754,
    badge: '🔥 Trending',
    reviews: [
      { author: 'Rahul G.',  city: 'Surat',     rating: 5, text: 'Got the Airwrap sealed with original warranty. Works perfectly. LUXE is trustworthy for electronics too.' },
      { author: 'Pooja M.',  city: 'Mumbai',    rating: 5, text: 'Genuine product, original box, warranty card included. My hair has never looked better!' },
      { author: 'Riya K.',   city: 'Bangalore', rating: 4, text: 'Excellent product and fast delivery. Fully authentic as verified by LUXE team.' },
    ],
  },
  {
    name: 'Daytona Chronograph',
    brand: 'Rolex',
    purchases: 1523,
    badge: '⭐ Top Rated',
    reviews: [
      { author: 'Karan D.',  city: 'Ahmedabad', rating: 5, text: 'The Daytona is a masterpiece. Came with full papers and box. LUXE authentication gave me peace of mind.' },
      { author: 'Aditya R.', city: 'Mumbai',    rating: 5, text: 'Investment piece. Verified authentic, stunning condition. Will definitely buy from LUXE again.' },
      { author: 'Suresh P.', city: 'Chennai',   rating: 5, text: 'Exceptional service. The watch exceeded my expectations. Highly recommend.' },
    ],
  },
  {
    name: 'Hermès Kelly 28',
    brand: 'Hermès',
    purchases: 1398,
    badge: '💎 Luxury Pick',
    reviews: [
      { author: 'Nisha T.',  city: 'Delhi',     rating: 5, text: 'The Kelly is everything I dreamed of. LUXE delivered it with full authentication. Absolutely worth it.' },
      { author: 'Preethi V.',city: 'Chennai',   rating: 5, text: 'Stunning bag in perfect condition. The palladium hardware is flawless. LUXE is the best.' },
      { author: 'Lakshmi R.',city: 'Hyderabad', rating: 5, text: 'Bought for my anniversary. My wife was speechless. Genuine Hermès, certified by LUXE.' },
    ],
  },
];

function StarRating({ rating }) {
  return (
    <span className="bs-stars">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

function BestSellerCard({ data, product, onNavigate, onAddToCart, onToggleWishlist, isInWishlist, rank }) {
  const [activeReview, setActiveReview] = useState(0);
  const wished = product ? isInWishlist?.(product._id) : false;

  return (
    <div className="bs-card">
      {/* Rank badge */}
      <div className="bs-badge">{data.badge}</div>

      <div className="bs-card-inner">
        {/* Product Image */}
        <div className="bs-img-wrap" onClick={() => product && onNavigate('product', { productId: product._id })}>
          {product ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="bs-img-placeholder">
              <span>{data.brand.charAt(0)}</span>
            </div>
          )}
          <div className="bs-purchases">
            <span>🛍️</span> {data.purchases.toLocaleString('en-IN')} purchases
          </div>
        </div>

        {/* Product Info */}
        <div className="bs-info">
          <p className="bs-brand">{data.brand}</p>
          <h3 className="bs-name" onClick={() => product && onNavigate('product', { productId: product._id })}>
            {data.name}
          </h3>

          {product && (
            <>
              <div className="bs-rating-row">
                <StarRating rating={5} />
                <span className="bs-review-count">({data.reviews.length} reviews)</span>
              </div>
              <p className="bs-price">{priceINR(product.price)}</p>
              <p className="bs-desc">{product.description}</p>

              <div className="bs-actions">
                <button className="btn btn-gold" onClick={() => onAddToCart(product)}>
                  Add to Cart
                </button>
                <button
                  className={`bs-wishlist-btn ${wished ? 'wished' : ''}`}
                  onClick={() => onToggleWishlist(product)}
                >
                  {wished ? '♥ Wishlisted' : '♡ Wishlist'}
                </button>
              </div>
            </>
          )}

          {/* Reviews */}
          <div className="bs-reviews">
            <p className="bs-reviews-title">✦ Customer Reviews</p>
            <div className="bs-review-card">
              <div className="bs-review-header">
                <div className="bs-reviewer-avatar">
                  {data.reviews[activeReview].author.charAt(0)}
                </div>
                <div>
                  <p className="bs-reviewer-name">{data.reviews[activeReview].author}</p>
                  <p className="bs-reviewer-city">{data.reviews[activeReview].city}</p>
                </div>
                <StarRating rating={data.reviews[activeReview].rating} />
              </div>
              <p className="bs-review-text">"{data.reviews[activeReview].text}"</p>
            </div>

            {/* Review dots */}
            <div className="bs-review-dots">
              {data.reviews.map((_, i) => (
                <button
                  key={i}
                  className={`bs-dot ${i === activeReview ? 'active' : ''}`}
                  onClick={() => setActiveReview(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BestSellers({ onNavigate, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [products, setProducts]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    getProducts({})
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Match best seller data with real products from DB
  function matchProduct(data) {
    return products.find(p =>
      p.name.toLowerCase().includes(data.name.toLowerCase().split(' ')[0]) &&
      p.brand === data.brand
    ) || products.find(p => p.brand === data.brand);
  }

  const TABS = [
    { id: 'all',         label: 'All Best Sellers' },
    { id: 'Handbags',    label: '👜 Handbags' },
    { id: 'Watches',     label: '⌚ Watches' },
    { id: 'Electronics', label: '🔌 Electronics' },
  ];

  const CATEGORY_MAP = {
    Handbags:    ['Birkin 30', 'Chanel Classic Flap Bag', 'Hermès Kelly 28'],
    Watches:     ['Rolex Submariner Date', 'Daytona Chronograph'],
    Electronics: ['Dyson Airwrap Complete'],
  };

  const filtered = activeTab === 'all'
    ? BEST_SELLER_DATA
    : BEST_SELLER_DATA.filter(d => CATEGORY_MAP[activeTab]?.includes(d.name));

  return (
    <main className="bs-page">
      <div className="container">

        {/* Header */}
        <div className="bs-header">
          <p className="section-label">Most Loved</p>
          <div className="divider" style={{ margin: '12px 0' }} />
          <h1 className="bs-title">Best Sellers</h1>
          <p className="bs-subtitle">
            Our most purchased luxury items — verified authentic, loved by thousands of customers across India.
          </p>
        </div>

        {/* Live purchase ticker */}
        <div className="bs-ticker">
          <span className="bs-ticker-dot" />
          <div className="bs-ticker-track">
            {BEST_SELLER_DATA.map((d, i) => (
              <span key={i} className="bs-ticker-item">
                🛍️ <strong>{d.purchases.toLocaleString('en-IN')}</strong> people bought <strong>{d.name}</strong> this month &nbsp;&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="bs-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`bs-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="bs-stats-bar">
          {[
            { num: '12,400+', label: 'Happy Customers' },
            { num: '4.9/5',   label: 'Average Rating' },
            { num: '100%',    label: 'Authenticated' },
            { num: '0',       label: 'Counterfeits' },
          ].map((s, i) => (
            <div key={i} className="bs-stat">
              <span className="bs-stat-num">{s.num}</span>
              <span className="bs-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Best Seller Cards */}
        {loading ? (
          <div className="bs-skeleton-grid">
            {[...Array(3)].map((_, i) => <div key={i} className="bs-skeleton" />)}
          </div>
        ) : (
          <div className="bs-grid">
            {filtered.map((data, i) => (
              <BestSellerCard
                key={i}
                rank={i + 1}
                data={data}
                product={matchProduct(data)}
                onNavigate={onNavigate}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={isInWishlist}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="bs-cta">
          <p>Explore our full collection of authenticated luxury items</p>
          <button className="btn btn-gold" onClick={() => onNavigate('products')}>
            View All Collections
          </button>
        </div>

      </div>
    </main>
  );
}
