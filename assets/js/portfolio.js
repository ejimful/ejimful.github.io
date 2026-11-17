const themeButton = document.querySelector('.theme-toggle');
function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  document.querySelector('meta[name="theme-color"]').content = dark ? '#171a1e' : '#faf9f6';
}
syncThemeButton();
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('iris-theme', theme); } catch(e) {}
  syncThemeButton();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  try { if (localStorage.getItem('iris-theme')) return; } catch(e) {}
  document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
  syncThemeButton();
});
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
function updateNavigation() {
  const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 240);
  let current = sections[0];
  for (const section of sections) if (section.offsetTop <= marker) current = section;
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) current = sections[sections.length - 1];
  for (const link of navLinks) {
    const active = link.hash === '#' + current.id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
window.addEventListener('scroll', updateNavigation, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
document.querySelectorAll('.project-open').forEach(button => {
  const dialog = document.getElementById(button.dataset.dialog);
  button.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => button.focus({ preventScroll: true }));
});
