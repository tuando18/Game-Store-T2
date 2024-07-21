const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
  const { userId } = req.query;
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }
    const db = JSON.parse(data);
    const userFavorites = db.favorites.find(fav => fav.userId === userId) || { favorites: [] };
    res.json(userFavorites);
  });
});

router.post('/', (req, res) => {
  const { userId, product } = req.body;

  if (!userId || !product || !product.id) {
    console.error('Invalid data:', req.body);
    return res.status(400).json({ error: 'User ID and product with ID are required' });
  }

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }

    let db;
    try {
      db = JSON.parse(data);
    } catch (parseError) {
      console.error('Failed to parse database file:', parseError);
      return res.status(500).json({ error: 'Failed to parse database file' });
    }

    let userFavorites = db.favorites.find(fav => fav.userId === userId);

    if (userFavorites) {
      const productIndex = userFavorites.favorites.findIndex(fav => fav.id === product.id);
      if (productIndex > -1) {
        userFavorites.favorites.splice(productIndex, 1);
      } else {
        userFavorites.favorites.push(product);
      }
    } else {
      userFavorites = {
        userId,
        favorites: [product]
      };
      db.favorites.push(userFavorites);
    }

    fs.writeFile('db.json', JSON.stringify(db, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Failed to update favorites in database:', writeErr);
        return res.status(500).json({ error: 'Failed to update favorites in database' });
      }
      res.json(userFavorites);
    });
  });
});

module.exports = router;
