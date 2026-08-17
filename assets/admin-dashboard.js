import { db, collection, getDocs } from './firebase.js';
import { initAdmin } from './admin-shell.js';
await initAdmin('dashboard');
const [usersSnap,qSnap,aSnap]=await Promise.all([getDocs(collection(db,'users')),getDocs(collection(db,'questions')),getDocs(collection(db,'attempts'))]);
const users=usersSnap.docs.map(d=>d.data());const attempts=aSnap.docs.map(d=>d.data());
document.getElementById('participants').textContent=users.filter(x=>x.role==='peserta').length;
document.getElementById('questions').textContent=qSnap.size;
document.getElementById('finished').textContent=attempts.filter(x=>x.status==='selesai').length;
document.getElementById('active').textContent=attempts.filter(x=>x.status==='berlangsung').length;
