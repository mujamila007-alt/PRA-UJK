import { adminAuth, adminDb, FieldValue, requireAdmin, loginEmailFromName, deleteAttempt, json, errorResponse } from '../lib/firebaseAdmin.js';

export async function POST(request){
  try{
    await requireAdmin(request);const b=await request.json();const action=String(b.action||'');
    if(action==='delete'){
      const uid=String(b.uid||'');if(!uid)return json({error:'UID peserta tidak valid.'},400);
      await deleteAttempt(uid);await adminDb.doc(`users/${uid}`).delete().catch(()=>{});await adminAuth.deleteUser(uid).catch(()=>{});return json({ok:true});
    }
    const name=String(b.name||'').trim(),password=String(b.password||''),active=b.active!==false;
    if(!name)return json({error:'Nama peserta wajib diisi.'},400);if(name.length>100)return json({error:'Nama peserta maksimal 100 karakter.'},400);
    const email=loginEmailFromName(name);
    if(action==='create'){
      if(password.length<6)return json({error:'Password minimal 6 karakter.'},400);
      const same=await adminDb.collection('users').where('loginEmail','==',email).limit(1).get();if(!same.empty)return json({error:'Nama peserta sudah digunakan.'},409);
      const user=await adminAuth.createUser({email,password,displayName:name,disabled:!active});await adminAuth.setCustomUserClaims(user.uid,{role:'peserta'});
      await adminDb.doc(`users/${user.uid}`).set({name,loginEmail:email,role:'peserta',active,createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()});return json({ok:true,uid:user.uid});
    }
    if(action==='update'){
      const uid=String(b.uid||'');if(!uid)return json({error:'UID peserta tidak valid.'},400);
      const duplicate=await adminDb.collection('users').where('loginEmail','==',email).get();if(duplicate.docs.some(d=>d.id!==uid))return json({error:'Nama peserta sudah digunakan.'},409);
      const updates={email,displayName:name,disabled:!active};if(password){if(password.length<6)return json({error:'Password minimal 6 karakter.'},400);updates.password=password;}
      await adminAuth.updateUser(uid,updates);await adminAuth.setCustomUserClaims(uid,{role:'peserta'});await adminDb.doc(`users/${uid}`).set({name,loginEmail:email,role:'peserta',active,updatedAt:FieldValue.serverTimestamp()},{merge:true});return json({ok:true});
    }
    return json({error:'Aksi tidak dikenal.'},400);
  }catch(e){if(e?.code==='auth/email-already-exists')e.message='Nama peserta sudah digunakan.';return errorResponse(e);}
}
