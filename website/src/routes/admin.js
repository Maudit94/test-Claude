const express = require('express');
const db = require('../db');

const router = express.Router();

function validateProject(body) {
  const { title, description, link } = body ?? {};
  if (typeof title !== 'string' || title.trim().length === 0) {
    return 'Il titolo è obbligatorio.';
  }
  if (typeof description !== 'string' || description.trim().length === 0) {
    return 'La descrizione è obbligatoria.';
  }
  if (link !== undefined && link !== null && typeof link !== 'string') {
    return 'Il link non è valido.';
  }
  if (title.length > 200 || description.length > 2000 || (link && link.length > 500)) {
    return 'Uno dei campi supera la lunghezza massima consentita.';
  }
  return null;
}

router.get('/projects', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY position ASC').all();
  res.json(projects);
});

router.post('/projects', (req, res) => {
  const error = validateProject(req.body);
  if (error) return res.status(400).json({ error });

  const { title, description, link } = req.body;
  const maxPosition = db.prepare('SELECT COALESCE(MAX(position), 0) AS max FROM projects').get().max;
  const result = db
    .prepare('INSERT INTO projects (title, description, link, position) VALUES (?, ?, ?, ?)')
    .run(title.trim(), description.trim(), link ? link.trim() : null, maxPosition + 1);

  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID non valido.' });

  const error = validateProject(req.body);
  if (error) return res.status(400).json({ error });

  const { title, description, link } = req.body;
  const result = db
    .prepare('UPDATE projects SET title = ?, description = ?, link = ? WHERE id = ?')
    .run(title.trim(), description.trim(), link ? link.trim() : null, id);

  if (result.changes === 0) return res.status(404).json({ error: 'Progetto non trovato.' });
  res.json({ ok: true });
});

router.delete('/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID non valido.' });

  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'Progetto non trovato.' });
  res.json({ ok: true });
});

const ALLOWED_SETTINGS = new Set(['site_name', 'tagline', 'bio']);

router.get('/settings', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const settings = {};
  for (const row of rows) settings[row.key] = row.value;
  res.json(settings);
});

router.put('/settings', (req, res) => {
  const updates = req.body ?? {};
  const entries = Object.entries(updates).filter(([key]) => ALLOWED_SETTINGS.has(key));

  if (entries.length === 0) {
    return res.status(400).json({ error: 'Nessuna impostazione valida da aggiornare.' });
  }
  for (const [, value] of entries) {
    if (typeof value !== 'string' || value.length > 5000) {
      return res.status(400).json({ error: 'Uno dei valori non è valido.' });
    }
  }

  const upsert = db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  );
  const runAll = db.transaction((items) => {
    for (const [key, value] of items) upsert.run(key, value.trim());
  });
  runAll(entries);

  res.json({ ok: true });
});

router.get('/messages', (req, res) => {
  const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  res.json(messages);
});

router.delete('/messages/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID non valido.' });

  const result = db.prepare('DELETE FROM messages WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'Messaggio non trovato.' });
  res.json({ ok: true });
});

module.exports = router;
