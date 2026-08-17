import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import crypto from 'node:crypto';

function credentials() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (parsed.private_key) parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    return parsed;
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin environment variables belum lengkap.');
  }
  return { projectId, clientEmail, privateKey };
}

if (!getApps().length) initializeApp({ credential: cert(credentials()) });
export const adminAuth = getAuth();
export const adminDb = getFirestore();
export { FieldValue };

export function loginEmailFromName(name) {
  const normalized = String(name || '').trim().toLocaleLowerCase('id-ID').replace(/\s+/g, ' ');
  const hash = crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
  return `${hash}@peserta.ujk-batch-3.firebaseapp.com`;
}

export async function bearerUser(request) {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw Object.assign(new Error('Silakan login kembali.'), { status: 401 });
  try { return await adminAuth.verifyIdToken(token); }
  catch { throw Object.assign(new Error('Sesi login tidak valid.'), { status: 401 }); }
}

export async function requireAdmin(request) {
  const decoded = await bearerUser(request);
  if (decoded.role === 'admin') return decoded;
  const snap = await adminDb.doc(`users/${decoded.uid}`).get();
  if (!snap.exists || snap.data().role !== 'admin' || snap.data().active === false) {
    throw Object.assign(new Error('Akses administrator diperlukan.'), { status: 403 });
  }
  return decoded;
}

export async function requireParticipant(request) {
  const decoded = await bearerUser(request);
  const snap = await adminDb.doc(`users/${decoded.uid}`).get();
  const profile = snap.exists ? snap.data() : null;
  if (!profile || profile.role !== 'peserta' || profile.active === false) {
    throw Object.assign(new Error('Akun peserta tidak aktif.'), { status: 403 });
  }
  return { decoded, profile };
}

export function json(data, status=200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}
export function errorResponse(error) {
  console.error(error);
  return json({ error: error?.message || 'Terjadi kesalahan server.' }, error?.status || 500);
}

export async function deleteAnswerDocs(uid) {
  const answers = await adminDb.collection(`attempts/${uid}/answers`).get();
  if (answers.empty) return;
  let batch = adminDb.batch(), count = 0;
  for (const d of answers.docs) {
    batch.delete(d.ref); count++;
    if (count === 450) { await batch.commit(); batch = adminDb.batch(); count = 0; }
  }
  if (count) await batch.commit();
}

export async function deleteAttempt(uid) {
  await deleteAnswerDocs(uid);
  await adminDb.doc(`attempts/${uid}`).delete().catch(() => {});
}
