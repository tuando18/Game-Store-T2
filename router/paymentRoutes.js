const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51PdEjqHuPTPg0KlaHz09eO1KtEocplNRCzL990aKak6uCNhizowZItq3DrKrOi3hESCrPt9QE6fOWvklrRzEZ9i800XQH04yDB');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

router.post('/intents', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'vnd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (e) {
    console.error('Error creating payment intent:', e.message);
    res.status(400).json({ error: e.message });
  }
});

router.post('/products/:id/move-to-payments', (req, res) => {
  const productId = req.params.id;
  const { userId, paymentMethod } = req.body;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }

    const db = JSON.parse(data);
    const productIndex = db.products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
      console.error('Product not found:', productId);
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = db.products[productIndex];

    let userPayments = db.payments.find(payment => payment.userId === userId);
    if (!userPayments) {
      userPayments = {
        userId,
        payments: []
      };
      db.payments.push(userPayments);
    }

    userPayments.payments.push({
      ...product,
      paymentMethod: 'stripe', // Include payment method
      paymentId: uuidv4(),
      paymentDate: new Date().toISOString(),
    });

    db.products.splice(productIndex, 1);

    db.favorites.forEach(favorite => {
      favorite.favorites = favorite.favorites.filter(fav => fav.id !== productId);
    });

    fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error('Failed to save database:', err);
        return res.status(500).json({ error: 'Failed to save database' });
      }

      res.json({ message: 'Product moved to payments, removed from products and all favorites' });
    });
  });
});


module.exports = router;
