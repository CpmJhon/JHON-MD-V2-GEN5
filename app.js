const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Konfigurasi multer untuk upload file
const upload = multer({ dest: 'uploads/' });

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Dummy verifikasi
let isVerified = false;

// Route: Halaman utama
app.get('/', (req, res) => {
    res.render('index', { isVerified });
});

// Route: Halaman upload file
app.get('/upload', (req, res) => {
    res.render('upload');
});

// Route: Proses upload file
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send("Gagal mengunggah file!");
    res.render('download', { filename: req.file.originalname, filepath: req.file.path });
});

// Route: Verifikasi pengguna
app.post('/verify', (req, res) => {
    isVerified = true; // Set sebagai terverifikasi (dummy)
    res.redirect('/');
});

// Route: Unduh file
app.get('/download/:filename', (req, res) => {
    if (!isVerified) {
        return res.redirect('/'); // Redirect jika belum verifikasi
    }
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, err => {
        if (err) res.status(404).send("File tidak ditemukan!");
    });
});

// Jalankan server
app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
      
