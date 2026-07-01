const path = require('node:path');
const express = require('express');

const projectsRouter = require('./routes/projects');
const contactRouter = require('./routes/contact');
const settingsRouter = require('./routes/settings');
const adminRouter = require('./routes/admin');
const requireAdminAuth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/admin', requireAdminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});
app.use('/api/admin', requireAdminAuth, adminRouter);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/settings', settingsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
