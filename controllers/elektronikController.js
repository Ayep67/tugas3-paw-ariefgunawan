const Livestock = require('../models/livestockModel');

/**
 * Validasi payload untuk create/update livestock
 */
function validateLivestock(body) {
    const { nama, jenis, umur, berat, sehat } = body;

    if (!nama || !jenis || umur === undefined || berat === undefined || sehat === undefined) {
        return 'Semua field wajib diisi (nama, jenis, umur, berat, sehat)';
    }

    if (typeof sehat !== 'boolean') {
        return 'Field sehat harus bernilai true atau false';
    }

    const jenisValid = ['sapi', 'kambing', 'ayam', 'babi', 'domba', 'kuda'];
    if (!jenisValid.includes(jenis.toLowerCase())) {
        return `Jenis ternak tidak valid. Pilih dari: ${jenisValid.join(', ')}`;
    }

    if (typeof umur !== 'number' || umur < 0) {
        return 'Umur harus berupa angka positif';
    }

    if (typeof berat !== 'number' || berat < 0) {
        return 'Berat harus berupa angka positif';
    }

    return null;
}

/**
 * GET /livestock
 * Query params:
 *   Filtering  : jenis, sehat, minBerat, maxBerat, minUmur, maxUmur, kandang
 *   Sorting    : sort (contoh: berat, -berat, umur, -umur, nama, -nama)
 *   Pagination : page (default 1), limit (default 10)
 *   Projection : fields (contoh: nama,jenis,berat)
 */
exports.getAll = async (req, res, next) => {
    try {
        const {
            // Filtering
            jenis,
            sehat,
            minBerat,
            maxBerat,
            minUmur,
            maxUmur,
            kandang,

            // Sorting
            sort = '-createdAt',

            // Pagination
            page = 1,
            limit = 10,

            // Projection
            fields
        } = req.query;

        // ── 1. BUILD FILTER ────────────────────────────────────────────
        const filter = {};

        if (jenis) filter.jenis = jenis.toLowerCase();

        if (sehat !== undefined) {
            if (sehat === 'true') filter.sehat = true;
            else if (sehat === 'false') filter.sehat = false;
        }

        if (minBerat !== undefined || maxBerat !== undefined) {
            filter.berat = {};
            if (minBerat !== undefined) filter.berat.$gte = Number(minBerat);
            if (maxBerat !== undefined) filter.berat.$lte = Number(maxBerat);
        }

        if (minUmur !== undefined || maxUmur !== undefined) {
            filter.umur = {};
            if (minUmur !== undefined) filter.umur.$gte = Number(minUmur);
            if (maxUmur !== undefined) filter.umur.$lte = Number(maxUmur);
        }

        if (kandang) filter.kandang = kandang;

        // ── 2. BUILD SORT ──────────────────────────────────────────────
        // Contoh: sort=-berat,nama → { berat: -1, nama: 1 }
        const sortObj = {};
        const sortFields = sort.split(',');
        sortFields.forEach((field) => {
            const trimmed = field.trim();
            if (trimmed.startsWith('-')) {
                sortObj[trimmed.slice(1)] = -1;
            } else {
                sortObj[trimmed] = 1;
            }
        });

        // ── 3. PAGINATION ─────────────────────────────────────────────
        const pageNum  = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
        const skip     = (pageNum - 1) * limitNum;

        // ── 4. PROJECTION ─────────────────────────────────────────────
        // Contoh: fields=nama,jenis,berat → 'nama jenis berat'
        let projection = '';
        if (fields) {
            projection = fields.split(',').join(' ');
        }

        // ── 5. EXECUTE QUERY ──────────────────────────────────────────
        const [data, total] = await Promise.all([
            Livestock.find(filter, projection)
                .sort(sortObj)
                .skip(skip)
                .limit(limitNum)
                .populate('kandang', 'namaKandang lokasi tipeKandang kapasitas'),
            Livestock.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limitNum);

        res.json({
            status: 'success',
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            },
            data
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /livestock/:id
 */
exports.getById = async (req, res, next) => {
    try {
        const data = await Livestock.findById(req.params.id)
            .populate('kandang', 'namaKandang lokasi tipeKandang kapasitas fasilitas');

        if (!data) {
            return res.status(404).json({
                status: 'error',
                message: `Data livestock dengan id ${req.params.id} tidak ditemukan`,
                data: null
            });
        }

        res.json({ status: 'success', data });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                status: 'error',
                message: 'Format ID tidak valid',
                data: null
            });
        }
        next(err);
    }
};

/**
 * POST /livestock
 */
exports.create = async (req, res, next) => {
    try {
        const error = validateLivestock(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error, data: null });
        }

        const data = await Livestock.create(req.body);

        res.status(201).json({
            status: 'success',
            message: 'Data livestock berhasil ditambahkan',
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
 * PUT /livestock/:id
 */
exports.update = async (req, res, next) => {
    try {
        const error = validateLivestock(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error, data: null });
        }

        const data = await Livestock.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('kandang', 'namaKandang lokasi tipeKandang');

        if (!data) {
            return res.status(404).json({
                status: 'error',
                message: `Data livestock dengan id ${req.params.id} tidak ditemukan`,
                data: null
            });
        }

        res.json({
            status: 'success',
            message: `Data livestock berhasil diperbarui`,
            data
        });
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
 * DELETE /livestock/:id
 */
exports.remove = async (req, res, next) => {
    try {
        const data = await Livestock.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({
                status: 'error',
                message: `Data livestock dengan id ${req.params.id} tidak ditemukan`,
                data: null
            });
        }

        res.json({
            status: 'success',
            message: `Data livestock berhasil dihapus`,
            data: null
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Format ID tidak valid', data: null });
        }
        next(err);
    }
};

/**
 * POST /livestock/:id/riwayat
 * Menambah riwayat kesehatan (embedded subdocument)
 */
exports.addRiwayatKesehatan = async (req, res, next) => {
    try {
        const { keterangan, dokterHewan, obat, tanggal } = req.body;

        if (!keterangan) {
            return res.status(400).json({
                status: 'error',
                message: 'Field keterangan wajib diisi',
                data: null
            });
        }

        const livestock = await Livestock.findById(req.params.id);
        if (!livestock) {
            return res.status(404).json({
                status: 'error',
                message: `Data livestock dengan id ${req.params.id} tidak ditemukan`,
                data: null
            });
        }

        livestock.riwayatKesehatan.push({ keterangan, dokterHewan, obat, tanggal });
        await livestock.save();

        res.status(201).json({
            status: 'success',
            message: 'Riwayat kesehatan berhasil ditambahkan',
            data: livestock.riwayatKesehatan
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Format ID tidak valid', data: null });
        }
        next(err);
    }
};
