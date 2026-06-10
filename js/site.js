(function(){
  const menu = document.querySelector('.site-menu');
  const toggle = document.querySelector('.site-menu-toggle');
  const dropdownItems = Array.from(document.querySelectorAll('.site-has-dropdown'));
  const desktopQuery = window.matchMedia('(min-width: 1061px)');

  window.dataLayer = window.dataLayer || [];

  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function closeSubmenus(except){
    dropdownItems.forEach((item) => {
      if(item === except) return;
      item.classList.remove('is-open');
      const btn = item.querySelector('button');
      if(btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function closeMenu(){
    if(menu) menu.classList.remove('is-open');
    document.body.classList.remove('menu-lock');
    if(toggle) toggle.setAttribute('aria-expanded', 'false');
    closeSubmenus();
  }

  if(toggle && menu){
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-lock', open);
      if(!open) closeSubmenus();
    });
  }

  dropdownItems.forEach((item) => {
    const btn = item.querySelector('button');
    if(!btn) return;
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const willOpen = !item.classList.contains('is-open');
      closeSubmenus(item);
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });
  });

  document.addEventListener('click', (event) => {
    const header = document.querySelector('.site-header');
    if(header && header.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape') closeMenu();
  });

  if(desktopQuery.addEventListener){
    desktopQuery.addEventListener('change', () => closeMenu());
  }

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-menu a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if(href === current) link.classList.add('active');
  });

  document.addEventListener('click', (event) => {
    const a = event.target.closest('a');
    if(!a) return;
    const href = a.href || a.getAttribute('href') || '';
    const label = a.dataset.track || a.textContent.trim().slice(0, 90);
    const payload = { click_label: label, click_url: href, page_path: location.pathname };
    if(href.includes('wa.me') || href.includes('api.whatsapp')){
      window.dataLayer.push({ event: 'click_whatsapp', ...payload });
      if(typeof window.gtag === 'function') window.gtag('event', 'click_whatsapp', { event_category: 'lead', event_label: label });
    } else {
      window.dataLayer.push({ event: 'click_link', ...payload });
    }
    if(window.innerWidth <= 1060 && a.closest('.site-menu')) closeMenu();
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('form');
    if(!form) return;
    const name = form.getAttribute('name') || form.id || 'lead_form';
    window.dataLayer.push({ event: 'submit_lead_form', form_name: name, page_path: location.pathname });
    if(typeof window.gtag === 'function') window.gtag('event', 'submit_lead_form', { event_category: 'lead', event_label: name });
  });
})();
