import { adminDb, FieldValue, requireAdmin, json, errorResponse } from '../lib/firebaseAdmin.js';
const defaultQuestions = [
  {
    "no": 1,
    "pertanyaan": "Suatu usaha untuk mempromosikan sebuah merek dengan menggunakan media digital yang dapat menjangkau konsumen secara tepat waktu, pribadi, dan relevan disebut ….",
    "a": "Email marketing",
    "b": "Social media marketing",
    "c": "Digital marketing",
    "d": "Continuous marketing",
    "e": "Video marketing",
    "jawaban": "C"
  },
  {
    "no": 2,
    "pertanyaan": "Salah satu tujuan iklan online dan offline/tradisional kecuali ...",
    "a": "Menginformasikan konsumen tentang merk merk baru",
    "b": "Mendapat laba yang besar",
    "c": "Membangun kesadaran",
    "d": "Membangun loyalitas konsumen",
    "e": "Menjangkau pelanggan baru",
    "jawaban": "B"
  },
  {
    "no": 3,
    "pertanyaan": "1)  Tidak ada tanggal kadaluwarsa Lead time Biaya Jumlah Dari pernyataan di atas yang merupakan keuntungan iklan online ...",
    "a": "1, 2, 4",
    "b": "1, 2, 3",
    "c": "3, 1, 4",
    "d": "4, 3, 1",
    "e": "2, 4, 3",
    "jawaban": "B"
  },
  {
    "no": 4,
    "pertanyaan": "Dibawah ini yang termasuk kendala-kendala iklan online kecuali ...",
    "a": "Ad Blocker",
    "b": "Cyberspace",
    "c": "Layar",
    "d": "Kecepatan koneksi",
    "e": "Pop up blocker",
    "jawaban": "B"
  },
  {
    "no": 5,
    "pertanyaan": "Jenis iklan ini lebih di tekankan ke penulisan alamat link iklan dan keterangan singkat dari iklan itu sendiri adalah ...",
    "a": "Iklan link",
    "b": "Iklan teks",
    "c": "Iklan baris",
    "d": "Iklan PPC",
    "e": "Iklan banner",
    "jawaban": "A"
  },
  {
    "no": 6,
    "pertanyaan": "Yang termasuk dari iklan teks di bawah ini adalah ...",
    "a": "Iklan hasil pencarian",
    "b": "Iklan PPC",
    "c": "Iklan banner",
    "d": "Iklan baris",
    "e": "Iklan kecik",
    "jawaban": "A"
  },
  {
    "no": 7,
    "pertanyaan": "Sebuah gambar atau animasi yang di tampilkan pada sebuah web untuk tujuan periklanan adalah ...",
    "a": "Wallpapper advertising",
    "b": "Floating advert",
    "c": "Iklan banner",
    "d": "Map advertising",
    "e": "Pop up dan pop under",
    "jawaban": "C"
  },
  {
    "no": 8,
    "pertanyaan": "Yang termasuk iklan display adalah ...",
    "a": "Iklan konten",
    "b": "Iklan daftar lokal",
    "c": "Iklan link",
    "d": "Interstitial banners",
    "e": "Iklan directori online",
    "jawaban": "D"
  },
  {
    "no": 9,
    "pertanyaan": "Iklan yang dapat berinteraksi dengan konsumen dan merupakan gabungan antara video, teks, gambar adalah...",
    "a": "Iklan media sosial",
    "b": "Iklan rich media",
    "c": "Iklan banner",
    "d": "Iklan link",
    "e": "Iklan display",
    "jawaban": "B"
  },
  {
    "no": 10,
    "pertanyaan": "Dibawah ini yang termasuk contoh jaringan afiliasi untuk mempromosikan dan menghasilkan inbound link ke website ...",
    "a": "www.bukalapak.com",
    "b": "www.tokopedia.com",
    "c": "www.freebielist.com",
    "d": "www.tokobagus.com",
    "e": "www.olx.com",
    "jawaban": "C"
  },
  {
    "no": 11,
    "pertanyaan": "Dibawah ini yang termasuk bentuk dan sistem pembayaran iklan online adalah...",
    "a": "Cost premile",
    "b": "Amazon.com",
    "c": "CMP",
    "d": "Pay per click",
    "e": "Selling PPP",
    "jawaban": "D"
  },
  {
    "no": 12,
    "pertanyaan": "Penyebaran, pemebilan, penjualan, pemasaran barang dan jasa melalui sistem elektronik seperti internet atau televisi, WWW, atau jaringan komputer lainnya adalah...",
    "a": "Iklan online",
    "b": "E-Commerce",
    "c": "Afiliasi",
    "d": "Blog",
    "e": "ADS",
    "jawaban": "B"
  },
  {
    "no": 13,
    "pertanyaan": "Jenis relasi dalam dunia bisnis dalam perusahaan kecuali...",
    "a": "Relasi dengan pemasok",
    "b": "Relasi dengan penyalur",
    "c": "Relasi dengan keluarga",
    "d": "Relasi dengan rekanan",
    "e": "Relasi dengan konsumen",
    "jawaban": "C"
  },
  {
    "no": 14,
    "pertanyaan": "Perhatikan pernyataan berikut! Daur hidup produk Situasi ekonomi Penggunaan media online Situasi pasar Situasi lingkungan Dari pernyataan diatas yang termasuk faktor utama yang menyebabkan terjadinya perubahan strategi dalam pemasaran E-Commerce....",
    "a": "1, 2, 4",
    "b": "1, 3, 5",
    "c": "2, 4, 5",
    "d": "3, 4, 5",
    "e": "1, 2, 3",
    "jawaban": "E"
  },
  {
    "no": 15,
    "pertanyaan": "Strategi pemasaran berdasarkan media yang digunakan kecuali...",
    "a": "Search engine",
    "b": "PPC",
    "c": "Penggunaan blog",
    "d": "Promosi di media sosial",
    "e": "Adsence",
    "jawaban": "E"
  },
  {
    "no": 16,
    "pertanyaan": "Usaha perolehan pendapatan antara pengiklan online dengan pedagan dalam penjualan onlineadalah...",
    "a": "Afiliasi pemasaran",
    "b": "Afiliasi",
    "c": "ADS",
    "d": "E-commerce",
    "e": "Iklan online",
    "jawaban": "A"
  },
  {
    "no": 17,
    "pertanyaan": "Salah satu manfaat E-commerce secara umum adalah ....",
    "a": "Buka selama 24 jam",
    "b": "Menurunkan visibilitas melalui SEM",
    "c": "Bisa mendapat laba yang besar",
    "d": "Perluasan jangkauan demografis",
    "e": "Perluasan jangkauan geografis",
    "jawaban": "D"
  },
  {
    "no": 18,
    "pertanyaan": "Melindungi jaringan lokal dari serangan luar adalah fungsi dari...",
    "a": "Web server",
    "b": "Firewall",
    "c": "ADS",
    "d": "Blog",
    "e": "E-commerce",
    "jawaban": "B"
  },
  {
    "no": 19,
    "pertanyaan": "Yang termasuk karakteristik perangkat miobile dan sistem desktop adalah...",
    "a": "Ukuran yang besar",
    "b": "Konektifitas luas",
    "c": "Kuat dan dapat diandalkan",
    "d": "Masa hidup yang panjang",
    "e": "Daya proses yang tidak terbatas",
    "jawaban": "C"
  },
  {
    "no": 20,
    "pertanyaan": "Aplikasi akses internet atau akses internet menggunakan peralatan yang bersifat mobile berbasiskan browser adalah...",
    "a": "Mobile web",
    "b": "Sistem desktop",
    "c": "Website",
    "d": "Blog",
    "e": "Adsence",
    "jawaban": "A"
  },
  {
    "no": 21,
    "pertanyaan": "Salah satu strategi mobile marketing ...",
    "a": "GMS",
    "b": "Web marketing",
    "c": "Bluetooth",
    "d": "MMS",
    "e": "SMS",
    "jawaban": "E"
  },
  {
    "no": 22,
    "pertanyaan": "Cara menghasilkan uang dengan menjual produk dari perusahaan atau lembaga pemilik produk adalah",
    "a": "Social bookmark",
    "b": "Afiliasi",
    "c": "e-commerce",
    "d": "Blog",
    "e": "Afiliasi pemasaran",
    "jawaban": "B"
  },
  {
    "no": 23,
    "pertanyaan": "Beberapa keuntungan afiliasi di bawah ini kecuali ...",
    "a": "Tanpa modal investasi",
    "b": "Tanpa resiko kerugian",
    "c": "Sangat sulit dijalankan",
    "d": "Tidak butuh pengalaman",
    "e": "Tidak menyita waktu",
    "jawaban": "C"
  },
  {
    "no": 24,
    "pertanyaan": "Salah satu cara umum membuat uang melalui pemasaran online ...",
    "a": "Pay per play",
    "b": "Pop up",
    "c": "Pay per action",
    "d": "Pay per click",
    "e": "Pay per download",
    "jawaban": "D"
  },
  {
    "no": 25,
    "pertanyaan": "Kerugian afiliasi di bawah ini kecuali ...",
    "a": "Spamming",
    "b": "Praktik internet ilegal dan tidak etis iklan",
    "c": "Tidak memiliki regulasi pusat",
    "d": "Tidak sesuai dengan standar industri",
    "e": "Memiliki regulasi pusat",
    "jawaban": "E"
  },
  {
    "no": 26,
    "pertanyaan": "Bentuk aplikasi web yang menyerupai tulisan-tulisan pada sebuah halaman web umum adalah ...",
    "a": "Blog",
    "b": "Afiliasi",
    "c": "Ads",
    "d": "E-commerce",
    "e": "Afiliasi pemasaran",
    "jawaban": "A"
  },
  {
    "no": 27,
    "pertanyaan": "Saalah satu penyedia gratis yang dapat di coba adalah ...",
    "a": "Blibli.com",
    "b": "Olx.com",
    "c": "Blogger.com",
    "d": "Tokopedia.com",
    "e": "Tokobagus.com",
    "jawaban": "C"
  },
  {
    "no": 28,
    "pertanyaan": "Riset yang mengambil data yang sudah ada, misalnya dari perpuastakaan dan internet adalah ...",
    "a": "Riset primer",
    "b": "Riset sekunder",
    "c": "Riset tersier",
    "d": "Riset",
    "e": "Riset pasar",
    "jawaban": "B"
  },
  {
    "no": 29,
    "pertanyaan": "Dibawah ini merupakn salah satu kriteria riset pemasaran adalah ...",
    "a": "Relevan",
    "b": "Tidak disiplin",
    "c": "Tidak bertanggungjawab",
    "d": "Tidak efisien",
    "e": "Tidak objektif",
    "jawaban": "A"
  },
  {
    "no": 30,
    "pertanyaan": "Beberapa strategi penetapan harga yang di tetapkan oleh para pemasar, kecuali ...",
    "a": "Menambah hadiah",
    "b": "Menegaskan harga",
    "c": "Diskon",
    "d": "Menurunkan harga serendah-rendahnya",
    "e": "Mempercantik harga",
    "jawaban": "D"
  },
  {
    "no": 31,
    "pertanyaan": "Keuntungan iklan online dibawah ini kecuali....",
    "a": "Lead time",
    "b": "Terdapat tanggal kedaluwarsa",
    "c": "Biaya",
    "d": "Kebebasan",
    "e": "Jangkauan",
    "jawaban": "B"
  },
  {
    "no": 32,
    "pertanyaan": "Program kerjasama periklanan melalui media internet yang diselenggarakan oleh Google adalah...",
    "a": "ADS",
    "b": "Ad blocker",
    "c": "Afiliasi",
    "d": "Ad networks",
    "e": "Adsence",
    "jawaban": "E"
  },
  {
    "no": 33,
    "pertanyaan": "Yang dimaksud dengan Meta data adalah...",
    "a": "Aplikasi untuk membuka iklan pop up",
    "b": "Bagian informasi data tersembunyi dari suatu halaman",
    "c": "Telepon pintar",
    "d": "Aplikasi untuk memblokir iklan",
    "e": "Pelayanan purna jurnal",
    "jawaban": "B"
  },
  {
    "no": 34,
    "pertanyaan": "RRS singkatan dari....",
    "a": "Rich Summary Site",
    "b": "Read Site Summary",
    "c": "Rich Site Summary",
    "d": "Rep Site Summary",
    "e": "Read Summary Site",
    "jawaban": "C"
  },
  {
    "no": 35,
    "pertanyaan": "Iklan yang ditampilkan pada halaman website berupa teks link yang sesuai dengan aturan penyedia iklan konten adalah iklan....",
    "a": "Iklan daftar lokal",
    "b": "Ikllan konten",
    "c": "Iklan display",
    "d": "Iklan link",
    "e": "Iklan teks",
    "jawaban": "B"
  },
  {
    "no": 36,
    "pertanyaan": "WWW singkatan dari...",
    "a": "World Wide Web",
    "b": "Wide Web World",
    "c": "World Web Wide",
    "d": "Wide World Web",
    "e": "Web World Wide",
    "jawaban": "A"
  },
  {
    "no": 37,
    "pertanyaan": "Suatu istilah yang menunjukan kemudahan manusia untuk menggunakan suatu alat tertentu atau objek buatan manusia lainnya untuk mencapai tujuan tertentu adalah ...",
    "a": "User-friendly",
    "b": "Sponsorship",
    "c": "Usability",
    "d": "Meta data",
    "e": "RRS advert",
    "jawaban": "C"
  },
  {
    "no": 38,
    "pertanyaan": "Yang dimaksud dengan Eye-Catchy adalah...",
    "a": "Iklan untuk memblokir iklan",
    "b": "Pelayanan purna jurnal",
    "c": "Mempromosikan produk dalam beberapa permainan",
    "d": "Bagian isi dalam website",
    "e": "Penataan yang enak dipandang dan mudah diingat, menarik perhatian",
    "jawaban": "E"
  },
  {
    "no": 39,
    "pertanyaan": "Iklan yang muncul dilapisan atas konten, tapi tidak dalam jendela terpisah adalah iklan...",
    "a": "Iklan online",
    "b": "Iklan multimedia",
    "c": "Floating advert",
    "d": "Eye-Catchy",
    "e": "Disadvantage",
    "jawaban": "C"
  },
  {
    "no": 40,
    "pertanyaan": "Suatu teknologi web yang dapat anda gunakan untuk menyimpan, mengatur, dan berbagai bookmark dari web atau blog. pernyataan diatas merupakan keterangan dari...",
    "a": "Social bookmark",
    "b": "Bookmark",
    "c": "Blog",
    "d": "Web",
    "e": "Website",
    "jawaban": "A"
  }
];


export async function POST(request){
  try{
    await requireAdmin(request);
    const existing=await adminDb.collection('questions').limit(1).get();
    if(!existing.empty)return json({error:'Impor dibatalkan karena daftar soal sudah berisi data.'},409);
    const batch=adminDb.batch();
    for(const q of defaultQuestions){
      const id=`pra-${String(q.no).padStart(2,'0')}`;
      batch.set(adminDb.doc(`questions/${id}`),{question:q.pertanyaan,options:{A:q.a,B:q.b,C:q.c,D:q.d,E:q.e},imageUrl:null,imagePath:null,order:q.no,updatedAt:FieldValue.serverTimestamp()});
      batch.set(adminDb.doc(`answerKeys/${id}`),{correct:q.jawaban,updatedAt:FieldValue.serverTimestamp()});
    }
    await batch.commit();
    return json({ok:true,count:defaultQuestions.length});
  }catch(e){return errorResponse(e);}
}
