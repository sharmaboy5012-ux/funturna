require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Firebase Admin
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "funturna-d9753",
    clientEmail: "firebase-adminsdk-fbsvc@funturna-d9753.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDhyYSLDvMxFKXR\njzzxSEbABE/kx2BvwaLJ3ay+rh5XDN+J4Hec25lE3wA80gQ9xT6a7RKn0psUS9fM\ngRH7+q0z8qpSBe1fZVrCjP9TYOtSWp+IbgvOTlIyfddmalGg98t8SIR0bjT8BS0o\ncrMEvjuvinjMBbmGcMc8i7/Uj0udN5SJZ4d7FCzniGKGpWSXA7CeA6D31gPxhukZ\nTfPaU7DuaSSi69PslbsiICuV/qqjDatNSTWk/lKnzNLiZeI3Dj50czqis2NW8P97\ndJYgDRkMukJWlN/5LfLotYZG2IeL+tUYSuYmcE/m07CxN1XpqOUZ4SzTb4iW7Sxt\n0+lE51bpAgMBAAECgf8GS0Za9xtcCLdQzrkHGB+a9ODoLkmNjinBX4982IxFya1a\nTX7ZjxcIJelzDmeyxXtiBMV0uaRqg7K6gLALSojmmF0nGr1gVCGFBQwZDL2CmdWS\n1SFn2Qzl5xCC1f+HzqZdfxxgriYpDuScGSIS9CNYtb2oT2lFSoJx3C2fs6S5a7ot\nEnvIOrSFJJSSJgWZ9sNBBObCwD5gIdkJJXEMVfToWeiH5pDAp02cGPcomMAt1ZSg\nNOBezjV2lhX+5bLUNBk8/q4T85JCcV0VrIvdh9BngC6GX7RcMp72mhBSzXcZ1H45\nsgs6jN0zw4n2B+JOcrfMeNFwwjJrCKhJk0oKHZkCgYEA9d6n9ivI1vjImDl8lwsL\neXAOroKeFvya5PI46bgMIpfGsqrFaao+CxGiwx5mczAqrmHnxCoDD5qM+eA9E9bE\nyCiVQn6v+qyImupWVN1upLiCvrQfCqsfoDfkAf8D5Sa2zllmGT0h32ew4XO1BsUm\nO4yQ1WqYBCZabnLVZv7mH5UCgYEA6xcJvasfxASBfISKkghnE6SpQhlVHjqY/8Iz\nNBNwJWdPXb3HpfyGmzSp/xOH53F31zeAV+T2yohesjIMpAU6IFWPX4Rkx9KqFvGa\nXtQ+Vg45Ucx96KF1uimkhVTHBG49ZPYXeTXUFEgAEi32vvf8FHfTfMsvh+KWjpW0\nA9wrlQUCgYAFUd38e5IK5LMiaAwEEJ8c74nByN22zZxkW8FTfUH19aa88uj2klJp\nVuZYpm29DEvAHiovmmEak1N9jJaFuV3knswr9iXEnLsP7wYTK/9a3QsnKSqKxo0W\noF70lBn3eVD3QgPtg98ZwFqZZjGChf1/yFjR5U6IuHO4dA+d/OHpyQKBgAD43Gpz\nXbNCzYJFTglijYKQSL7kOezhEybjl7Ccb/dHoRVjJoMyMyBLLHTIkORNHNDAAwDa\nCoc13yZffJvlBaOClxAvDPeikF996kSAHi3e6y/CZ7bhjAoUCAEhI52KEyjqt5gh\nt9nJnm500DNj9R/kivRWJsEqF7NJPTBS5b89AoGBAPQqYvqutKS+JCbg57fAzM4i\n5ZnJrLbmmJWTZH7o5/sQMgC053FZuj8hSEjWPY0aoXX+v1XVbldA6nsHh3l7scBe\nLiesl3wsxvcn73WsyG1MBNtvJbCG8XyeHaqaNq9FcQJO6XNZS5ce+81K1m4OVO1i\n6SrJL7Tm5jwrKH34DX6I\n-----END PRIVATE KEY-----\n"
  })
});

// ===== MODELS =====
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  phone: String,
  password: String,
  ffUid: String,
  ffName: String,
  nickname: String,
  referralCode: { type: String, unique: true },
  referredBy: String,
  coins: { type: Number, default: 0 },
  diamonds: { type: Number, default: 5 },
  matchesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  referralEarnings: { type: Number, default: 0 },
  referrals: [String],
  joinedTournaments: [String],
  isBanned: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  deviceId: String,
  firebaseUid: String,
}, { timestamps: true });

