import { auth, db, onAuthStateChanged, signOut, doc, getDoc } from './firebase.js';

export function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

export function formatDate(value) {
  if (!value) return '-';
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle:'medium', timeStyle:'short' }).format(date);
}

export function showToast(message, type='ok') {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

export async function loginEmailFromName(name) {
  const normalized = String(name).trim().toLocaleLowerCase('id-ID').replace(/\s+/g, ' ');
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex}@peserta.ujk-batch-3.firebaseapp.com`;
}

export async function api(path, payload={}) {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      ...(token ? {Authorization:`Bearer ${token}`} : {})
    },
    body: JSON.stringify(payload)
  });
  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) throw new Error(data.error || `Permintaan gagal (${response.status}).`);
  return data;
}

export async function getProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? {id:snap.id, ...snap.data()} : null;
}

export function waitForAuth() {
  return new Promise(resolve => {
    const off = onAuthStateChanged(auth, user => { off(); resolve(user); });
  });
}

export async function requireRole(role) {
  const user = await waitForAuth();
  if (!user) {
    location.replace(role === 'admin' ? '/admin/' : '/');
    throw new Error('AUTH_REDIRECT');
  }
  const profile = await getProfile(user.uid);
  if (!profile || profile.role !== role || profile.active === false) {
    await signOut(auth);
    location.replace(role === 'admin' ? '/admin/' : '/');
    throw new Error('ROLE_REDIRECT');
  }
  return { user, profile };
}

export function bindLogout(selector='[data-logout]') {
  document.querySelector(selector)?.addEventListener('click', async event => {
    event.preventDefault();
    await signOut(auth);
    location.replace('/');
  });
}

export function adminShellActive(page) {
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === page));
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  menuButton?.addEventListener('click', () => menu?.classList.toggle('open'));
}

export function installConfirmModal() {
  if (document.getElementById('global-confirm')) return;
  const modal = document.createElement('div');
  modal.id = 'global-confirm';
  modal.className = 'modal-layer';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true"><div class="modal-icon danger">!</div><h3 id="confirm-title">Konfirmasi</h3><p id="confirm-message"></p><div class="modal-actions"><button class="btn btn-ghost" data-no>Batal</button><button class="btn btn-danger" data-yes>Ya, lanjutkan</button></div></div>`;
  document.body.appendChild(modal);
  let resolveFn = null;
  const finish = value => { modal.classList.remove('show'); resolveFn?.(value); resolveFn = null; };
  modal.querySelector('[data-no]').onclick = () => finish(false);
  modal.querySelector('[data-yes]').onclick = () => finish(true);
  modal.addEventListener('click', e => { if (e.target === modal) finish(false); });
  window.confirmAction = (message, title='Konfirmasi', yes='Ya, lanjutkan') => new Promise(resolve => {
    resolveFn = resolve;
    modal.querySelector('#confirm-title').textContent = title;
    modal.querySelector('#confirm-message').textContent = message;
    modal.querySelector('[data-yes]').textContent = yes;
    modal.classList.add('show');
  });
}
