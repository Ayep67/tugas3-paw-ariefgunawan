const mongoose = require('mongoose');

/**
 * Schema Kandang (Farm/Pen)
 * Digunakan sebagai referencing dari Livestock
 */
const kandangSchema = new mongoose.Schema(
    {
        namaKandang: {
            type: String,
            required: [true, 'Nama kandang wajib diisi'],
            trim: true
        },
        lokasi: {
            type: String,
            required: [true, 'Lokasi kandang wajib diisi'],
            trim: true
        },
        kapasitas: {
            type: Number,
            required: [true, 'Kapasitas kandang wajib diisi'],
            min: [1, 'Kapasitas minimal 1']
        },
        tipeKandang: {
            type: String,
            enum: ['sapi', 'kambing', 'ayam', 'babi', 'campuran'],
            required: [true, 'Tipe kandang wajib diisi']
        },
        // Embedding: fasilitas tersimpan langsung di dokumen kandang
        fasilitas: [
            {
                nama: { type: String, required: true },
                kondisi: {
                    type: String,
                    enum: ['baik', 'sedang', 'rusak'],
                    default: 'baik'
                }
            }
        ],
        aktif: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Kandang = mongoose.model('Kandang', kandangSchema);

module.exports = Kandang;

