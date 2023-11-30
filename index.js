const express = require('express')
// const db = require('./config/connection')
const bodyParser = require('body-parser')
const app = express()
const multer = require('multer');
const xlsx = require('xlsx');
const port = 3000

const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Examdb2',
    multipleStatements: true
})

module.exports = db

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

//kodinganku
//bab materi
//Tambah Materi
app.post('/topik', (req, res) => {
    const { nama_babmateri } = req.body
    const sql = `INSERT INTO babmateri (id_babmateri, nama_babmateri) VALUES (NULL, '${nama_babmateri}')`
    db.query(sql, (error, result) => {
        // res.redirect('/soal')
        res.send({msg :'Materi berhasil ditambahkan'})
    })
})

//Lihat Materi
app.get('/topik', (req, res) => {
    const sql = `SELECT id_babmateri, nama_babmateri FROM babmateri`
    db.query(sql, (error, result) => {
        //res.render('tambahsoal', { babmateri:result })
        res.send({ babmateri:result })
    })
})

//Hapus Materi
app.delete('/topik/:id_babmateri', (req, res) => {
    const id_babmateri = req.params.id_babmateri
    const sql = `DELETE FROM babmateri WHERE id_babmateri = ${id_babmateri}`
    db.query(sql, (error, result) => {
        // res.redirect('/soal')
        res.send({msg :'Materi berhasil dihapus'})
    })
})

app.put('/topik/:id_babmateri', (req, res) => {
    const id_babmateri = req.params.id_babmateri;
    const { nama_babmateri } = req.body;
    
    const sql = `UPDATE babmateri SET nama_babmateri='${nama_babmateri}' WHERE id_babmateri = ${id_babmateri}`;
    
    db.query(sql, (error, result) => {
        if (error) {
            res.status(500).send({ error: "Gagal mengedit data" });
        } else {
            res.send({ msg: 'Materi berhasil diubah' });
        }
    })
})
//Materi Done : kurang edit

//SOAL

// app.get('/soal/tambah', (req, res) => {
//     const sql = `SELECT id_babmateri, nama_babmateri FROM babmateri`
//     db.query(sql, (error, result) => {
//         //res.render('tambahsoal', { babmateri:result })
//         res.send({ babmateri:result })
//     })
// })

//Tambah soal
app.post('/soal', (req, res) => {
    const { id_babmateri, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan } = req.body
    const sql = `INSERT INTO exam_question (id_exam_questions, id_babmateri, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan) VALUES (NULL, '${id_babmateri}', '${pertanyaan}', '${pilihan_a}', '${pilihan_b}', '${pilihan_c}', '${pilihan_d}', ${pilihan_benar}, ${tingkat_kesulitan})`
    db.query(sql, (error, result) => {
        res.send({msg :'Soal tersimpan'})
    })
})

//Lihat soal
app.get('/soal', (req, res) => {
    const sql1 = `SELECT id_babmateri, nama_babmateri FROM babmateri`
    const sql2 = `SELECT exam_question.id_exam_questions, babmateri.nama_babmateri, exam_question.tingkat_kesulitan FROM exam_question INNER JOIN babmateri ON exam_question.id_babmateri=babmateri.id_babmateri`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
        //    res.render('soal', {babmateri:result1, exam_questions:result2})
           res.send({babmateri:result1, exam_question:result2})
        })
    })
})

//hapus soal
app.delete('/soal/:id_exam_questions', (req, res) => {
    const id_exam_questions = req.params.id_exam_questions
    const sql = `DELETE FROM exam_question WHERE id_exam_questions = ${id_exam_questions}`
    db.query(sql, (error, result) => {
        // res.redirect('/soal')
        res.send({msg :'Materi berhasil dihapus'})
    })
})

// Update Soal berdasarkan id_exam_questions
app.put('/soal/:id_exam_question', (req, res) => {
    const id_exam_question = req.params.id_exam_question;
    const { id_babmateri, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan } = req.body;
    
    const sql = `UPDATE exam_question SET id_babmateri=?, pertanyaan=?, pilihan_a=?, pilihan_b=?, pilihan_c=?, pilihan_d=?, pilihan_benar=?, tingkat_kesulitan=? WHERE id_exam_questions = ?`;
    
    db.query(sql, [id_babmateri, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan, id_exam_question], (error, result) => {
        if (error) {
            res.status(500).send({ error: "Gagal mengedit data" })
        } else {
            res.send({ msg: 'Soal berhasil diubah' })
        }
    })
})

