(() => {
  'use strict';
  window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
  document.addEventListener('click', event => {
    const button = event.target.closest('button, .btn');
    if (!button || button.disabled) return;
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${event.clientX - rect.left - size / 2}px`;
    circle.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });
})();
