const Elektronik = require('../models/elektronikModel');
const Kategori = require('../models/kategoriModel');

/**
 * Validasi payload untuk create/update livestock
 */
function validateElektronik(body) {
    const { sku, nama, harga, garansi } = body;

    if (!sku || !nama || harga === undefined || !garansi) {
        return 'Semua field wajib diisi (sku, nama, harga, garansi)';
    }

    const jenisValid = ['speaker', 'mic', 'lampu'];
    if (!jenisValid.includes(jenis.toLowerCase())) {
        return `Jenis elektronik tidak valid. Pilih dari: ${jenisValid.join(', ')}`;
    }

    if (typeof harga !== 'number' || harga < 0) {
        return 'Harga harus berupa angka positif';
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
            minHarga,
            nama,
        
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

        if (nama) filter.nama = nama.toLowerCase();

        if (minHarga !== undefined || maxHarga !== undefined) {
            filter.harga = {};
            if (minHarga !== undefined) filter.harga.$gte = Number(minHarga);
            if (maxHarga !== undefined) filter.harga.$lte = Number(maxHarga);
        }

        if (Kategori) filter.Kategori = Kategori;

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
            Elektronik.find(filter, projection)
                .sort(sortObj)
                .skip(skip)
                .limit(limitNum)
                .populate('kategori', 'daya watt warna cerah'),
            Elektronik.countDocuments(filter)
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
        const data = await Elektronik.findById(req.params.id)
            .populate('kategori', 'daya watt warna cerah');

        if (!data) {
            return res.status(404).json({
                status: 'error',
                message: `Data elektronik dengan id ${req.params.id} tidak ditemukan`,
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
        const error = validateElektronik(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error, data: null });
        }

        const data = await Elektronik.create(req.body);

        res.status(201).json({
            status: 'success',
            message: 'Data elektronik berhasil ditambahkan',
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
        const error = validateElektronik(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error, data: null });
        }

        const data = await Elektronik.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('kategori', 'daya watt warna cerah');

        if (!data) {
            return res.status(404).json({
                status: 'error',
                message: `Data elektronik dengan id ${req.params.id} tidak ditemukan`,
                data: null
            });
        }

        res.json({
            status: 'success',
            message: `Data elektronik berhasil diperbarui`,
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
        const data = await Elektronik.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({
                status: 'error',
                message: `Data elektronik dengan id ${req.params.id} tidak ditemukan`,
                data: null
            });
        }

        res.json({
            status: 'success',
            message: `Data elektronik berhasil dihapus`,
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
exports.addSpesifikasi = async (req, res, next) => {
    try {
        const { daya, warna } = req.body;

        if (!daya) {
            return res.status(400).json({
                status: 'error',
                message: 'Field daya wajib diisi',
                data: null
            });
        }

        const elektronik = await Elektronik.findById(req.params.id);
        if (!elektronik) {
            return res.status(404).json({
                status: 'error',
                message: `Data elektronik dengan id ${req.params.id} tidak ditemukan`,
                data: null
            });
        }

        elektronik.spesifikasi.push({ daya, warna });
        await elektronik.save();

        res.status(201).json({
            status: 'success',
            message: 'Riwayat spesifikasi berhasil ditambahkan',
            data: elektronik.spesifikasi
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Format ID tidak valid', data: null });
        }
        next(err);
    }
};
