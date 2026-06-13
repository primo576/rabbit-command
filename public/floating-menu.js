

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
    { label: 'regex搜索文本', url: '../regexDomain/searchRegex.html' },
    { label: '找list不同', url: '../regexDomain/findListDifference.html' },
    { label: '剪貼簿', url: '../clipboard_local_storage/index.html' },
    { label: 'url多開', url: '../regexDomain/openUrls.html' },
    { label: 'jenkins-curl', url: '../jenkins-curl/index.html' },
    { label: '轉置文本', url: 'https://lzltool.com/Tools/TextTranspose', blank: true},
    { label: '替換文本', url: 'https://lzltool.com/Tools/TextReplace', blank: true },
    { label: '文本比對1', url: 'https://tonydx.github.io/frontEndDiffHelper/' , blank: true},
    { label: '文本比對2', url: 'https://chizkiyahu.github.io/TextDiff/' , blank: true},
    { label: 'Global DNS Checker', url: 'https://dnsmid.com/' , blank: true},
    { label: 'linux command', url: 'https://wangchujiang.com/linux-command/index.html' , blank: true},
    { label: 'kubectl-commands-documents', url: 'https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands' , blank: true},
    { label: 'html formatter', url: 'https://www.freeformatter.com/html-formatter.html' , blank: true},
    { label: 'cs beautifier', url: 'https://www.freeformatter.com/css-beautifier.html' , blank: true},
    { label: 'js beautifier', url: 'https://www.freeformatter.com/javascript-beautifier.html' , blank: true},
    { label: '截圖', url: 'javascript:capture()' },
    { label: '回到頂部', url: '#' },
    { label: 'cmd+k開啟清單', url: '#' },
  ];

  if (window.createIndexHTML) {
    const indexHtml=document.getElementById('main');
    [...LINKS].forEach((i)=>{
      //<a href="${l.url}" ${l.blank ? 'target="_blank"' : ''}>${l.label}</a>`)
      const ahref = document.createElement('a');
      ahref.href=i.url.replace('../','./');
      ahref.textContent=i.label
      
      ahref.className='object'
      indexHtml.appendChild(ahref)

    })
    return
  }

  const style = document.createElement('style');
  style.innerHTML = `
    .fab-wrap {
      position: fixed;
      bottom: 30px;
      right: 30px;
      /*
      right: 16px;
      bottom: 45px;
      */
      
      z-index: 999999;
      font-family: system-ui, -apple-system;
      background-color: rgba(0, 0, 0, 0);
    }
    .fab-btn {
      transition: all 1s ease;
      /*
      width: 56px;
      height: 56px;
      font-size: 22px;
      */
     font-size: 22px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0);
      color: #fff;
      border: none;
      cursor: pointer;
      opacity: 0.5;
    }
    .fab-btn:hover {
    /*
      background: #2564ebb5;
      
      opacity: 0.9;
       */
      opacity: 1;
    }
    .fab-menu {
      position: absolute;
      right: 0;
      /*
      bottom: 70px;
      */
      bottom: 35px;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 8px;
      min-width: 240px;
      max-height: 60vh;
      display: none;
      /*
      box-shadow: 0 12px 28px rgba(0,0,0,.5);
      */
    }

    .fab-menu input {
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 6px;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid #334155;
      
      font-size: 13px;
    }
    .fab-menu a {
      display: block;
      padding: 6px 8px;
      text-decoration: none;
      border-radius: 6px;
      font-size: 13px;
    }
    .fab-menu a:hover {
      background: #636e82ff;
    }
    .fab-list {
      max-height: 50vh;
      overflow: auto;
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'fab-wrap';

  const btn = document.createElement('div');
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
      if (filter=='') {
        loadGame(list);
        choiceStyle(list,'dark','暗黑模式');
        choiceStyle(list,'blueDark','blue黑模式');
      }
  }
  


  render();


  //
function loadGame(list){
const loadButtom = document.createElement('a');
loadButtom.href='#'
 loadButtom.textContent = '載入老鼠抓貓';
loadButtom.onclick = () => {
    const script = document.createElement('script');
    script.src="../pet/desktop-cat.js";
    document.getElementsByTagName('body')[0].appendChild(script);
    };
list.appendChild(loadButtom);
}
  //

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
///css
function loadCss(url) {
  //<link rel="stylesheet" type="text/css" href="style.css">
    var link = document.createElement('link');
    link.rel="stylesheet"
    link.type = 'text/css';
    link.href = url;
    document.head.appendChild(link);
}
loadCss('../theme/css/dark.css')
loadCss('../theme/css/root.css')
loadCss('../theme/css/blueDark.css')

function setStyle(styleColor){
    //改變並寫入storage
  a=document.body.classList
  a.toggle(styleColor);
  //a.value=styleColor;
  localStorage.setItem('theme', a.value);
}

function initStyle(){
    //初始化樣式
const theme = localStorage.getItem('theme');
if (theme) {
  document.body.classList.add(theme);
}else{
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (isDarkMode) {
  document.body.classList.add('blueDark');
}
}

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

darkModeQuery.addEventListener('change', (event) => {
  if (event.matches) {
    // Switch to dark theme
    setStyle('blueDark')
  } else {
    // Switch to light theme
     document.body.classList.value=''
    // setStyle('blueDark')
  }
});

}

initStyle()

function choiceStyle(list,color,text){
const colorButtom = document.createElement('a');
//colorButtom.href='#'
 colorButtom.textContent = text;
colorButtom.onclick = () => {
    setStyle(color)
    };
list.appendChild(colorButtom);
}
///css

///
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
