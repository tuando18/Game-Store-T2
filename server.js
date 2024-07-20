const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Endpoint để upload hình ảnh
app.post('/upload', upload.array('images', 10), (req, res) => {
  const filePaths = req.files.map(file => `/img/${file.filename}`);
  res.json({ images: filePaths });
});

// Endpoint để upload ảnh đại diện
app.post('/uploadAvatar', upload.single('imageDescription'), (req, res) => {
  const filePath = `/img/${req.file.filename}`;
  res.json({ imageDescription: filePath });
});

// Endpoint để lưu sản phẩm vào db.json
app.post('/products', (req, res) => {
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

// Endpoint để lấy tất cả sản phẩm từ db.json
app.get('/products', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }
    const db = JSON.parse(data);
    res.json(db.products);
  });
});

// Endpoint để lấy tất cả danh mục từ db.json
app.get('/category', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }
    const db = JSON.parse(data);
    res.json(db.category);
  });
});

// Endpoint để lấy và cập nhật trạng thái yêu thích
app.get('/favorites', (req, res) => {
  const { userId, productId } = req.query;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }

    const db = JSON.parse(data);
    const userFavorites = db.favorites.filter(fav => fav.userId === userId && fav.productId == productId);
    res.json(userFavorites);
  });
});

app.post('/favorites', (req, res) => {
  const newFavorite = req.body;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }

    const db = JSON.parse(data);
    db.favorites.push(newFavorite);

    fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error('Failed to save favorite to database:', err);
        return res.status(500).json({ error: 'Failed to save favorite to database' });
      }

      res.status(201).json(newFavorite);
    });
  });
});

app.delete('/favorites/:productId', (req, res) => {
  const { userId } = req.query;
  const { productId } = req.params;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }

    const db = JSON.parse(data);
    db.favorites = db.favorites.filter(fav => !(fav.userId === userId && fav.productId == productId));

    fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error('Failed to remove favorite from database:', err);
        return res.status(500).json({ error: 'Failed to remove favorite from database' });
      }

      res.status(200).json({ message: 'Favorite removed' });
    });
  });
});

app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Failed to read database file' });
    }

    const db = JSON.parse(data);
    const productIndex = db.products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      db.products[productIndex] = updatedProduct;

      fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error('Failed to update product in database:', err);
          return res.status(500).json({ error: 'Failed to update product in database' });
        }
        res.status(200).json(updatedProduct);
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  });
});

app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
