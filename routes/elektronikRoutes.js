const express = require('express');
const router = express.Router();

const elektronikController = require('../controllers/elektronikController');
const { cekApiKey } = require('../middleware/authMiddleware');

// GET semua livestock (dengan filtering, sorting, pagination, projection)
router.get('/', elektronikController.getAll);

// GET livestock berdasarkan ID
router.get('/:id', elektronikController.getById);

// POST livestock baru – dilindungi API Key
router.post('/', cekApiKey, elektronikController.create);

// PUT update livestock – dilindungi API Key
router.put('/:id', cekApiKey, elektronikController.update);

// DELETE livestock – dilindungi API Key
router.delete('/:id', cekApiKey, elektronikController.remove);

// POST tambah riwayat kesehatan (embedded subdocument) – dilindungi API Key
router.post('/:id/riwayat', cekApiKey, elektronikController.addSpesifikasi);

module.exports = router;
