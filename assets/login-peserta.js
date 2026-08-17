import { auth, db, signInWithEmailAndPassword, signOut, doc, getDoc } from './firebase.js';
import { loginEmailFromName } from './common.js';

const form = document.getElementById('login-form');
const errorBox = document.getElementById('error');
const submit = document.getElementById('submit');
form.addEventListener('submit', async e => {
  e.preventDefault(); errorBox.hidden = true; submit.disabled = true; submit.textContent = 'Memeriksa...';
  try {
    const nama = document.getElementById('nama').value.trim();
    const password = document.getElementById('password').value;
    const email = await loginEmailFromName(nama);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db,'users',cred.user.uid));
    const profile = snap.exists() ? snap.data() : null;
    if (!profile || profile.role !== 'peserta' || profile.active === false) {
      await signOut(auth); throw new Error('Akun peserta tidak aktif atau tidak terdaftar.');
    }
    location.replace('/ujian/');
  } catch (err) {
    errorBox.querySelector('span').textContent = err.message?.includes('Akun peserta') ? err.message : 'Nama atau password tidak sesuai.';
    errorBox.hidden = false;
  } finally { submit.disabled = false; submit.textContent = 'Masuk ke Ujian'; }
});