// app.get('/soal/:id', (req, res) => {
//     const id = req.params.id
//     const sql1 = `SELECT id_babmateri, nama_babmateri FROM babmateri`
//     const sql2 = `SELECT exam_questions.id_exam_questions, exam_questions.pertanyaan, exam_questions.pilihan_a, exam_questions.pilihan_b, exam_questions.pilihan_c, exam_questions.pilihan_d, exam_questions.pilihan_benar, exam_questions.id_babmateri, babmateri.nama_babmateri, exam_questions.tingkat_kesulitan FROM exam_questions INNER JOIN babmateri ON exam_questions.id_babmateri=babmateri.id_babmateri WHERE exam_questions.id_exam_questions=${id}`
//     db.query(sql1, (error, result1) => {
//         db.query(sql2, (error, result2) => {
//             res.render('editsoal', {babmateri:result1, exam_questions:result2[0]})
//         })
//     })
// })

// app.post('/soal/ubah/:id', (req, res) => {
//     const id = req.params.id
//     const { pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, id_babmateri, tingkat_kesulitan} = req.body
//     const sql = `UPDATE exam_questions SET pertanyaan='${pertanyaan}', pilihan_a='${pilihan_a}', pilihan_b='${pilihan_b}', pilihan_c='${pilihan_c}', pilihan_d='${pilihan_d}', pilihan_benar='${pilihan_benar}', id_babmateri='${id_babmateri}', tingkat_kesulitan='${tingkat_kesulitan}' WHERE id_exam_questions = ${id}`
//     db.query(sql, (error, result) => {
//         res.redirect('/soal')
//     })
// })

//Soal done

//paket soal (exam)
app.get('/paketsoal', (req, res) => {
    const sql = `SELECT id, id_exam, nama, kode_paket FROM paket_soal`
    db.query(sql, (error, result) => {
        res.render('paketsoal', {paketsoal:result})
    })
})

//konfigurasi
app.post('/konfigurasi/simpan', (req, res) => {
    const { judul_exam, jumlah_soal } = req.body
    const sql1 = `INSERT INTO exam (id_exam, judul_exam, jumlah_soal) VALUES (NULL, '${judul_exam}', ${jumlah_soal})`
    const sql2 = `SELECT id_exam FROM exam ORDER BY id_exam DESC LIMIT 1`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
            res.redirect(`/konfigurasi/${result2[0].id_exam}`)
        })
    })
})

