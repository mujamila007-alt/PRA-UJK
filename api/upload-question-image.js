import { put } from '@vercel/blob';
import { requireAdmin, json, errorResponse } from '../lib/firebaseAdmin.js';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE = 3 * 1024 * 1024;

function safeName(name = 'gambar') {
  return String(name).replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120) || 'gambar';
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const form = await request.formData();
    const file = form.get('file');
    const questionId = String(form.get('questionId') || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100);

    if (!(file instanceof File)) return json({ error: 'File gambar tidak ditemukan.' }, 400);
    if (!questionId) return json({ error: 'ID soal tidak valid.' }, 400);
    if (!ALLOWED.has(file.type)) return json({ error: 'Format gambar harus JPG, PNG, atau WEBP.' }, 400);
    if (file.size > MAX_SIZE) return json({ error: 'Ukuran gambar maksimal 3 MB.' }, 400);

    const blob = await put(`soal/${questionId}/${Date.now()}-${safeName(file.name)}`, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
      cacheControlMaxAge: 3600
    });

    return json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    return errorResponse(error);
  }
}
