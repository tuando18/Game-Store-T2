const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
  const { userId } = req.query;
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }
    const db = JSON.parse(data);
    const userPayments = db.payments.find(payment => payment.userId === userId) || { payments: [] };
    res.json(userPayments);
  });
});

module.exports = router;
