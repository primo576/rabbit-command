

(function () {
  if (window.__FLOATING_MENU__) return;
  window.__FLOATING_MENU__ = true;

  const LINKS = window.FLOATING_MENU_LINKS || [
    { label: 'rabbitCommand', url: '../rabbit-command/index.html' },
    { label: 'lookDNS', url: '../regexDomain/lookDNS.html' },
    { label: 'AB表域名比對', url: '../regexDomain/abTableComparison.html' },
    { label: '文字找Domain', url: '../regexDomain/searchDomain.html' },
    { label: 'List 清單刪除 / 保留分行', url: '../regexDomain/listRegex.html' },
    { label: 'nsid過濾工具', url: '../regexDomain/searchnsid.html' },
    { label: 'cfCurlAPI', url: '../regexDomain/cfCurlAPI.html' },
    { label: '文本比對0', url: '../regexDomain/textDifferent.html' },
    { label: '剪貼板', url: '../regexDomain/clipboard_local_storage.html' },
    { label: '轉置文本', url: 'https://lzltool.com/Tools/TextTranspose', blank: true},
    { label: '替換文本', url: 'https://lzltool.com/Tools/TextReplace', blank: true },
    { label: '文本比對1', url: 'https://tonydx.github.io/frontEndDiffHelper/' , blank: true},
    { label: '文本比對2', url: 'https://chizkiyahu.github.io/TextDiff/' , blank: true},
    { label: 'Global DNS Checker', url: 'https://dnsmid.com/' , blank: true},
    { label: 'kubectl-commands-documents', url: 'https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands' , blank: true},
    { label: '截圖', url: 'javascript:capture()' },
    { label: '回到頂部', url: '#' },
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
      transition: all 1s ease;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #ffffff00;
      color: #fff;
      border: none;
      font-size: 22px;
      cursor: pointer;
      opacity: 0.5;
    }
    .fab-btn:hover {
      background: #2564ebb5;
      box-shadow: 0 8px 24px rgba(0,0,0,.4);
      opacity: 0.9;
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
  btn.textContent = '⬆️';
  //⚙️ ⬆️
  btn.onclick = () => {
    window.location.href='#'
  };
  
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
      .map(l => `<a href="${l.url}" ${l.blank ? 'target="_blank"' : ''}>${l.label}</a>`)
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
  ///
  

  
  ///

  document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    menu.style.display = 'block';
    input.focus();
    e.preventDefault();
  }
});

document.addEventListener('click', e => {
  if (!wrap.contains(e.target)) menu.style.display = 'none';
     
});




  btn.addEventListener('mouseenter', show);
  btn.addEventListener('mouseleave', hide);
  menu.addEventListener('mouseenter', show);
  menu.addEventListener('mouseleave', hide);

(() => {
  const link = document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/x-icon'
  link.href = '../public/images/favicon.ico'

  // 如果已經有 favicon，先移除避免重複
  const old = document.querySelector("link[rel~='icon']")
  if (old) old.remove()

  document.head.appendChild(link)
})()

function loadScript(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.head.appendChild(script);
}
loadScript('../public/js/html2canvas@1.4.1.js');


})();


 
     function capture() {
        tardiv= document.getElementsByClassName('fab-wrap')[0]
        tardiv.setAttribute('style', 'display: none;');
  html2canvas(document.body).then(canvas => {
    const link = document.createElement('a');
    link.download = 'screenshot_'+gettime()+'.png';
    link.href = canvas.toDataURL();
    link.click();
    tardiv.removeAttribute('style')
  });

  function gettime(){
    a=new Date();
    b=a.getMonth()+1 +''+a.getDate()+ a.getHours()+ a.getMinutes()+ a.getSeconds()
    return b
  }
}
