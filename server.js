// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const productsRouter = require('./router/productRoutes');
const categoriesRouter = require('./router/categoryRoutes');
const favoritesRouter = require('./router/favoriteRoutes');
const uploadsRouter = require('./router/uploadRoutes');
const paymentRouter = require('./router/paymentRoutes');
const paypalRouter = require('./router/paypalRoutes');
const orderRouter = require('./router/orderRoutes');

// Use routes
app.use('/products', productsRouter);
app.use('/category', categoriesRouter);
app.use('/favorites', favoritesRouter);
app.use('/uploads', uploadsRouter);
app.use('/payments', paymentRouter);
app.use('/api/paypal', paypalRouter);
app.use('/orderhistory', orderRouter);
// Import and use error handler middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
