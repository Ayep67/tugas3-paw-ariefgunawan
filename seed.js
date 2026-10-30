require('dotenv').config();

const mongoose = require('mongoose');
const Kandang   = require('./models/kandangModel');
const Livestock = require('./models/livestockModel');

// ── Data Kandang ──────────────────────────────────────────────────────────────
const kandangData = [
    {
        namaKandang: 'Kandang A1',
        lokasi: 'Blok Timur',
        kapasitas: 20,
        tipeKandang: 'sapi',
        aktif: true,
        fasilitas: [
            { nama: 'Tempat Makan', kondisi: 'baik' },
            { nama: 'Penampung Air', kondisi: 'baik' },
            { nama: 'Lampu Kandang', kondisi: 'baik' }
        ]
    },
    {
        namaKandang: 'Kandang B2',
        lokasi: 'Blok Barat',
        kapasitas: 50,
        tipeKandang: 'kambing',
        aktif: true,
        fasilitas: [
            { nama: 'Tempat Makan', kondisi: 'baik' },
            { nama: 'Penampung Air', kondisi: 'sedang' }
        ]
    },
    {
        namaKandang: 'Kandang C3',
        lokasi: 'Blok Selatan',
        kapasitas: 200,
        tipeKandang: 'ayam',
        aktif: true,
        fasilitas: [
            { nama: 'Tempat Makan Otomatis', kondisi: 'baik' },
            { nama: 'Penampung Air Otomatis', kondisi: 'baik' },
            { nama: 'Kipas Ventilasi', kondisi: 'sedang' },
            { nama: 'Pemanas Kandang', kondisi: 'rusak' }
        ]
    },
    {
        namaKandang: 'Kandang D4',
        lokasi: 'Blok Utara',
        kapasitas: 15,
        tipeKandang: 'campuran',
        aktif: false,
        fasilitas: [
            { nama: 'Tempat Makan', kondisi: 'rusak' },
            { nama: 'Penampung Air', kondisi: 'rusak' }
        ]
    }
];

