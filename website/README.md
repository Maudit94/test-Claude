# Portfolio con backend

Piccolo sito portfolio con backend Node.js + Express e database SQLite, con un pannello di amministrazione per modificare i contenuti senza toccare il codice.

## Struttura

- `src/server.js` — server Express, serve i file statici e monta le API
- `src/db.js` — inizializzazione database SQLite (`data.sqlite`, creato al primo avvio), seed dei progetti e delle impostazioni
- `src/middleware/auth.js` — protezione con password (Basic Auth) per il pannello admin
- `src/routes/projects.js` — `GET /api/projects`, elenco progetti (pubblico)
- `src/routes/settings.js` — `GET /api/settings`, testi del sito (nome, tagline, bio) (pubblico)
- `src/routes/contact.js` — `POST /api/contact`, valida e salva i messaggi del form di contatto
- `src/routes/admin.js` — API protette per gestire progetti, impostazioni e messaggi
- `public/` — frontend statico del sito, servito da Express
- `admin/index.html` — pannello di amministrazione, protetto da password

## Avvio in locale

Il pannello admin richiede una password impostata tramite variabile d'ambiente `ADMIN_PASSWORD`:

```bash
npm install
ADMIN_PASSWORD=scegli-una-password npm start
```

Il sito sarà disponibile su http://localhost:3000, il pannello admin su http://localhost:3000/admin (utente `admin`, password quella scelta sopra).

Per lo sviluppo con riavvio automatico:

```bash
ADMIN_PASSWORD=scegli-una-password npm run dev
```

## Deploy su Render

Oltre alla configurazione di build/start già in uso, ricordati di impostare la variabile d'ambiente `ADMIN_PASSWORD` nella sezione **Environment** del servizio su Render, altrimenti `/admin` risponderà con un errore.

## Personalizzazione

- **Testi del sito** (nome, frase sotto il nome, "Chi sono") e **progetti**: modificabili direttamente da `/admin`, senza toccare il codice
- Colori e stile: `public/style.css`
- Struttura delle pagine: `public/index.html`
- I messaggi ricevuti dal form di contatto si vedono e si eliminano da `/admin`
