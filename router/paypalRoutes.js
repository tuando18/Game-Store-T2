const express = require('express');
const paypal = require('paypal-rest-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

paypal.configure({
  mode: 'sandbox',
  client_id: 'AdnsK6zTAwVD5I_Fm0Zz-yyIdkyOi4xvvn9sMKL4YwDEpcmqe6kW7XRTbpLfxRzfZ7GSR3H3mjoLJrKR',
  client_secret: 'ECPgU9rV0kmXYn8SwHk_U715hU5Pt_dJYoqjx3Lc7tL64KCTHhrHCVTG7e_nvCdjVw_KvVNxNJ3qXTHm',
});

const exchangeRate = 0.000043;

const convertVNDToUSD = (amountVND) => (amountVND * exchangeRate).toFixed(2);

router.post('/create-payment', (req, res) => {
  const { amountVND, productId, userId } = req.body;
  if (!amountVND || !productId || !userId) {
    console.error('Missing required fields:', req.body);
    return res.status(400).json({ error: 'amountVND, productId, and userId are required' });
  }

  const amountUSD = convertVNDToUSD(amountVND);
  console.log(`Converted amount: ${amountUSD} USD for ${amountVND} VND`);

  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: `http://${req.hostname}:3000/api/paypal/execute-payment`,
      cancel_url: `http://${req.hostname}:3000`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'Product',
              sku: productId,
              price: amountUSD,
              currency: 'USD',
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: 'USD',
          total: amountUSD,
        },
        description: 'This is the payment description.',
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error('Create payment error:', error.response ? error.response : error);
      return res.status(500).json({ error: 'Something went wrong during payment creation' });
    } else {
      const approvalUrlLink = payment.links.find((link) => link.rel === 'approval_url');
      if (approvalUrlLink) {
        const approval_url = approvalUrlLink.href;
        return res.status(200).json({ approval_url });
      } else {
        console.error('Approval URL not found in PayPal response.');
        return res.status(500).json({ error: 'Approval URL not found in PayPal response' });
      }
    }
  });
});


router.post('/execute-payment', (req, res) => {
  const { PayerID, paymentId, productId, userId } = req.body;

  if (!PayerID || !paymentId || !productId || !userId) {
    console.error('PayerID, paymentId, productId, or userId is missing', req.body);
    return res.status(400).json({ error: 'PayerID, paymentId, productId, and userId are required' });
  }

  console.log(`Executing payment: PayerID=${PayerID}, paymentId=${paymentId}, productId=${productId}, userId=${userId}`);

  paypal.payment.get(paymentId, (error, payment) => {
    if (error) {
      console.error('Get payment error:', error);
      return res.status(500).json({ error: 'Something went wrong while retrieving the payment' });
    }

    const amountUSD = payment.transactions[0].amount.total;
    const execute_payment_json = {
      payer_id: PayerID,
      transactions: [
        {
          amount: {
            currency: 'USD',
            total: amountUSD,
          },
        },
      ],
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) {
        console.error('Execute payment error:', error);
        return res.status(500).json({ error: 'Payment execution failed' });
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

        const productIndex = db.products.findIndex(product => product.id.toString() === productId.toString());

        if (productIndex === -1) {
          console.error('Product not found:', productId);
          return res.status(404).json({ error: 'Product not found' });
        }

        const product = db.products[productIndex];
        console.log('Product found:', product);

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
          paymentMethod: 'paypal', // Set the payment method
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

          console.log('Product moved to payments and removed from products and favorites');
          return res.status(200).json({ message: 'Product moved to payments, removed from products and all favorites' });
        });
      });
    });
  });
});

router.post('/logout', (req, res) => {
  // Logic để hủy thông tin phiên PayPal nếu cần
  res.json({ message: 'PayPal session invalidated' });
});

module.exports = router;
