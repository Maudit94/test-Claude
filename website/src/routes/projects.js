const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const projects = db
    .prepare('SELECT id, title, description, link FROM projects ORDER BY position ASC')
    .all();
  res.json(projects);
});

module.exports = router;
