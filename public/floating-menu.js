(function () {
  if (window.__FLOATING_MENU__) return;
  window.__FLOATING_MENU__ = true;

  const LINKS = window.FLOATING_MENU_LINKS || [
    { label: 'rabbitCommand', url: '../rabbit-command/index.html' },
    { label: 'lookDNS', url: '../regexDomain/lookDNS.html' },
    { label: 'AB表域名比對', url: '../regexDomain/abTableComparison.html' },
    { label: '文字找Domain', url: '../regexDomain/searchDomain.html' },
    { label: 'cmd+k開啟清單', url: 'javascript:alert()' }
  ];

  const style = document.createElement('style');
  style.innerHTML = `
    .fab-wrap {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 999999;
      font-family: system-ui, -apple-system;
    }
    .fab-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #2563eb;
      color: #fff;
      border: none;
      font-size: 22px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,0,0,.4);
    }
    .fab-menu {
      position: absolute;
      right: 0;
      bottom: 70px;
      background: #020617;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 8px;
      min-width: 240px;
      max-height: 60vh;
      display: none;
      box-shadow: 0 12px 28px rgba(0,0,0,.5);
    }
    .fab-menu input {
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 6px;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid #334155;
      background: #020617;
      color: #e5e7eb;
      font-size: 13px;
    }
    .fab-menu a {
      display: block;
      padding: 6px 8px;
      text-decoration: none;
      color: #e5e7eb;
      border-radius: 6px;
      font-size: 13px;
    }
    .fab-menu a:hover {
      background: #1e293b;
    }
    .fab-list {
      max-height: 50vh;
      overflow: auto;
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'fab-wrap';

  const btn = document.createElement('button');
  btn.className = 'fab-btn';
  btn.textContent = '⚙️';

  const menu = document.createElement('div');
  menu.className = 'fab-menu';

  const input = document.createElement('input');
  input.placeholder = '搜尋連結...';

  const list = document.createElement('div');
  list.className = 'fab-list';

  function render(filter = '') {
    const f = filter.toLowerCase();
    list.innerHTML = LINKS
      .filter(l => l.label.toLowerCase().includes(f))
      .map(l => `<a href="${l.url}" >${l.label}</a>`)
      //target="_blank"
      .join('') || '<div style="padding:6px;color:#94a3b8">找不到連結</div>';
  }

  render();

  input.oninput = () => render(input.value);

  menu.appendChild(input);
  menu.appendChild(list);
  wrap.appendChild(menu);
  wrap.appendChild(btn);
  document.body.appendChild(wrap);

  let hideTimer;

  function show() {
    clearTimeout(hideTimer);
    menu.style.display = 'block';
    input.focus();
  }

  function hide() {
    hideTimer = setTimeout(() => {
      menu.style.display = 'none';
    }, 500);
  }

  document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    menu.style.display = 'block';
    input.focus();
    e.preventDefault();
  }
});


  btn.addEventListener('mouseenter', show);
  btn.addEventListener('mouseleave', hide);
  menu.addEventListener('mouseenter', show);
  menu.addEventListener('mouseleave', hide);
})();
