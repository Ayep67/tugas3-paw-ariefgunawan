require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Routes ────────────────────────────────────────────────────────────────────
const elektronikRoutes = require('./routes/elektronikRoutes');
const kategoriRoutes   = require('./routes/kategoriRoutes');

// ── Middleware ────────────────────────────────────────────────────────────────
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use(express.json());
app.use(logger);

// ── Root Info ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        nama: 'Arief Gunawan',
        npm: '2428240087',
        kelas: 'SI5B',
        topik: 'Toko Elektronik',
        resources: {
            livestock: {
                getAll:   'GET    /elektronik',
                getById:  'GET    /elektronik/:id',
                create:   'POST   /elektronik          [x-api-key required]',
                update:   'PUT    /elektronik:id      [x-api-key required]',
                delete:   'DELETE /elektronik:id      [x-api-key required]',
                riwayat:  'POST   /elektronik/:id/riwayat [x-api-key required]'
            },
            kandang: {
                getAll:  'GET    /kategori',
                getById: 'GET    /kategori/:id',
                create:  'POST   /kategori             [x-api-key required]',
                update:  'PUT    /kategori/:id         [x-api-key required]',
                delete:  'DELETE /kategori/:id         [x-api-key required]'
            }
        },
        queryParams: {
            filtering:  'nama, harga, garansi, minHarga, maxHarga, kategori',
            sorting:    'sort=harga (asc) | sort=-harga (desc) | sort=-harga,nama (multi)',
            pagination: 'page=1&limit=10',
            projection: 'fields=nama,nama,harga'
        }
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/elektronik', elektronikRoutes);
app.use('/kategori',   kategoriRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── MongoDB Connection ────────────────────────────────────────────────────────
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/elektronik';

mongoose
    .connect(DB_URI)
    .then(() => {
        console.log(`✅ Terhubung ke MongoDB: ${DB_URI}`);
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Gagal terhubung ke MongoDB:', err.message);
        process.exit(1);
    });

module.exports = app;
