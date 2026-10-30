require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Routes ────────────────────────────────────────────────────────────────────
const livestockRoutes = require('./routes/livestockRoutes');
const kandangRoutes   = require('./routes/kandangRoutes');

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
        topik: 'Peternakan',
        resources: {
            livestock: {
                getAll:   'GET    /livestock',
                getById:  'GET    /livestock/:id',
                create:   'POST   /livestock          [x-api-key required]',
                update:   'PUT    /livestock/:id      [x-api-key required]',
                delete:   'DELETE /livestock/:id      [x-api-key required]',
                riwayat:  'POST   /livestock/:id/riwayat [x-api-key required]'
            },
            kandang: {
                getAll:  'GET    /kandang',
                getById: 'GET    /kandang/:id',
                create:  'POST   /kandang             [x-api-key required]',
                update:  'PUT    /kandang/:id         [x-api-key required]',
                delete:  'DELETE /kandang/:id         [x-api-key required]'
            }
        },
        queryParams: {
            filtering:  'jenis, sehat, minBerat, maxBerat, minUmur, maxUmur, kandang',
            sorting:    'sort=berat (asc) | sort=-berat (desc) | sort=-berat,nama (multi)',
            pagination: 'page=1&limit=10',
            projection: 'fields=nama,jenis,berat'
        }
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/livestock', livestockRoutes);
app.use('/kandang',   kandangRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── MongoDB Connection ────────────────────────────────────────────────────────
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/peternakan';

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
