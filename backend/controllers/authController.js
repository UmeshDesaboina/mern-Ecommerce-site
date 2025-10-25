const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User exists' });
    user = new User({ name, email, password, isAdmin });
    await user.save();
    res.json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ msg: 'Invalid credentials' });
    res.json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();
    // Normally send email, but skipped
    res.json({ msg: 'Reset token generated (check console for token)', token: resetToken });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetToken: hashedToken, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};