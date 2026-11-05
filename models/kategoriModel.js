const mongoose = require('mongoose');

/**
 * Schema Kandang (Farm/Pen)
 * Digunakan sebagai referencing dari Livestock
 */
const kategoriSchema = new mongoose.Schema(
    {
        audio: {
            type: String,
            required: [true, 'Autdio kandang wajib diisi'],
            trim: true
        },
        mic: {
            type: String,
            required: [true, 'Mic wajib diisi'],
            trim: true
        },
        lampu: {
            type: String,
            required: [true, 'Mic wajib diisi'],
            trim: true
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

const Kategori = mongoose.model('Kategori', kategoriSchema);

module.exports = Kategori;

