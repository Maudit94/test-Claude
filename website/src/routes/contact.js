const express = require('express');
const db = require('../db');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Il nome è obbligatorio.' });
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Inserisci un indirizzo email valido.' });
  }
  if (typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Il messaggio non può essere vuoto.' });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'Uno dei campi supera la lunghezza massima consentita.' });
  }

  db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)').run(
    name.trim(),
    email.trim(),
    message.trim()
  );

  res.status(201).json({ ok: true });
});

module.exports = router;
