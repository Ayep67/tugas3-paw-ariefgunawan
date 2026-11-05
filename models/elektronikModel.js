const mongoose = require('mongoose');

/**
 * Schema Livestock (Ternak)
 * - Embedding: riwayatKesehatan (array of subdocument)
 * - Referencing: kandang (ObjectId → Kandang collection)
 */
const riwayatKesehatanSchema = new mongoose.Schema(
    {
        tanggal: {
            type: Date,
            required: true,
            default: Date.now
        },
        keterangan: {
            type: String,
            required: true,
            trim: true
        },
        dokterHewan: {
            type: String,
            trim: true
        },
        obat: {
            type: String,
            trim: true
        }
    },
    { _id: true }
);

const livestockSchema = new mongoose.Schema(
    {
        nama: {
            type: String,
            required: [true, 'Nama ternak wajib diisi'],
            trim: true
        },
        jenis: {
            type: String,
            required: [true, 'Jenis ternak wajib diisi'],
            enum: ['sapi', 'kambing', 'ayam', 'babi', 'domba', 'kuda'],
            lowercase: true
        },
        umur: {
            type: Number,
            required: [true, 'Umur ternak wajib diisi'],
            min: [0, 'Umur tidak boleh negatif']
        },
        berat: {
            type: Number,
            required: [true, 'Berat ternak wajib diisi'],
            min: [0, 'Berat tidak boleh negatif']
        },
        sehat: {
            type: Boolean,
            required: [true, 'Status kesehatan wajib diisi'],
            default: true
        },

        // === REFERENCING: hubungan ke koleksi Kandang ===
        kandang: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Kandang',
            default: null
        },

        // === EMBEDDING: riwayat kesehatan tersimpan langsung ===
        riwayatKesehatan: [riwayatKesehatanSchema]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Index untuk mempercepat filtering & sorting
livestockSchema.index({ jenis: 1 });
livestockSchema.index({ sehat: 1 });
livestockSchema.index({ berat: 1 });
livestockSchema.index({ umur: 1 });
livestockSchema.index({ kandang: 1 });

const Livestock = mongoose.model('Livestock', livestockSchema);

module.exports = Livestock;
