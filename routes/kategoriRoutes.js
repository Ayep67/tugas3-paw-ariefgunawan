const express = require('express');
const router = express.Router();

const kategoriController = require('../controllers/kategoriController');
const { cekApiKey } = require('../middleware/authMiddleware');

// GET semua kandang
router.get('/', kategoriController.getAll);

// GET kandang berdasarkan ID
router.get('/:id', kategoriController.getById);

// POST kandang baru – dilindungi API Key
router.post('/', cekApiKey, kategoriController.create);

// PUT update kandang – dilindungi API Key
router.put('/:id', cekApiKey, kategoriController.update);

// DELETE kandang – dilindungi API Key
router.delete('/:id', cekApiKey, kategoriController.remove);

module.exports = router;

