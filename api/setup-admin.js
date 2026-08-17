import { adminAuth, adminDb, FieldValue, json, errorResponse } from '../lib/firebaseAdmin.js';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!process.env.SETUP_SECRET || body.secret !== process.env.SETUP_SECRET) return json({error:'Setup secret tidak sesuai.'},403);
    const existing = await adminDb.collection('users').where('role','==','admin').limit(1).get();
    if (!existing.empty) return json({error:'Administrator sudah pernah dibuat. Halaman setup tidak dapat dipakai lagi.'},409);
    const name=String(body.name||'').trim(),email=String(body.email||'').trim(),password=String(body.password||'');
    if(!name||!email||password.length<6)return json({error:'Nama, email, dan password minimal 6 karakter wajib diisi.'},400);
    const user=await adminAuth.createUser({email,password,displayName:name,disabled:false});
    await adminAuth.setCustomUserClaims(user.uid,{role:'admin'});
    await adminDb.doc(`users/${user.uid}`).set({name,email,role:'admin',active:true,createdAt:FieldValue.serverTimestamp()});
    const settingRef=adminDb.doc('settings/exam');
    if(!(await settingRef.get()).exists){await settingRef.set({title:'Ujian Digital Marketing',durationMinutes:60,instructions:'Baca setiap soal dengan teliti dan pilih satu jawaban yang paling tepat.',status:'nonaktif',updatedAt:FieldValue.serverTimestamp()});}
    return json({ok:true,uid:user.uid});
  } catch(e){return errorResponse(e);}
}
