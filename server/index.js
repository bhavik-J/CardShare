const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const PORT = process.env.PORT || 3001;
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const INVITE = process.env.INVITE_CODE || ''; // if set, required to register
if (!process.env.JWT_SECRET) console.warn('WARNING: JWT_SECRET not set, using an insecure dev secret.');

const app = express();
app.use(express.json({ limit: '10kb' }));

// ---- helpers ----
const clean = (v, max) => String(v || '').trim().slice(0, max);
const looksLikeCardNumber = (s) => /\d(?:[\s-]?\d){11,}/.test(s); // 12+ digits
const sign = (u) => jwt.sign({ id: u.id }, SECRET, { expiresIn: '30d' });
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone });

function auth(req, res, next) {
  const h = req.get('authorization') || '';
  try {
    const { id } = jwt.verify(h.replace(/^Bearer /, ''), SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) throw new Error('no user');
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Please log in' });
  }
}

// ---- auth ----
app.post('/api/auth/register', (req, res) => {
  const b = req.body || {};
  const name = clean(b.name, 40), email = clean(b.email, 80).toLowerCase(), phone = clean(b.phone, 20);
  const password = String(b.password || '');
  if (INVITE && clean(b.invite, 60) !== INVITE) return res.status(403).json({ error: 'Wrong invite code' });
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 7) return res.status(400).json({ error: 'Name, valid email and phone are required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) return res.status(409).json({ error: 'Email already registered' });
  const info = db.prepare('INSERT INTO users (name,email,phone,pass_hash,created_at) VALUES (?,?,?,?,?)')
    .run(name, email, phone, bcrypt.hashSync(password, 10), Date.now());
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ token: sign(user), user: publicUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const email = clean(req.body?.email, 80).toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(String(req.body?.password || ''), user.pass_hash)) {
    return res.status(401).json({ error: 'Wrong email or password' });
  }
  res.json({ token: sign(user), user: publicUser(user) });
});

app.get('/api/me', auth, (req, res) => res.json({ user: publicUser(req.user) }));

// ---- listings (phone is never exposed here) ----
app.get('/api/listings', auth, (req, res) => {
  const q = `%${clean(req.query.q, 60)}%`;
  const rows = db.prepare(`
    SELECT l.id, l.card, l.bank, l.note, l.created_at, l.user_id, u.name AS owner
    FROM listings l JOIN users u ON u.id = l.user_id
    WHERE l.card LIKE ? OR l.bank LIKE ? OR l.note LIKE ? OR u.name LIKE ?
    ORDER BY l.created_at DESC LIMIT 200`).all(q, q, q, q);
  res.json(rows.map(({ user_id, ...r }) => ({ ...r, mine: user_id === req.user.id })));
});

app.post('/api/listings', auth, (req, res) => {
  const card = clean(req.body?.card, 60), bank = clean(req.body?.bank, 40), note = clean(req.body?.note, 160);
  if (!card) return res.status(400).json({ error: 'Card name is required' });
  if (looksLikeCardNumber([card, bank, note].join(' '))) return res.status(400).json({ error: 'That looks like a card number. Only the card name is allowed.' });
  db.prepare('INSERT INTO listings (user_id,card,bank,note,created_at) VALUES (?,?,?,?,?)').run(req.user.id, card, bank, note, Date.now());
  res.status(201).json({ ok: true });
});

app.delete('/api/listings/:id', auth, (req, res) => {
  const info = db.prepare('DELETE FROM listings WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (!info.changes) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

// ---- requests: a phone number is revealed only after the cardholder accepts ----
app.post('/api/requests', auth, (req, res) => {
  const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.body?.listingId);
  const message = clean(req.body?.message, 300);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (listing.user_id === req.user.id) return res.status(400).json({ error: 'That is your own card' });
  if (!message) return res.status(400).json({ error: 'Say what you want to buy' });
  if (looksLikeCardNumber(message)) return res.status(400).json({ error: 'Never share card numbers' });
  if (db.prepare("SELECT 1 FROM requests WHERE listing_id=? AND buyer_id=? AND status='pending'").get(listing.id, req.user.id)) {
    return res.status(409).json({ error: 'You already have a pending request for this card' });
  }
  db.prepare('INSERT INTO requests (listing_id,buyer_id,message,created_at) VALUES (?,?,?,?)').run(listing.id, req.user.id, message, Date.now());
  res.status(201).json({ ok: true });
});

app.get('/api/requests/incoming', auth, (req, res) => {
  res.json(db.prepare(`
    SELECT r.id, r.message, r.status, r.created_at, l.card, b.name AS buyer_name,
           CASE WHEN r.status = 'accepted' THEN b.phone END AS buyer_phone
    FROM requests r JOIN listings l ON l.id = r.listing_id JOIN users b ON b.id = r.buyer_id
    WHERE l.user_id = ? ORDER BY r.created_at DESC`).all(req.user.id));
});

app.get('/api/requests/outgoing', auth, (req, res) => {
  res.json(db.prepare(`
    SELECT r.id, r.message, r.status, r.created_at, l.card, o.name AS owner_name,
           CASE WHEN r.status = 'accepted' THEN o.phone END AS owner_phone
    FROM requests r JOIN listings l ON l.id = r.listing_id JOIN users o ON o.id = l.user_id
    WHERE r.buyer_id = ? ORDER BY r.created_at DESC`).all(req.user.id));
});

app.patch('/api/requests/:id', auth, (req, res) => {
  const status = req.body?.status;
  if (!['accepted', 'declined'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const info = db.prepare(`UPDATE requests SET status = ? WHERE id = ? AND status = 'pending'
    AND listing_id IN (SELECT id FROM listings WHERE user_id = ?)`).run(status, req.params.id, req.user.id);
  if (!info.changes) return res.status(404).json({ error: 'Not found or already answered' });
  res.json({ ok: true });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// ---- serve the built React app in production ----
const dist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const HOST = '0.0.0.0';
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`CardShare API running on http://${HOST}:${PORT}`);
  });
}
module.exports = app;
