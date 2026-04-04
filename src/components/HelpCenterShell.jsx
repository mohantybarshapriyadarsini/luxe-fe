import { useState } from 'react';
import './HelpCenterShell.css';
import { sendMessageToGemini } from '../utils/chatbotApi';

export default function HelpCenterShell() {
  const [open, setOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleOpen = () => {
    if (!open && !initialized) {
      setMessages([{ id: 1, author: 'bot', text: 'Hello, how can I help you?' }]);
      setInitialized(true);
    }
    setOpen(prev => !prev);
    if (error) setError('');
  };

  const addMessage = (author, text) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), author, text }]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    addMessage('user', trimmed);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const botText = await sendMessageToGemini(trimmed);
      addMessage('bot', botText);
    } catch (err) {
      console.error('Gemini chat error:', err.message || err);
      const fallback = 'Sorry, I could not get a response right now. Please try again in a moment.';
      addMessage('bot', fallback);
      setError('Unable to reach the chat service. Please check your network and API key setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-center-shell" aria-live="polite">
      <button className="help-toggle-btn" onClick={toggleOpen} aria-expanded={open}>
        {open ? '✕' : '💬'} Help
      </button>

      {open && (
        <div className="help-panel" role="dialog" aria-label="LUXE Assistant">
          <div className="help-panel-header">
            <h4>LUXE Assistant</h4>
            <p className="help-header-subtitle">Powered by Gemini AI</p>
            <button onClick={toggleOpen} aria-label="Close chat">✕</button>
          </div>

          <div className="help-message-list">
            {messages.map(msg => (
              <div key={msg.id} className={`help-message ${msg.author === 'bot' ? 'bot' : 'user'}`}>
                <span>{msg.text}</span>
              </div>
            ))}
            {loading && (
              <div className="help-message bot help-loading"><span>Typing...</span></div>
            )}
          </div>

          {error && <div className="help-error">{error}</div>}

          <form className="help-input-area" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              aria-label="Type your message"
              disabled={loading}
            />
            <button type="submit" aria-label="Send message" disabled={!input.trim() || loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
