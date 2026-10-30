const express = require('express');
const router = express.Router();

const kandangController = require('../controllers/kandangController');
const { cekApiKey } = require('../middleware/authMiddleware');

// GET semua kandang
router.get('/', kandangController.getAll);

// GET kandang berdasarkan ID
router.get('/:id', kandangController.getById);

// POST kandang baru – dilindungi API Key
router.post('/', cekApiKey, kandangController.create);

// PUT update kandang – dilindungi API Key
router.put('/:id', cekApiKey, kandangController.update);

// DELETE kandang – dilindungi API Key
router.delete('/:id', cekApiKey, kandangController.remove);

module.exports = router;