const tournamentSchema = new mongoose.Schema({
  banner: String,
  name: { type: String, required: true },
  type: { type: String, enum: ['BR', 'CS', 'LW'] },
  mode: { type: String, enum: ['solo', 'duo', 'squad'], default: 'solo' },
  entryFee: Number,
  prizePool: Number,
  dateTime: Date,
  maxPlayers: Number,
  joinedPlayers: [String],
  entries: [{
    odUserId: String,
    ffName: String,
    teamMembers: [{ ffName: String, isOwner: Boolean }],
    joinedAt: Date
  }],
  rules: String,
  rewards: String,
  roomId: String,
  roomPassword: String,
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
  results: [{ userId: String, position: Number, reward: Number, kills: Number }],
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
  odUserId: String,
  type: { type: String, enum: ['deposit', 'withdrawal', 'entry_fee', 'reward', 'signup_bonus', 'referral'] },
  currency: { type: String, enum: ['coins', 'diamonds', 'mixed'] },
  amount: Number,
  diamondsUsed: Number,
  coinsUsed: Number,
  status: { type: String, enum: ['pending', 'completed', 'rejected'] },
  details: String,
  upiId: String,
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  title: String, message: String,
  type: { type: String, enum: ['tournament', 'reward', 'system', 'reminder'] },
}, { timestamps: true });

const communitySchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'image', 'video'] },
  content: String, mediaUrl: String,
  authorId: String, authorName: String,
}, { timestamps: true });

const depositSchema = new mongoose.Schema({
  odUserId: String, amount: Number, paymentId: String,
  status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
}, { timestamps: true });

const withdrawSchema = new mongoose.Schema({
  odUserId: String, amount: Number, upiId: String,
  status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Tournament = mongoose.model('Tournament', tournamentSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Community = mongoose.model('Community', communitySchema);
const Deposit = mongoose.model('Deposit', depositSchema);
const Withdraw = mongoose.model('Withdraw', withdrawSchema);

// ===== HELPERS =====
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
const genRefCode = (name) => (name || 'USR').substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 7).toUpperCase();

// Auth middleware
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    if (req.user.isBanned) return res.status(403).json({ error: 'Banned' });
    next();
  } catch (e) { return res.status(401).json({ error: 'Invalid token' }); }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};

const ADMIN_EMAIL = 'sushilasharm0123456789@gmail.com';

// ===== AUTH ROUTES =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, phone, ffUid, ffName, nickname, referredBy, deviceId } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    // Device check
    if (deviceId) {
      const deviceUser = await User.findOne({ deviceId, role: { $ne: 'admin' } });
      if (deviceUser) return res.status(400).json({ error: 'One account per device only!' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashed, phone, ffUid, ffName, nickname,
      referralCode: genRefCode(nickname), referredBy: referredBy || null,
      coins: 0, diamonds: 5, deviceId,
      role: email === ADMIN_EMAIL ? 'admin' : 'user',
    });

    // Signup bonus transaction
    await Transaction.create({ odUserId: user._id, type: 'signup_bonus', currency: 'diamonds', amount: 5, status: 'completed', details: 'Signup bonus - 5 ⛃' });

    // Referral
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        referrer.referrals.push(user._id.toString());
        await referrer.save();
      }
    }

    res.json({ token: genToken(user._id), user: { ...user.toObject(), password: undefined } });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    if (!user.password) return res.status(400).json({ error: 'Use Google login for this account' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });
    if (user.isBanned) return res.status(403).json({ error: 'Account banned' });

    // Device check
    if (user.role !== 'admin' && user.deviceId && deviceId && user.deviceId !== deviceId) {
      return res.status(403).json({ error: 'Account logged in on another device!' });
    }
    if (deviceId && user.deviceId !== deviceId) {
      user.deviceId = deviceId;
      await user.save();
    }

    res.json({ token: genToken(user._id), user: { ...user.toObject(), password: undefined } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/google-login', async (req, res) => {
  try {
    const { idToken, deviceId } = req.body;
    const decoded = await admin.auth().verifyIdToken(idToken);
    
    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) user = await User.findOne({ email: decoded.email });

    if (user) {
      if (user.isBanned) return res.status(403).json({ error: 'Banned' });
      if (user.role !== 'admin' && user.deviceId && deviceId && user.deviceId !== deviceId) {
        return res.status(403).json({ error: 'Another device!' });
      }
      if (!user.firebaseUid) { user.firebaseUid = decoded.uid; }
      if (deviceId) user.deviceId = deviceId;
      await user.save();
      return res.json({ token: genToken(user._id), user: { ...user.toObject(), password: undefined }, isNew: false });
    }

    // New user via Google
    user = await User.create({
      email: decoded.email, firebaseUid: decoded.uid, nickname: decoded.name || 'Player',
      ffName: '', ffUid: '', phone: '', referralCode: genRefCode(decoded.name || 'USR'),
      coins: 0, diamonds: 5, deviceId, role: decoded.email === ADMIN_EMAIL ? 'admin' : 'user',
    });
    await Transaction.create({ odUserId: user._id, type: 'signup_bonus', currency: 'diamonds', amount: 5, status: 'completed', details: 'Signup bonus - 5 ⛃' });

    res.json({ token: genToken(user._id), user: { ...user.toObject(), password: undefined }, isNew: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Google login failed' }); }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const link = await admin.auth().generatePasswordResetLink(req.body.email);
    res.json({ success: true, message: 'Reset link generated', link });
  } catch (e) { res.status(400).json({ error: 'Failed to send reset email' }); }
});

// ===== USER ROUTES =====
app.get('/api/users/me', protect, (req, res) => res.json(req.user));

app.put('/api/users/me', protect, async (req, res) => {
  const { ffName, ffUid, nickname } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { ffName, ffUid, nickname }, { new: true }).select('-password');
  res.json(user);
});

