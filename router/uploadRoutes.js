const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.post('/images', upload.array('images', 10), (req, res) => {
  const filePaths = req.files.map(file => `/img/${file.filename}`);
  res.json({ images: filePaths });
});

router.post('/avatar', upload.single('imageDescription'), (req, res) => {
  const filePath = `/img/${req.file.filename}`;
  res.json({ imageDescription: filePath });
});

module.exports = router;
