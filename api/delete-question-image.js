import { del } from '@vercel/blob';
import { requireAdmin, json, errorResponse } from '../lib/firebaseAdmin.js';

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const url = String(body.url || '').trim();
    if (!url) return json({ ok: true });
    if (!/^https:\/\/[^/]+\.blob\.vercel-storage\.com\//i.test(url)) {
      return json({ error: 'URL gambar Vercel Blob tidak valid.' }, 400);
    }
    await del(url);
    return json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