// ── Data Livestock ────────────────────────────────────────────────────────────
// kandangRef akan diisi setelah insert kandang
function buildLivestockData(kandangRefs) {
    const [kandangA1, kandangB2, kandangC3] = kandangRefs;

    return [
        // ── Sapi ──────────────────────────────────────────────────────
        {
            nama: 'Sapi Limousin 01',
            jenis: 'sapi',
            umur: 3,
            berat: 450,
            sehat: true,
            kandang: kandangA1._id,
            riwayatKesehatan: [
                {
                    tanggal: new Date('2026-01-15'),
                    keterangan: 'Vaksinasi PMK rutin',
                    dokterHewan: 'drh. Budi Santoso',
                    obat: 'Vaksin PMK-V'
                },
                {
                    tanggal: new Date('2026-06-20'),
                    keterangan: 'Pemeriksaan berkala — kondisi sehat',
                    dokterHewan: 'drh. Budi Santoso',
                    obat: '-'
                }
            ]
        },
        {
            nama: 'Sapi Simental 02',
            jenis: 'sapi',
            umur: 5,
            berat: 620,
            sehat: true,
            kandang: kandangA1._id,
            riwayatKesehatan: [
                {
                    tanggal: new Date('2026-03-10'),
                    keterangan: 'Pengobatan diare ringan',
                    dokterHewan: 'drh. Siti Rahayu',
                    obat: 'Diapet Vet'
                }
            ]
        },
        {
            nama: 'Sapi Brahman 03',
            jenis: 'sapi',
            umur: 2,
            berat: 310,
            sehat: false,
            kandang: kandangA1._id,
            riwayatKesehatan: [
                {
                    tanggal: new Date('2026-09-05'),
                    keterangan: 'Terdeteksi cacingan, sedang dalam pengobatan',
                    dokterHewan: 'drh. Ahmad Fauzi',
                    obat: 'Albendazole 2500mg'
                }
            ]
        },

        // ── Kambing ───────────────────────────────────────────────────
        {
            nama: 'Kambing Etawa 01',
            jenis: 'kambing',
            umur: 2,
            berat: 55,
            sehat: true,
            kandang: kandangB2._id,
            riwayatKesehatan: [
                {
                    tanggal: new Date('2026-02-28'),
                    keterangan: 'Vaksinasi anthrax',
                    dokterHewan: 'drh. Siti Rahayu',
                    obat: 'Anthrax Spore Vaccine'
                }
            ]
        },
        {
            nama: 'Kambing PE 02',
            jenis: 'kambing',
            umur: 1,
            berat: 30,
            sehat: true,
            kandang: kandangB2._id,
            riwayatKesehatan: []
        },
        {
            nama: 'Kambing Boer 03',
            jenis: 'kambing',
            umur: 3,
            berat: 70,
            sehat: false,
            kandang: kandangB2._id,
            riwayatKesehatan: [
                {
                    tanggal: new Date('2026-10-01'),
                    keterangan: 'Luka pada kaki kanan belakang akibat terbentur pagar',
                    dokterHewan: 'drh. Ahmad Fauzi',
                    obat: 'Betadine + Perban steril'
                }
            ]
        },

        // ── Ayam ──────────────────────────────────────────────────────
        {
            nama: 'Ayam Broiler 01',
            jenis: 'ayam',
            umur: 1,
            berat: 2,
            sehat: true,
            kandang: kandangC3._id,
            riwayatKesehatan: []
        },
        {
            nama: 'Ayam Broiler 02',
            jenis: 'ayam',
            umur: 1,
            berat: 1.8,
            sehat: false,
            kandang: kandangC3._id,
            riwayatKesehatan: [
                {
                    tanggal: new Date('2026-10-20'),
                    keterangan: 'Gejala flu burung ringan, isolasi kandang',
                    dokterHewan: 'drh. Budi Santoso',
                    obat: 'Antiviral Poultry'
                }
            ]
        },
        {
            nama: 'Ayam Kampung Super 01',
            jenis: 'ayam',
            umur: 2,
            berat: 1.5,
            sehat: true,
            kandang: kandangC3._id,
            riwayatKesehatan: []
        },

        // ── Domba (tanpa kandang) ─────────────────────────────────────
        {
            nama: 'Domba Merino 01',
            jenis: 'domba',
            umur: 4,
            berat: 80,
            sehat: true,
            kandang: null,
            riwayatKesehatan: [
                {
                    tanggal: new Date('2026-07-17'),
                    keterangan: 'Pencukuran bulu + pemeriksaan kulit',
                    dokterHewan: 'drh. Siti Rahayu',
                    obat: '-'
                }
            ]
        },
        {
            nama: 'Domba Garut 02',
            jenis: 'domba',
            umur: 2,
            berat: 45,
            sehat: true,
            kandang: null,
            riwayatKesehatan: []
        }
    ];
}

// ── Main Seed ─────────────────────────────────────────────────────────────────
async function seed() {
    const DB_URI = process.env.DB_URI || 'mongodb://localhost:27018/';

    try {
        await mongoose.connect(DB_URI);
        console.log(`✅ Terhubung ke MongoDB: ${DB_URI}`);

        // Hapus data lama
        await Kandang.deleteMany({});
        await Livestock.deleteMany({});
        console.log('🗑️  Data lama dihapus');

        // Insert kandang
        const kandangInserted = await Kandang.insertMany(kandangData);
        console.log(`📦 ${kandangInserted.length} data kandang berhasil dimasukkan`);

        // Insert livestock (dengan referensi ke kandang)
        const livestockData = buildLivestockData(kandangInserted);
        const livestockInserted = await Livestock.insertMany(livestockData);
        console.log(`🐄 ${livestockInserted.length} data livestock berhasil dimasukkan`);

        console.log('\n✅ Seeding selesai!');
    } catch (err) {
        console.error('❌ Seeding gagal:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Koneksi MongoDB ditutup');
    }
}

seed();

