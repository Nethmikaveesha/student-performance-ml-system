const jwt = require('jsonwebtoken');

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (s && s.length > 0) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
  return 'dev-only-jwt-secret-not-for-production';
}

function signUserToken(userDoc) {
  const payload = {
    sub: userDoc._id.toString(),
    role: userDoc.role,
    email: userDoc.email,
    name: userDoc.name,
  };
  if (userDoc.studentId) payload.studentId = userDoc.studentId;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, getSecret(), { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

module.exports = { signUserToken, verifyToken, getSecret };
