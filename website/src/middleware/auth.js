const crypto = require('node:crypto');

function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function requireAdminAuth(req, res, next) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return res.status(500).send('Variabile ADMIN_PASSWORD non configurata sul server.');
  }
  const expectedUser = process.env.ADMIN_USER || 'admin';

  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme !== 'Basic' || !encoded) {
    res.set('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).send('Autenticazione richiesta.');
  }

  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const separatorIndex = decoded.indexOf(':');
  const user = separatorIndex === -1 ? decoded : decoded.slice(0, separatorIndex);
  const password = separatorIndex === -1 ? '' : decoded.slice(separatorIndex + 1);

  const validUser = timingSafeStringEqual(user, expectedUser);
  const validPassword = timingSafeStringEqual(password, expectedPassword);

  if (!validUser || !validPassword) {
    res.set('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).send('Credenziali non valide.');
  }

  next();
}

module.exports = requireAdminAuth;
