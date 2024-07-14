const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware để cho phép CORS
app.use(cors());
app.use(express.json());

// Cấu hình multer để lưu trữ ảnh vào thư mục 'public/img'
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

  fs.readFile('db.json', (err, data) => {
    if (err) {
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
        return res.status(500).json({ error: 'Failed to save product to database' });
      }

      res.json(newProduct);
    });
  });
});

// Endpoint để lấy tất cả sản phẩm từ db.json
app.get('/products', (req, res) => {
  fs.readFile('db.json', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read database file' });
    }
    const db = JSON.parse(data);
    res.json(db.products);
  });
});

// Serve static files từ thư mục 'public'
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Serve static files từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
