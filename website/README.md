# Portfolio con backend

Piccolo sito portfolio con backend Node.js + Express e database SQLite.

## Struttura

- `src/server.js` — server Express, serve i file statici e monta le API
- `src/db.js` — inizializzazione database SQLite (`data.sqlite`, creato al primo avvio) e seed dei progetti
- `src/routes/projects.js` — `GET /api/projects`, restituisce l'elenco progetti salvati nel database
- `src/routes/contact.js` — `POST /api/contact`, valida e salva i messaggi ricevuti dal form di contatto
- `public/` — frontend statico (HTML, CSS, JS) servito direttamente da Express

## Avvio

```bash
npm install
npm start
```

Il sito sarà disponibile su http://localhost:3000.

Per lo sviluppo con riavvio automatico:

```bash
npm run dev
```

## Personalizzazione

- Modifica testi e sezioni in `public/index.html`
- Modifica colori e stile in `public/style.css`
- Aggiungi/modifica progetti direttamente nella tabella `projects` del database, oppure cambia il seed iniziale in `src/db.js`
- I messaggi ricevuti dal form di contatto sono salvati nella tabella `messages` del database
