UJK BLK V6 - VERCEL + FIREBASE + VERCEL BLOB
================================================

VERSI INI TIDAK MENGGUNAKAN PHP, MYSQL, ATAU FIREBASE STORAGE.
Frontend: HTML + CSS + JavaScript
Login: Firebase Authentication
Database: Cloud Firestore
Gambar soal: Vercel Blob
Proses aman: Vercel Functions (JavaScript / Node.js)

FITUR YANG TERSEDIA
- Login peserta memakai NAMA + PASSWORD.
- Login administrator memakai EMAIL + PASSWORD.
- Tambah, edit, nonaktifkan, dan hapus peserta.
- Tambah, edit, hapus soal.
- Impor 40 soal PRA UJK.
- Upload gambar soal JPG/PNG/WEBP maksimal 3 MB melalui Vercel Blob.
- Pengaturan judul, instruksi, durasi, status ujian.
- Timer ujian.
- Nilai otomatis 0-100 setelah submit.
- Jumlah benar, salah, dan total soal langsung tampil.
- Admin dapat melihat detail jawaban dan kunci.
- Reset satu peserta atau bersihkan seluruh hasil.

PENTING
Kunci jawaban disimpan pada collection answerKeys dan tidak dapat dibaca peserta.
Pencocokan jawaban dilakukan oleh /api/submit-exam melalui Firebase Admin SDK.
Upload dan penghapusan gambar dilakukan oleh Vercel Function setelah memverifikasi akun admin.
Jangan simpan service-account private key atau BLOB_READ_WRITE_TOKEN di file frontend atau GitHub.

STEP 1 - FIREBASE AUTHENTICATION
1. Buka Firebase Console dan pilih project: ujk-batch-3.
2. Buka Build > Authentication.
3. Klik Get started bila belum aktif.
4. Buka Sign-in method.
5. Aktifkan Email/Password.
6. Simpan.

STEP 2 - BUAT CLOUD FIRESTORE
1. Buka Build > Firestore Database.
2. Klik Create database.
3. Pilih Production mode.
4. Pilih lokasi database yang sesuai.
5. Setelah database aktif, buka tab Rules.
6. Salin seluruh isi file firestore.rules dari project ini.
7. Tempel ke Rules Firebase lalu klik Publish.

Anda TIDAK perlu membuat collection satu per satu.
Collection berikut dibuat otomatis oleh aplikasi:
- users
- settings
- questions
- answerKeys
- attempts
- attempts/{uid}/answers

STEP 3 - BUAT VERCEL BLOB UNTUK GAMBAR SOAL
1. Buka dashboard Vercel.
2. Buka project UJK Anda.
3. Buka tab Storage.
4. Klik Create Database / Create Store.
5. Pilih Blob.
6. Buat Blob Store baru.
7. Pilih akses PUBLIC karena gambar soal harus dapat ditampilkan di browser peserta.
8. Hubungkan Blob Store ke project UJK yang sama.
9. Setelah tersambung, Vercel akan membuat Environment Variable BLOB_READ_WRITE_TOKEN secara otomatis.
10. Jangan menyalin token tersebut ke HTML, assets/firebase-config.js, atau file JavaScript frontend.

Firebase Storage TIDAK perlu diaktifkan.
File storage.rules juga sudah dihapus dari versi ini.

STEP 4 - AMBIL SERVICE ACCOUNT FIREBASE UNTUK VERCEL
1. Firebase Console > Project settings (ikon gear).
2. Buka tab Service accounts.
3. Klik Generate new private key.
4. Simpan file JSON tersebut dengan aman.
5. JANGAN upload JSON tersebut ke hosting publik, GitHub, atau folder assets.

Dari JSON tersebut Anda membutuhkan:
- project_id
- client_email
- private_key

STEP 5 - SET ENVIRONMENT VARIABLES DI VERCEL
Buka Vercel > project Anda > Settings > Environment Variables.
Tambahkan:

FIREBASE_PROJECT_ID
Nilai: ujk-batch-3

FIREBASE_CLIENT_EMAIL
Nilai: ambil dari field client_email pada service-account JSON.

FIREBASE_PRIVATE_KEY
Nilai: ambil seluruh field private_key.
Aplikasi mendukung private key dengan baris asli maupun karakter \\n.