app.get('/konfigurasi/:id', (req, res) => {
    const id = req.params.id
    const sql1 = `SELECT id_exam, judul_exam, jumlah_soal FROM exam WHERE id_exam = ${id}`
    const sql2 = `SELECT id_babmateri, nama_babmateri FROM babmateri`
    const sql3 = `SELECT exam_detail.id_examdetail, babmateri.nama_babmateri, exam_detail.persentase_babmateri, exam_detail.persentase_mudah, exam_detail.persentase_sedang, exam_detail.persentase_sulit FROM exam_detail INNER JOIN babmateri ON exam_detail.id_babmateri=babmateri.id_babmateri WHERE exam_detail.id_exam=${id}`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
            db.query(sql3, (error, result3) => {
                res.render('editkonfigurasi', {exam:result1[0], babmateri:result2, exam_detail:result3})
            })
        })
    })
})
app.post('/konfigurasi/ubah/:id', (req, res) => {
    const id = req.params.id
    const { judul_exam, jumlah_soal } = req.body
    const sql = `UPDATE exam SET judul_exam='${judul_exam}', jumlah_soal=${jumlah_soal} WHERE id_exam = ${id}`
    db.query(sql, (error, result) => {
        res.redirect(`/konfigurasi/${id}`)
    })
})
app.post('/topikujian/simpan', (req,res) => {
    const { id_exam, id_babmateri, persentase_babmateri, persentase_mudah, persentase_sedang, persentase_sulit } = req.body
    if (parseFloat(persentase_mudah) + parseFloat(persentase_sedang) + parseFloat(persentase_sulit) == 1.0) {
        const sql1 = `SELECT EXISTS (SELECT id_examdetail FROM exam_detail WHERE id_exam = ${id_exam} AND id_babmateri = ${id_babmateri}) AS isExists`
        db.query(sql1, (error, result1) => {
            if (result1[0].isExists == 0) {
                const sql2 = `INSERT INTO exam_detail (id_examdetail, id_exam, id_babmateri, persentase_babmateri, persentase_mudah, persentase_sedang, persentase_sulit) VALUES (NULL, ${id_exam}, ${id_babmateri}, ${persentase_babmateri}, ${persentase_mudah}, ${persentase_sedang}, ${persentase_sulit})`
                db.query(sql2, (error, result2) => {})
            }
        })
    }
    res.redirect(`/konfigurasi/${id_exam}`)
})
app.get('/topikujian/hapus/:id', (req, res) => {
    const id = req.params.id
    const sql1 = `SELECT id_exam FROM exam_detail WHERE id_examdetail = ${id}`
    const sql2 = `DELETE FROM exam_detail WHERE id_examdetail = ${id}`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {})
        res.redirect(`/konfigurasi/${result1[0].id_exam}`)
    })
})
app.get('/konfigurasi', (req, res) => {
    const sql = 'SELECT id_exam, judul_exam FROM exam'
    db.query(sql, (error, result) => {
        res.render('konfigurasi', {exam:result})
    })
})
app.get('/paketsoal/:id', (req, res) => {
    const id = req.params.id
    const sql1 = `SELECT id, nama, kode_paket FROM paket_soal WHERE id=${id}`
    const sql2 = `SELECT exam_questions.pertanyaan, exam_questions.pilihan_a, exam_questions.pilihan_b, exam_questions.pilihan_c, exam_questions.pilihan_d FROM preview_exam_questions INNER JOIN exam_questions ON preview_exam_questions.id_exam_questions = exam_questions.id_exam_questions WHERE preview_exam_questions.id_paket_soal = ${id}`
    db.query(sql1, (error, result1) => {
       db.query(sql2, (error, result2) => {
            res.render('detailpaketsoal', {paketsoal:result1[0], exam_questions:result2})
        })
    })
})
// //login
// app.get('/login', (res) => {
//     res.render('login')
// })

//UPLOAD FILE
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/upload-bank-soal', upload.single('bankSoalFile'), async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        const bankSoalSheet = workbook.Sheets[workbook.SheetNames[0]];
        // const bankJawabanSheet = workbook.Sheets[workbook.SheetNames[1]];

        const exam_question = xlsx.utils.sheet_to_json(bankSoalSheet);
        // const dataJawaban = xlsx.utils.sheet_to_json(bankJawabanSheet);

        for (const row of exam_question) {
            const { id_babmateri, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan } = row;

            // Check for undefined values and set them to null
            const id_babmateriValue = id_babmateri || null;
            const pertanyaanValue = pertanyaan || null;
            const pilihan_aValue = pilihan_a || null;
            const pilihan_bValue = pilihan_b || null;
            const pilihan_cValue = pilihan_c || null;
            const pilihan_dValue = pilihan_d || null;
            const pilihan_benarValue = pilihan_benar || null;
            const tingkatKesulitanValue = tingkat_kesulitan || null;

            const sql = `INSERT INTO exam_question (id_babmateri, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [id_babmateriValue, pertanyaanValue, pilihan_aValue, pilihan_bValue, pilihan_cValue, pilihan_dValue, pilihan_benarValue, tingkatKesulitanValue];

            await db.query(sql, values);
        }

        res.send('Bank soal data successfully uploaded and imported into the database.');

        // db.end(); // No need to end the connection here if you plan to reuse it.
    } catch (error) {
        console.error('Error uploading and importing data:', error);
        res.status(500).send('An error occurred while uploading and importing data.');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })