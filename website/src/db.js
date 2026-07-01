const path = require('node:path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'data.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    position INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const projectCount = db.prepare('SELECT COUNT(*) AS count FROM projects').get();
if (projectCount.count === 0) {
  const insert = db.prepare(
    'INSERT INTO projects (title, description, link, position) VALUES (?, ?, ?, ?)'
  );
  const seedProjects = [
    ['Progetto Uno', 'Una breve descrizione del primo progetto realizzato.', '#', 1],
    ['Progetto Due', 'Una breve descrizione del secondo progetto realizzato.', '#', 2],
    ['Progetto Tre', 'Una breve descrizione del terzo progetto realizzato.', '#', 3],
  ];
  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(...row);
  });
  insertMany(seedProjects);
}

module.exports = db;