SETUP_SECRET
Nilai: buat kode rahasia sendiri minimal sekitar 20-30 karakter acak.

BLOB_READ_WRITE_TOKEN
Biasanya dibuat otomatis oleh Vercel saat Blob Store dihubungkan ke project.
Jika sudah muncul otomatis, jangan membuat variable kedua dengan nama yang sama.

Alternatif Firebase Admin:
Anda dapat memakai satu variable FIREBASE_SERVICE_ACCOUNT_JSON berisi seluruh JSON service account.
Jika variable ini digunakan, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, dan FIREBASE_PRIVATE_KEY tidak wajib.

STEP 6 - DEPLOY KE VERCEL
1. Upload seluruh isi folder project ini ke repository/project Vercel.
2. Pastikan package.json berada di ROOT project.
3. Framework Preset dapat menggunakan Other.
4. Tidak perlu build command khusus untuk halaman HTML.
5. Deploy atau Redeploy setelah Environment Variables tersimpan.
6. Pastikan Blob Store terhubung ke project yang sama sebelum mengetes upload gambar.

STEP 7 - BUAT ADMIN PERTAMA
Setelah deployment berhasil:
1. Buka https://DOMAIN-ANDA/setup.html
2. Isi nama admin.
3. Isi email admin.
4. Isi password admin minimal 6 karakter.
5. Isi SETUP_SECRET yang sama dengan Vercel.
6. Klik Buat Administrator.
7. Setelah berhasil, buka /admin/
8. Login menggunakan email dan password admin tadi.

Setup admin hanya dapat membuat admin pertama.

STEP 8 - ISI SOAL DAN PESERTA
Di panel admin:
1. Menu Soal.
2. Jika kosong, klik Impor 40 Soal PRA UJK.
3. Untuk soal bergambar, pilih file JPG/PNG/WEBP maksimal 3 MB.
4. Gambar akan dikirim ke /api/upload-question-image dan disimpan di Vercel Blob.
5. URL gambar disimpan pada document questions di Firestore.
6. Menu Peserta > tambah nama peserta + password.
7. Nama peserta harus unik.
8. Menu Pengaturan.
9. Isi durasi.
10. Ubah Status Ujian menjadi Aktif.
11. Simpan.

STEP 9 - TEST PESERTA
1. Buka halaman utama domain.
2. Login dengan NAMA peserta dan PASSWORD dari admin.
3. Klik Mulai Ujian Sekarang.
4. Jawab soal.
5. Klik Selesai & Kirim.
6. Konfirmasi.
7. Peserta kembali ke portal dan nilai langsung tampil.

RUMUS NILAI
Nilai = jumlah benar / total soal x 100
Nilai dibulatkan ke bilangan bulat terdekat.

CONTOH
32 benar dari 40 soal = 80/100.

STRUKTUR FIRESTORE
users/{uid}
  name
  role = admin | peserta
  active
  loginEmail (khusus peserta)

settings/exam
  title
  durationMinutes
  instructions
  status = aktif | nonaktif

questions/{questionId}
  question
  options.A ... options.E
  imageUrl     = URL publik Vercel Blob
  imagePath    = pathname Vercel Blob
  order

answerKeys/{questionId}
  correct = A | B | C | D | E

attempts/{participantUid}
  participantName
  status
  correctCount
  wrongCount
  totalQuestions
  score
  startedAt
  deadlineMs
  finishedAt

attempts/{participantUid}/answers/{questionId}
  order
  question
  selected
  correct
  isCorrect

CATATAN KEAMANAN
- firebaseConfig pada assets/firebase-config.js memang dipakai frontend.
- Service-account private key TIDAK BOLEH dimasukkan ke firebase-config.js.
- BLOB_READ_WRITE_TOKEN TIDAK BOLEH dimasukkan ke frontend.
- Upload gambar hanya diterima oleh server setelah token Firebase admin diverifikasi.
- Firestore Rules wajib dipasang sebelum aplikasi digunakan.
- Tidak ada Firebase Storage pada versi ini.
- Kunci jawaban tidak disertakan di document questions yang dibaca peserta.

FILE PHP
Tidak ada file PHP pada versi ini.
