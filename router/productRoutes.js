const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/', (req, res) => {
  const productData = req.body;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }

    const db = JSON.parse(data);
    const newProduct = {
      id: uuidv4(),
      ...productData
    };

    db.products.push(newProduct);

    fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error('Failed to save product to database:', err);
        return res.status(500).json({ error: 'Failed to save product to database' });
      }

      res.json(newProduct);
    });
  });
});

router.get('/', (req, res) => {
  const { category } = req.query;
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }
    const db = JSON.parse(data);
    const filteredProducts = db.products.filter(product => product.category === parseInt(category));
    res.json(filteredProducts);
  });
});

module.exports = router;
