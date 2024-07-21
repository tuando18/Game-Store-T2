const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }
    const db = JSON.parse(data);
    res.json(db.category);
  });
});

module.exports = router;
