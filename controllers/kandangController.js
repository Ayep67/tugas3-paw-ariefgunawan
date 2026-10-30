const Kandang = require('../models/kandangModel');

/**
 * GET /kandang
 * Query params: tipeKandang, aktif, sort, page, limit, fields
 */
exports.getAll = async (req, res, next) => {
    try {
        const {
            tipeKandang,
            aktif,
            sort = '-createdAt',
            page = 1,
            limit = 10,
            fields
        } = req.query;

        const filter = {};
        if (tipeKandang) filter.tipeKandang = tipeKandang.toLowerCase();
        if (aktif !== undefined) filter.aktif = aktif === 'true';

        const sortObj = {};
        sort.split(',').forEach((f) => {
            const t = f.trim();
            sortObj[t.startsWith('-') ? t.slice(1) : t] = t.startsWith('-') ? -1 : 1;
        });

        const pageNum  = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
        const skip     = (pageNum - 1) * limitNum;

        let projection = '';
        if (fields) projection = fields.split(',').join(' ');

        const [data, total] = await Promise.all([
            Kandang.find(filter, projection).sort(sortObj).skip(skip).limit(limitNum),
            Kandang.countDocuments(filter)
        ]);

        res.json({
            status: 'success',
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            },
            data
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /kandang/:id
 */
exports.getById = async (req, res, next) => {
    try {
        const data = await Kandang.findById(req.params.id);
        if (!data) {
            return res.status(404).json({
                status: 'error',
                message: `Kandang dengan id ${req.params.id} tidak ditemukan`,
                data: null
            });
        }
        res.json({ status: 'success', data });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Format ID tidak valid', data: null });
        }
        next(err);
    }
};

/**
 * POST /kandang
 */
exports.create = async (req, res, next) => {
    try {
        const data = await Kandang.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Kandang berhasil ditambahkan',
            data
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message).join(', ');
            return res.status(400).json({ status: 'error', message: messages, data: null });
        }
        next(err);
    }
};

/**
 * PUT /kandang/:id
 */
exports.update = async (req, res, next) => {
    try {
        const data = await Kandang.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!data) {
            return res.status(404).json({
                status: 'error',
                message: `Kandang dengan id ${req.params.id} tidak ditemukan`,
                data: null
            });
        }
        res.json({ status: 'success', message: 'Kandang berhasil diperbarui', data });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Format ID tidak valid', data: null });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message).join(', ');
            return res.status(400).json({ status: 'error', message: messages, data: null });
        }
        next(err);
    }
};

/**
 * DELETE /kandang/:id
 */
exports.remove = async (req, res, next) => {
    try {
        const data = await Kandang.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).json({
                status: 'error',
                message: `Kandang dengan id ${req.params.id} tidak ditemukan`,
                data: null
            });
        }
        res.json({ status: 'success', message: 'Kandang berhasil dihapus', data: null });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Format ID tidak valid', data: null });
        }
        next(err);
    }
};

