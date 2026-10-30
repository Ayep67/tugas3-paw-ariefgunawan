const express = require('express');
const router = express.Router();

const livestockController = require('../controllers/livestockController');
const { cekApiKey } = require('../middleware/authMiddleware');

// GET semua livestock (dengan filtering, sorting, pagination, projection)
router.get('/', livestockController.getAll);

// GET livestock berdasarkan ID
router.get('/:id', livestockController.getById);

// POST livestock baru – dilindungi API Key
router.post('/', cekApiKey, livestockController.create);

// PUT update livestock – dilindungi API Key
router.put('/:id', cekApiKey, livestockController.update);

// DELETE livestock – dilindungi API Key
router.delete('/:id', cekApiKey, livestockController.remove);

// POST tambah riwayat kesehatan (embedded subdocument) – dilindungi API Key
router.post('/:id/riwayat', cekApiKey, livestockController.addRiwayatKesehatan);

module.exports = router;
