import { requireRole, bindLogout, adminShellActive, installConfirmModal } from './common.js';

export async function initAdmin(page) {
  adminShellActive(page);
  installConfirmModal();
  bindLogout();
  const session = await requireRole('admin');
  const target = document.querySelector('[data-admin-name]');
  if (target) target.textContent = session.profile.name || session.user.email || 'Administrator';
  return session;
}