app.get('/api/users/all', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

app.post('/api/users/ban/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBanned: true });
  res.json({ success: true });
});

app.post('/api/users/unban/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBanned: false });
  res.json({ success: true });
});

app.put('/api/users/coins/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { coins: req.body.coins });
  res.json({ success: true });
});

app.put('/api/users/diamonds/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { diamonds: req.body.diamonds });
  res.json({ success: true });
});

// ===== TOURNAMENT ROUTES =====
app.get('/api/tournaments', async (req, res) => {
  const tournaments = await Tournament.find().sort({ dateTime: 1 });
  res.json(tournaments);
});

app.post('/api/tournaments', protect, adminOnly, async (req, res) => {
  const t = await Tournament.create(req.body);
  res.json(t);
});

app.put('/api/tournaments/:id', protect, adminOnly, async (req, res) => {
  const t = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(t);
});

app.delete('/api/tournaments/:id', protect, adminOnly, async (req, res) => {
  await Tournament.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.post('/api/tournaments/join/:id', protect, async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });

    const user = req.user;
    if (t.joinedPlayers.includes(user._id.toString())) return res.status(400).json({ error: 'Already joined!' });

    const teamSize = t.mode === 'squad' ? 4 : t.mode === 'duo' ? 2 : 1;
    const totalCost = t.entryFee * teamSize;
    const maxTeams = Math.floor(t.maxPlayers / teamSize);
    if ((t.entries || []).length >= maxTeams) return res.status(400).json({ error: 'Tournament full!' });

    const { teamMembers = [] } = req.body;
    if (t.mode === 'duo' && teamMembers.length !== 1) return res.status(400).json({ error: 'Need 1 teammate for Duo' });
    if (t.mode === 'squad' && teamMembers.length !== 3) return res.status(400).json({ error: 'Need 3 teammates for Squad' });

    const totalBal = (user.diamonds || 0) + user.coins;
    if (totalBal < totalCost) return res.status(400).json({ error: `Need ${totalCost}. Have ${user.diamonds || 0} ⛃ + ${user.coins} 🪙 = ${totalBal}` });

    // Deduct: diamonds first
    let diamondsUsed = Math.min(user.diamonds || 0, totalCost);
    let coinsUsed = totalCost - diamondsUsed;

    user.diamonds -= diamondsUsed;
    user.coins -= coinsUsed;
    user.matchesPlayed += 1;
    user.joinedTournaments.push(t._id.toString());
    await user.save();

    // Build team
    const members = [{ ffName: user.ffName, isOwner: true }];
    teamMembers.forEach(name => members.push({ ffName: name, isOwner: false }));

    t.joinedPlayers.push(user._id.toString());
    t.entries.push({ odUserId: user._id.toString(), ffName: user.ffName, teamMembers: members, joinedAt: new Date() });
    await t.save();

    // Transaction
    let dp = [];
    if (diamondsUsed > 0) dp.push(`${diamondsUsed} ⛃`);
    if (coinsUsed > 0) dp.push(`${coinsUsed} 🪙`);
    const mLabel = teamSize > 1 ? ` [${t.mode.toUpperCase()} ×${teamSize}]` : '';

    await Transaction.create({
      odUserId: user._id, type: 'entry_fee',
      currency: diamondsUsed > 0 && coinsUsed > 0 ? 'mixed' : diamondsUsed > 0 ? 'diamonds' : 'coins',
      amount: totalCost, diamondsUsed, coinsUsed, status: 'completed',
      details: `${t.name}${mLabel} (${dp.join(' + ')})`,
    });

    // Referral reward
    if (user.matchesPlayed >= 2 && user.referredBy) {
      const existing = await Transaction.findOne({ type: 'referral', details: `Referral reward for ${user._id}` });
      if (!existing) {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (referrer) {
          referrer.coins += 10;
          referrer.referralEarnings += 10;
          await referrer.save();
          await Transaction.create({ odUserId: referrer._id, type: 'referral', currency: 'coins', amount: 10, status: 'completed', details: `Referral reward for ${user._id}` });
        }
      }
    }

    res.json({ success: true, diamondsUsed, coinsUsed, totalCost, user: { coins: user.coins, diamonds: user.diamonds } });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

app.put('/api/tournaments/room/:id', protect, adminOnly, async (req, res) => {
  await Tournament.findByIdAndUpdate(req.params.id, { roomId: req.body.roomId, roomPassword: req.body.roomPassword });
  res.json({ success: true });
});

app.post('/api/tournaments/results/:id', protect, adminOnly, async (req, res) => {
  try {
    const { results } = req.body;
    for (const r of results) {
      if (r.reward > 0) {
        await User.findByIdAndUpdate(r.userId, { $inc: { coins: r.reward, wins: r.position <= 3 ? 1 : 0 } });
        await Transaction.create({ odUserId: r.userId, type: 'reward', currency: 'coins', amount: r.reward, status: 'completed', details: `🏆 #${r.position}` });
      }
    }
    await Tournament.findByIdAndUpdate(req.params.id, { results, status: 'completed' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== WALLET ROUTES =====
app.post('/api/wallet/deposit', protect, async (req, res) => {
  const { amount, paymentId } = req.body;
  const user = req.user;
  user.diamonds += amount;
  await user.save();
  await Deposit.create({ odUserId: user._id, amount, paymentId, status: 'completed' });
  await Transaction.create({ odUserId: user._id, type: 'deposit', currency: 'diamonds', amount, status: 'completed', details: `₹${amount} → ${amount} ⛃` });
  res.json({ success: true, diamonds: user.diamonds });
});

app.post('/api/wallet/withdraw', protect, async (req, res) => {
  const { amount, upiId } = req.body;
  if (amount < 10) return res.status(400).json({ error: 'Min ₹10' });
  if (req.user.coins < amount) return res.status(400).json({ error: `Only ${req.user.coins} 🪙 available` });
  req.user.coins -= amount;
  await req.user.save();
  await Withdraw.create({ odUserId: req.user._id, amount, upiId, status: 'pending' });
  await Transaction.create({ odUserId: req.user._id, type: 'withdrawal', currency: 'coins', amount, status: 'pending', details: `Withdraw ${amount} 🪙 → ${upiId}`, upiId });
  res.json({ success: true, coins: req.user.coins });
});

app.get('/api/wallet/transactions', protect, async (req, res) => {
  const tx = await Transaction.find({ odUserId: req.user._id }).sort({ createdAt: -1 });
  res.json(tx);
});

app.get('/api/wallet/deposits', protect, adminOnly, async (req, res) => { res.json(await Deposit.find().sort({ createdAt: -1 })); });
app.get('/api/wallet/withdrawals', protect, adminOnly, async (req, res) => { res.json(await Withdraw.find().sort({ createdAt: -1 })); });

app.post('/api/wallet/approve-deposit/:id', protect, adminOnly, async (req, res) => {
  const d = await Deposit.findById(req.params.id);
  if (!d) return res.status(404).json({ error: 'Not found' });
  d.status = 'completed';
  await d.save();
  await User.findByIdAndUpdate(d.odUserId, { $inc: { diamonds: d.amount } });
  res.json({ success: true });
});

app.post('/api/wallet/reject-deposit/:id', protect, adminOnly, async (req, res) => {
  await Deposit.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.json({ success: true });
});

app.post('/api/wallet/approve-withdrawal/:id', protect, adminOnly, async (req, res) => {
  await Withdraw.findByIdAndUpdate(req.params.id, { status: 'completed' });
  res.json({ success: true });
});

app.post('/api/wallet/reject-withdrawal/:id', protect, adminOnly, async (req, res) => {
  const w = await Withdraw.findById(req.params.id);
  if (!w) return res.status(404).json({ error: 'Not found' });
  w.status = 'rejected';
  await w.save();
  await User.findByIdAndUpdate(w.odUserId, { $inc: { coins: w.amount } });
  res.json({ success: true });
});

// ===== NOTIFICATIONS =====
app.get('/api/notifications', async (req, res) => { res.json(await Notification.find().sort({ createdAt: -1 })); });
app.post('/api/notifications', protect, adminOnly, async (req, res) => { res.json(await Notification.create(req.body)); });

// ===== COMMUNITY =====
app.get('/api/community', async (req, res) => { res.json(await Community.find().sort({ createdAt: -1 })); });
app.post('/api/community', protect, adminOnly, async (req, res) => {
  res.json(await Community.create({ ...req.body, authorId: req.user._id, authorName: req.user.nickname }));
});
app.delete('/api/community/:id', protect, adminOnly, async (req, res) => {
  await Community.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ===== HEALTH CHECK =====
app.get('/', (req, res) => res.json({ status: 'Funturna Backend Running ✅', time: new Date() }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
