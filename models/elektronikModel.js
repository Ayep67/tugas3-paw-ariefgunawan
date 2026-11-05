const mongoose = require('mongoose');

/**
 * Schema Livestock (Ternak)
 * - Embedding: riwayatKesehatan (array of subdocument)
 * - Referencing: kandang (ObjectId → Kandang collection)
 */
const spesifikasiSchema = new mongoose.Schema(
    {
        daya: {
            type: String,
            trim: true
        },
        warna:{
            type: String,
            trim: true
        }
    },
    { _id: true }
);

const elektronikSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: [true, 'sku wajib diisi'],
            trim: true
        },
        nama: {
            type: String,
            required: [true, 'Nama wajib diisi'],
            enum: ['speaker', 'mic', 'lampu'],
            lowercase: true
        },
        harga: {
            type: Number,
            required: [true, 'Harga wajib diisi'],
            min: [0, 'harga tidak boleh negatif']
        },
        garansi: {
            type: String,
            required: [true, 'Garansi wajib diisi'],
            enum: ['tanpa', 'toko', 'resmi'],
            trim: true
        },

        // === REFERENCING: hubungan ke koleksi Kandang ===
        kategori: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Kategori',
            default: null
        },

        // === EMBEDDING: riwayat kesehatan tersimpan langsung ===
        spesifikasiSchema: [spesifikasiSchema]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Index untuk mempercepat filtering & sorting
elektronikSchema.index({ nama: 1 });
elektronikSchema.index({ harga: 1 });
elektronikSchema.index({ garansi: 1 });

const Elektronik = mongoose.model('Elektronik', elektronikSchema);

module.exports = Elektronik;
