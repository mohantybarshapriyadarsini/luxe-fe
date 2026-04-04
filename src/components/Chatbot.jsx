import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const SYSTEM_CONTEXT = `You are LUXE Assistant — the official AI support chatbot for LUXE, a premium authenticated luxury e-commerce platform.

=== ABOUT LUXE ===
LUXE is a luxury e-commerce store that sells 100% authenticated luxury goods. Every item is verified by certified luxury goods experts before listing. LUXE has a zero-tolerance policy for counterfeits.

=== BRANDS AVAILABLE ===
Louis Vuitton, Chanel, Hermès, Rolex, Gucci, Prada, Dyson

=== PRODUCT CATEGORIES ===
- Handbags (Louis Vuitton, Chanel, Hermès, Gucci, Prada)
- Watches (Rolex)
- Jewellery
- Shoes (Gucci, Prada)
- Accessories (Gucci, Prada — belts, hats, scarves, wallets, sunglasses, keychains)
- Electronics (Dyson — hair care, vacuums, air purifiers, fans, lighting, headphones)

=== PAGES & NAVIGATION ===
- Home (/) — Hero, featured products, brand showcase, categories
- Products (/products) — Full catalog with filters by brand, category, price, sort
- Product Detail (/product/:id) — Individual product page
- Cart (/cart) — Shopping cart and checkout
- Wishlist (/wishlist) — Saved items (login required)
- Orders (/orders) — Order history and tracking (login required)
- Profile (/profile) — Account settings (login required)
- Help Center (/help) — FAQs, contact form, support info
- Best Sellers (/best-sellers) — Top selling products
- Trust (/trust) — Authentication process details
- Brand Register (/brand-register) — Register as a seller/brand

=== AUTHENTICATION ===
- Every item undergoes a rigorous multi-point inspection
- Experts verify serial numbers, hardware, stitching, materials, and provenance documentation
- Certificate of Authenticity provided with every purchase
- If an item fails authentication after purchase: full refund guaranteed

=== SHIPPING ===
- Standard shipping: 3–7 business days
- Express shipping: 1–2 business days (available at checkout)
- International shipping: 7–14 business days
- All orders are fully insured during transit
- Free shipping on all orders

=== RETURNS & REFUNDS ===
- 14-day return policy on all items
- Full refund if item fails authentication after purchase
- Refund requests available from the Orders page (for paid orders)
- Refund review takes 2–3 business days
- Items must be returned in original condition

=== PAYMENT METHODS ===
- Razorpay (UPI, Cards, Net Banking, Wallets) — Pay Now
- Cash on Delivery (COD)
- UPI Transfer — UPI ID: luxe@ybl
- Bank Transfer (NEFT/IMPS) — HDFC Bank, Account: LUXE Pvt Ltd, IFSC: HDFC0001234

=== ORDERS ===
- View orders at /orders (login required)
- Order statuses: Pending → Confirmed → Shipped → Delivered
- Tracking history available on each order card
- Refund can be requested for paid orders from the Orders page

=== ACCOUNT ===
- Login at /login, Signup at /signup
- Profile management at /profile
- Wishlist requires login

=== CONTACT & SUPPORT ===
- Email: support@luxe.com
- Phone: +1 (800) LUXE-000
- Hours: Mon–Fri, 9am–6pm EST
- Address: 1 Luxury Avenue, New York, NY 10001
- Contact form available at /help

=== TRUST & STATS ===
- 100% authenticated products
- 50+ luxury brands
- 0 counterfeits ever
- Brands with annual revenue of $284M+ receive Certified LUXE Brand status

=== RESPONSE RULES ===
- Keep replies short, warm, and elegant (2–3 sentences max)
- Always guide users to the correct page when relevant (e.g. "Visit /orders to track your order")
- If asked something unrelated to LUXE or shopping, politely redirect
- Never make up product prices or order details you don't know
- Speak in a premium, helpful, concise tone matching a luxury brand`;

async function fetchGeminiReply(userMessage, history) {
  const contents = [
    ...history.map(m => ({
      role: m.from === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
      contents,
    }),
  });

  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help! Could you rephrase that?";
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  function openChat() {
    setOpen(true);
    if (!welcomed) {
      setMessages([{ from: 'bot', text: 'Hello 👋 How can I help you?' }]);
      setWelcomed(true);
    }
  }

  function closeChat() { setOpen(false); }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { from: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await fetchGeminiReply(trimmed, messages);
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') sendMessage();
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  return (
    <div className="cb-root">
      {open && (
        <div className="cb-panel">
          <div className="cb-header">
            {/* Help icon — top left */}
            <button
              className="cb-help-btn"
              onClick={() => { navigate('/help'); closeChat(); }}
              aria-label="Go to Help Center"
              title="Help Center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>

            {/* Center title */}
            <div className="cb-header-center">
              <span className="cb-avatar">✦</span>
              <div>
                <div className="cb-title">LUXE Assistant</div>
                <div className="cb-status">Powered by Gemini AI</div>
              </div>
            </div>

            {/* Close button — top right */}
            <button className="cb-close" onClick={closeChat} aria-label="Close chat">✕</button>
          </div>

          <div className="cb-messages">
            {messages.map((m, i) => (
              <div key={i} className={`cb-msg cb-msg--${m.from}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="cb-msg cb-msg--bot cb-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="cb-input-row">
            <input
              ref={inputRef}
              className="cb-input"
              type="text"
              placeholder="Ask me anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="cb-send"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button className="cb-fab" onClick={open ? closeChat : openChat} aria-label="Toggle chat">
        <span className="cb-fab-icon">{open ? '✕' : '💬'}</span>
      </button>
    </div>
  );
}
