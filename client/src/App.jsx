import { useEffect, useState, useCallback } from 'react';
import { api, setToken } from './api.js';

// SVG Icons for clean, crisp UI without external dependencies
const Icons = {
  Card: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  ),
  Shield: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Search: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Send: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Check: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Trash: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Phone: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Inbox: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  Plus: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Logout: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Tag: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Sun: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Wifi: () => (
    <svg className="icon contactless-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  )
};

function Auth({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', invite: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const data = await api(`/auth/${mode}`, { method: 'POST', body: f });
      setToken(data.token);
      onAuth(data.user);
    } catch (x) {
      setErr(x.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand-badge">
            <Icons.Card />
          </div>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Access trusted card perks within your private circle'
              : 'Join your friends to share credit card privileges securely'}
          </p>
        </div>

        <div className="auth-switch-tabs">
          <button
            type="button"
            className={`auth-switch-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErr(''); }}
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-switch-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setErr(''); }}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label>Full name</label>
                <input
                  placeholder="e.g. Rahul Sharma"
                  value={f.name}
                  onChange={set('name')}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone number <span className="field-hint">(hidden until you accept a request)</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={f.phone}
                  onChange={set('phone')}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Group invite code <span className="field-hint">(optional / if set by group admin)</span>
                </label>
                <input
                  placeholder="Invite code"
                  value={f.invite}
                  onChange={set('invite')}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={f.email}
              onChange={set('email')}
              required
            />
          </div>

          <div className="form-group">
            <label>Password {mode === 'register' && <span className="field-hint">(8+ characters)</span>}</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={f.password}
              onChange={set('password')}
              required
            />
          </div>

          {err && (
            <div className="alert alert-error">
              <Icons.X />
              <span>{err}</span>
            </div>
          )}

          <button className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in to CardShare' : 'Create CardShare account'}
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            className="link-btn"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Browse({ currentUser }) {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [asking, setAsking] = useState(null);
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState('');
  const [noteType, setNoteType] = useState('success');
  const [isSearching, setIsSearching] = useState(false);

  const load = useCallback(() => {
    setIsSearching(true);
    api('/listings?q=' + encodeURIComponent(q))
      .then(setRows)
      .catch(() => {})
      .finally(() => setIsSearching(false));
  }, [q]);

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [load]);

  async function send(id) {
    setNote('');
    try {
      await api('/requests', { method: 'POST', body: { listingId: id, message: msg } });
      setAsking(null);
      setMsg('');
      setNote('Request sent successfully! You can track status under the Requests tab.');
      setNoteType('success');
    } catch (x) {
      setNote(x.message);
      setNoteType('error');
    }
  }

  return (
    <div className="browse-section">
      <div className="search-bar-wrapper">
        <div className="search-input-box">
          <Icons.Search />
          <input
            id="browse-search-input"
            placeholder="Search by card (e.g. Infinia, Platinum), bank (HDFC, Amex) or friend..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button className="search-clear-btn" onClick={() => setQ('')} title="Clear search">
              <Icons.X />
            </button>
          )}
        </div>
      </div>

      {note && (
        <div className={`alert alert-${noteType} fade-in`}>
          {noteType === 'success' ? <Icons.Check /> : <Icons.X />}
          <span>{note}</span>
        </div>
      )}

      <div className="card-feed">
        {rows.length === 0 && !isSearching && (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Icons.Card />
            </div>
            <h3>No cards found</h3>
            <p>
              {q
                ? `No cards or friends matched "${q}". Try searching for another card or bank name.`
                : 'No cards have been listed yet. Be the first to share a card under "My cards"!'}
            </p>
          </div>
        )}

        <div className="card-grid">
          {rows.map((r) => {
            const isMine = r.mine;
            const ownerInitial = (r.owner || '?').charAt(0).toUpperCase();

            return (
              <div className={`card-tile ${isMine ? 'card-tile-mine' : ''}`} key={r.id}>
                <div className="card-tile-top">
                  <div className="card-chip-container">
                    <span className="card-sim-chip" />
                    <Icons.Wifi />
                  </div>
                  {isMine ? (
                    <span className="badge badge-mine">Your Card</span>
                  ) : (
                    <div className="card-owner-info" title={`Listed by ${r.owner}`}>
                      <span className="owner-avatar">{ownerInitial}</span>
                      <span className="owner-name">{r.owner}</span>
                    </div>
                  )}
                </div>

                <div className="card-tile-body">
                  <div className="card-bank-tag">
                    {r.bank ? r.bank.toUpperCase() : 'CREDIT CARD'}
                  </div>
                  <div className="card-name-title">{r.card}</div>
                  {r.note ? (
                    <div className="card-perks">
                      <Icons.Tag />
                      <span>{r.note}</span>
                    </div>
                  ) : (
                    <div className="card-perks-empty">No special perk notes added</div>
                  )}
                </div>

                <div className="card-tile-footer">
                  {!isMine && asking !== r.id && (
                    <button className="btn btn-primary btn-sm" onClick={() => { setAsking(r.id); setMsg(''); }}>
                      <Icons.Send />
                      <span>Request Card</span>
                    </button>
                  )}

                  {isMine && (
                    <span className="owner-status-label">Ready for requests from friends</span>
                  )}
                </div>

                {asking === r.id && (
                  <div className="request-composer-drawer fade-in">
                    <div className="composer-header">
                      <span>Message for {r.owner}:</span>
                    </div>
                    <textarea
                      rows="2"
                      maxLength="300"
                      placeholder="e.g. Booking flights on MakeMyTrip for 10% off. Will settle immediately via UPI!"
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      autoFocus
                    />
                    <div className="composer-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => send(r.id)}>
                        <Icons.Send />
                        <span>Send Request</span>
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setAsking(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Mine() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ card: '', bank: '', note: '' });
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => api('/listings').then((r) => setRows(r.filter((x) => x.mine)));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const popularCards = [
    { card: 'Infinia Metal', bank: 'HDFC', note: '5X SmartBuy reward points, airport lounge access' },
    { card: 'Amex Platinum', bank: 'American Express', note: 'Taj stays voucher, airport lounge & concierge' },
    { card: 'Diners Club Black', bank: 'HDFC', note: 'Unlimited domestic & international lounge access' },
    { card: 'SBI Cashback', bank: 'SBI', note: '5% flat cashback on online purchases' }
  ];

  async function add(e) {
    e.preventDefault();
    setErr('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api('/listings', { method: 'POST', body: f });
      setF({ card: '', bank: '', note: '' });
      setSuccess('Card successfully listed! Friends can now search and request it.');
      load();
    } catch (x) {
      setErr(x.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function del(id) {
    if (!window.confirm('Are you sure you want to remove this card listing?')) return;
    try {
      await api('/listings/' + id, { method: 'DELETE' });
      load();
    } catch (x) {
      setErr(x.message);
    }
  }

  return (
    <div className="mine-section">
      <div className="panel add-card-panel">
        <div className="panel-header">
          <div className="panel-icon-wrap">
            <Icons.Plus />
          </div>
          <div>
            <h3>Add a card you hold</h3>
            <p className="panel-subtitle">Share privileges with friends. Only the card name and perks are shown.</p>
          </div>
        </div>

        <form onSubmit={add} className="add-card-form">
          <div className="suggestions-bar">
            <span className="suggestions-label">Quick suggestions:</span>
            {popularCards.map((preset) => (
              <button
                key={preset.card}
                type="button"
                className="suggestion-chip"
                onClick={() => setF({ card: preset.card, bank: preset.bank, note: preset.note })}
              >
                + {preset.card}
              </button>
            ))}
          </div>

          <div className="form-row">
            <div className="form-group flex-2">
              <label>Card Name *</label>
              <input
                placeholder="e.g. Infinia Metal, Amex Platinum, Diners Black"
                value={f.card}
                onChange={set('card')}
                required
                maxLength="60"
              />
            </div>
            <div className="form-group flex-1">
              <label>Bank / Issuer</label>
              <input
                placeholder="e.g. HDFC, Amex, ICICI, SBI"
                value={f.bank}
                onChange={set('bank')}
                maxLength="40"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Perks / Notes for Friends <span className="field-hint">(optional)</span></label>
            <textarea
              rows="2"
              placeholder="e.g. 5X SmartBuy reward points, airport lounge access, 10% instant discount on Swiggy & Amazon"
              value={f.note}
              onChange={set('note')}
              maxLength="160"
            />
          </div>

          <div className="security-notice-inline">
            <Icons.Shield />
            <span>Never enter full card numbers, CVV, or expiry dates. The server automatically rejects card numbers.</span>
          </div>

          {err && (
            <div className="alert alert-error">
              <Icons.X />
              <span>{err}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <Icons.Check />
              <span>{success}</span>
            </div>
          )}

          <div className="form-actions">
            <button className="btn btn-primary" disabled={submitting}>
              <Icons.Plus />
              <span>{submitting ? 'Listing Card...' : 'Add Card to Circle'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="my-cards-list-section">
        <div className="section-title-row">
          <h3>Your Listed Cards ({rows.length})</h3>
        </div>

        {rows.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Icons.Card />
            </div>
            <h4>No cards listed yet</h4>
            <p>Add the credit cards you hold above to help friends take advantage of bank offers and perks!</p>
          </div>
        ) : (
          <div className="card-grid">
            {rows.map((r) => (
              <div className="card-tile card-tile-mine" key={r.id}>
                <div className="card-tile-top">
                  <div className="card-chip-container">
                    <span className="card-sim-chip" />
                    <Icons.Wifi />
                  </div>
                  <button
                    className="btn btn-ghost-danger btn-sm"
                    onClick={() => del(r.id)}
                    title="Remove listing"
                  >
                    <Icons.Trash />
                    <span>Remove</span>
                  </button>
                </div>
                <div className="card-tile-body">
                  <div className="card-bank-tag">{r.bank ? r.bank.toUpperCase() : 'CREDIT CARD'}</div>
                  <div className="card-name-title">{r.card}</div>
                  {r.note && (
                    <div className="card-perks">
                      <Icons.Tag />
                      <span>{r.note}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Requests() {
  const [inc, setInc] = useState([]);
  const [out, setOut] = useState([]);
  const [activeReqTab, setActiveReqTab] = useState('incoming');

  const load = () => {
    api('/requests/incoming').then(setInc).catch(() => {});
    api('/requests/outgoing').then(setOut).catch(() => {});
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  const answer = async (id, status) => {
    await api('/requests/' + id, { method: 'PATCH', body: { status } });
    load();
  };

  const pendingIncomingCount = inc.filter((r) => r.status === 'pending').length;

  return (
    <div className="requests-section">
      <div className="requests-nav-tabs">
        <button
          className={`req-subtab ${activeReqTab === 'incoming' ? 'active' : ''}`}
          onClick={() => setActiveReqTab('incoming')}
        >
          <Icons.Inbox />
          <span>Requests for your cards</span>
          {pendingIncomingCount > 0 && <span className="counter-pill">{pendingIncomingCount}</span>}
        </button>
        <button
          className={`req-subtab ${activeReqTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => setActiveReqTab('outgoing')}
        >
          <Icons.Send />
          <span>Your requested cards</span>
          {out.length > 0 && <span className="counter-pill counter-pill-muted">{out.length}</span>}
        </button>
      </div>

      {activeReqTab === 'incoming' && (
        <div className="req-list-container fade-in">
          {inc.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <Icons.Inbox />
              </div>
              <h4>No incoming requests</h4>
              <p>When friends ask to use one of your cards, their requests and messages will appear here.</p>
            </div>
          ) : (
            <div className="req-items-list">
              {inc.map((r) => {
                const isPending = r.status === 'pending';
                const isAccepted = r.status === 'accepted';

                return (
                  <div className={`req-item req-item-${r.status}`} key={r.id}>
                    <div className="req-item-main">
                      <div className="req-header-row">
                        <div className="req-user-badge">
                          <span className="owner-avatar">{(r.buyer_name || '?').charAt(0).toUpperCase()}</span>
                          <span className="req-buyer-name">{r.buyer_name}</span>
                        </div>
                        <span className={`status-badge status-${r.status}`}>
                          {isPending && <span className="pulse-dot" />}
                          {r.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="req-card-target">
                        Requested your <strong>{r.card}</strong>
                      </div>

                      {r.message && (
                        <div className="req-message-bubble">
                          <span className="quote-mark">“</span>
                          <p>{r.message}</p>
                        </div>
                      )}

                      {isAccepted && r.buyer_phone && (
                        <div className="contact-reveal-box">
                          <Icons.Phone />
                          <span>Friend Contact:</span>
                          <a href={`tel:${r.buyer_phone}`} className="phone-link">
                            {r.buyer_phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {isPending && (
                      <div className="req-actions-panel">
                        <button className="btn btn-success btn-sm" onClick={() => answer(r.id, 'accepted')}>
                          <Icons.Check />
                          <span>Accept & Share Phone</span>
                        </button>
                        <button className="btn btn-ghost-danger btn-sm" onClick={() => answer(r.id, 'declined')}>
                          <Icons.X />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeReqTab === 'outgoing' && (
        <div className="req-list-container fade-in">
          {out.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <Icons.Send />
              </div>
              <h4>No outgoing requests</h4>
              <p>Search for a card in the Browse tab and send a request to a friend.</p>
            </div>
          ) : (
            <div className="req-items-list">
              {out.map((r) => {
                const isAccepted = r.status === 'accepted';

                return (
                  <div className={`req-item req-item-${r.status}`} key={r.id}>
                    <div className="req-item-main">
                      <div className="req-header-row">
                        <div className="req-card-target">
                          Cardholder: <strong>{r.owner_name}</strong>
                        </div>
                        <span className={`status-badge status-${r.status}`}>
                          {r.status === 'pending' && <span className="pulse-dot" />}
                          {r.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="req-card-title">
                        Card: <strong>{r.card}</strong>
                      </div>

                      {r.message && (
                        <div className="req-message-bubble">
                          <span className="quote-mark">“</span>
                          <p>{r.message}</p>
                        </div>
                      )}

                      {isAccepted && r.owner_phone ? (
                        <div className="contact-reveal-box contact-reveal-accepted">
                          <Icons.Phone />
                          <span>Friend’s Phone:</span>
                          <a href={`tel:${r.owner_phone}`} className="phone-link">
                            {r.owner_phone}
                          </a>
                        </div>
                      ) : (
                        <div className="contact-hidden-hint">
                          <Icons.Shield />
                          <span>Friend’s phone number will be revealed once they accept your request.</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="safety-card-banner">
        <Icons.Shield />
        <div>
          <h4>Direct Settlement Guidelines</h4>
          <p>
            Cardholders pay with their own card and never share raw card numbers, CVVs, or OTPs. Settle with your friend
            promptly upon receipt of your order.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('browse');
  const [incomingCount, setIncomingCount] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('cardshare-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cardshare-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    api('/me')
      .then((d) => setUser(d.user))
      .catch(() => setToken(''))
      .finally(() => setReady(true));
  }, []);

  // Poll for pending incoming requests badge
  useEffect(() => {
    if (!user) return;
    const checkRequests = () => {
      api('/requests/incoming')
        .then((reqs) => {
          if (Array.isArray(reqs)) {
            setIncomingCount(reqs.filter((r) => r.status === 'pending').length);
          }
        })
        .catch(() => {});
    };
    checkRequests();
    const interval = setInterval(checkRequests, 12000);
    return () => clearInterval(interval);
  }, [user]);

  if (!ready) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Connecting to CardShare...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-group">
            <div className="brand-icon">
              <Icons.Card />
            </div>
            <div>
              <h1 className="brand-title">CardShare</h1>
              <span className="brand-tagline">Trusted peer-to-peer card privileges</span>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
            </button>

            {user && (
              <div className="header-user-group">
                <div className="user-profile-pill">
                  <span className="user-avatar-circle">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                  <span className="user-name-text">{user.name || user.email}</span>
                </div>
                <button
                  className="btn-logout"
                  onClick={() => { setToken(''); setUser(null); }}
                  title="Log out of CardShare"
                >
                  <Icons.Logout />
                  <span className="logout-text">Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {!user ? (
          <Auth onAuth={setUser} />
        ) : (
          <div className="app-content-wrapper">
            <div className="security-banner">
              <div className="security-banner-icon">
                <Icons.Shield />
              </div>
              <div className="security-banner-text">
                <strong>Zero-Knowledge Safety:</strong> Only the card’s name is listed. Card numbers, expiry dates, CVVs,
                and OTPs are strictly prohibited. Friends pay with their own card.
              </div>
            </div>

            <nav className="main-nav-tabs">
              <button
                className={`tab-btn ${tab === 'browse' ? 'active' : ''}`}
                onClick={() => setTab('browse')}
              >
                <Icons.Search />
                <span>Browse Cards</span>
              </button>
              <button
                className={`tab-btn ${tab === 'mine' ? 'active' : ''}`}
                onClick={() => setTab('mine')}
              >
                <Icons.Card />
                <span>My Cards</span>
              </button>
              <button
                className={`tab-btn ${tab === 'requests' ? 'active' : ''}`}
                onClick={() => setTab('requests')}
              >
                <Icons.Inbox />
                <span>Requests</span>
                {incomingCount > 0 && <span className="tab-badge-pulse">{incomingCount}</span>}
              </button>
            </nav>

            <div className="tab-pane-content">
              {tab === 'browse' && <Browse currentUser={user} />}
              {tab === 'mine' && <Mine />}
              {tab === 'requests' && <Requests />}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>CardShare — Private card perks among friends. Settle directly & safely.</p>
      </footer>
    </div>
  );
}
