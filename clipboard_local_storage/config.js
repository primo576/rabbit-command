const input = document.getElementById('input');
const list = document.getElementById('list');
const bars = document.getElementById('bars');
const usage = document.getElementById('usage');


function auto_grow(el) {
   el.classList.add('fixArea')
}

function applyToAllTextareasRm() {
   const list = document.getElementsByTagName('textarea');
   for (let i = 1; i < list.length; i++) {
      const el = list[i];
      el.classList.remove('fixArea')
   }
   data.forEach((item) => {

      keys = Object.keys(item)

      keys.forEach((key) => {
         if (item[key] === true) {
            item[key] = false
            //console.log(item[key])
         }
      })

   })
   save();
   render();
}

function applyToAllTextareasSet() {
   const list = document.getElementsByTagName('textarea');
   for (let i = 1; i < list.length; i++) {
      const el = list[i];
      auto_grow(el);
   }
   data.forEach((item) => {
      item.expanded = true;
   })
   save();
}

function testIMGlink(link) {
   imgTag = document.getElementById('imgTest');

   if (link) {
      imgTag.src = link
   } else {
      imgTag.removeAttribute('src');
   }
}

const pasteButton = document.getElementById('paste-btn');


pasteButton.addEventListener('pointerdown', async () => {
   try {
      const text = await navigator.clipboard.readText();
      input.value = text;
      mainaction();
   } catch (err) {}
});
//selectCheckBoxData

let selectCheckBoxData = JSON.parse(localStorage.getItem('selectCheckBoxData')) || [];

function save_selectCheckBoxData() {
   localStorage.setItem('selectCheckBoxData', JSON.stringify(selectCheckBoxData));
}

function clearAllSelect(ask) {
   if (selectCheckBoxData.length > 0) {
      if (ask) {
         if (!confirm('確定要清空所有選取紀錄？')) return;
      }

      setTimeout(() => {
         titleChangeUse('清空選取紀錄')
      }, 1000);

      localStorage.removeItem('selectCheckBoxData');
      selectCheckBoxData = []
      render();
   }
}


//selectCheckBoxData

////data處理區

let data = JSON.parse(localStorage.getItem('clipboardData')) || [];


function save() {
   if (!canSaveDate) {
      titleChangeUse('暫時不能儲存資料');
      return
   }
   localStorage.setItem('clipboardData', JSON.stringify(data));
}

function getSize(obj) {
   return new Blob([JSON.stringify(obj)]).size;
}

function renderUsage() {
   const total = getSize(data);

   const max = 5 * 1024 * 1024;
   const percent = (total / max) * 100;
   const percentage = (total / 1024 / 5120 * 100).toFixed(1)

   if (percentage > 95) {
      usage.innerHTML = `
             <div style="background:#ddd;width:100%;">
               <div class="progress" style="width:${percent}%"></div>
             </div>空間用量 
             ${(total/1024).toFixed(1)}KB / 5120KB
           `;
   }

   //console.log(`當前使用量：${percentage}% | 詳細：${(total/1024).toFixed(1)}KB / 5120KB`)
}

function renderBars() {
   bars.innerHTML = '';

   const maxSize = Math.max(...data.map(getSize));
   const ol = document.createElement('ol');
   ol.className = "col2";

   data.forEach((item, index) => {
      const size = getSize(item);
      const percent = (size / maxSize) * 100;
      const li = document.createElement('li');
      li.className = 'bar';

      // 🔥 背景比例條
      li.style.background = `linear-gradient(to right, #4caf50 ${percent}%, #577d92 ${percent}%)`;
      itemTitle = ' - '
      // 👉 文字完整顯示
      if (item.title) {
         itemTitle += item.title.slice(0, 30)
      } else {
         itemTitle = ''
      }
      li.textContent = `${new Date(item.time).toLocaleString()}${itemTitle} - ${item.text.slice(0, 15)} (${(size/1024).toFixed(1)}KB)`;

      li.onclick = () => {
         document.getElementById(`item-${index}`)
            .scrollIntoView({
               behavior: 'smooth'
            });
      };

      ol.appendChild(li);
   });

   bars.appendChild(ol);
}
//


searchBars.addEventListener('input', (e) => {
   renderBarsV2(searchBars.value)
});

searchEmoji.addEventListener('change', (e) => {
   renderBarsV2(searchEmoji.value)

   if (displayEmojiAnswer.checked) {
      render();
   }

});


//遍歷物件加入item現有的表情
//
displayEmojiAnswer.addEventListener('change', (e) => {


   render();


});
//

//選取預設分割符號
delimInput.addEventListener('click', (e) => {


   delimInput.value = ''


});

delimInput.addEventListener('change', (e) => {


   function delimInputChange(v) {
      if (v == '' || v == 'default') {
         delimiterInput.value = ''
         joinStr.value = ''
      } else {
         v = v.split('&&')
         delimiterInput.value = v[0] || ''
         joinStr.value = v[1] || ''
      }
   }

   delimInputChange(delimInput.value);


});

const STORAGE_KEY = 'delim-history';


function init() {

   const history =
      JSON.parse(
         localStorage.getItem(
            STORAGE_KEY
         ) || `["default",",&&\\\\n"]`
      );

   history.forEach(addOption);

}
init();

delimInput.onchange = () => {

   saveHistory(
      delimInput.value
   );

}

function deletehistory() {
   if (!confirm('確定要清空所有暫存切割變數嗎？')) return;
   localStorage.removeItem(STORAGE_KEY)
   saveHistory('default');
}

function saveHistory(value) {

   if (!value.trim()) return;

   const history =
      JSON.parse(
         localStorage.getItem(
            STORAGE_KEY
         ) || `["default",",&&\\\\n"]`
      );


   /*
   去重
   */

   const set = new Set(history);

   set.add(value);

   const arr = [...set];

   localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(arr)
   );

   refreshDataList(arr);

}

function refreshDataList(arr) {

   delimList.innerHTML = '';

   arr.forEach(addOption);

}

function addOption(value) {

   const option =
      document.createElement(
         'option'
      );

   option.value = value;

   delimList.append(option);

}

//選取預設分割符號

function searchEmojiSelect() {
   if (displayEmojiAnswer.checked) {
      titleChangeUse('勾選過濾下不更新表情列表');
      return
   }
   existEmoji = new Set()
   data.forEach((item, index) => {
      if (item.emoji) {
         existEmoji.add(item.emoji)
      }
   })
   searchEmoji.innerHTML = ''

   function addOption(str) {
      const option = document.createElement('option');
      option.textContent = str
      option.value = str
      searchEmoji.appendChild(option)
   }
   existEmoji.forEach((item) => addOption(item))

}


function renderBarsV2(filter = '') {
   if (filter == '') {
      renderBars();
      return
   }

   bars.innerHTML = '';
   const ol = document.createElement('ol');
   ol.className = "col2";
   const maxSize = Math.max(...data.map(getSize));
   const f = filter.toLowerCase();
   //
   //console.log(data)
   //
   d = data.filter(l =>
         (l.text && l.text.toLowerCase().includes(f.toLowerCase())) ||
         (l.emoji && l.emoji.includes(f)) ||
         (l.title && l.title.toLowerCase().includes(f.toLowerCase()))
      )
      .map((item) => {
         const size = getSize(item);
         const percent = (size / maxSize) * 100;
         const li = document.createElement('div');
         li.className = 'bar';

         // 🔥 背景比例條
         li.style.background = `linear-gradient(to right, #4caf50 ${percent}%, #577d92 ${percent}%)`;
         itemTitle = ''
         itemEmoji = ''
         // 👉 文字完整顯示
         if (item.title) {
            itemTitle += `${item.title.slice(0,30)} - `
         } else {
            itemTitle = ''
         }
         if (item.emoji) {
            itemEmoji += `${item.emoji} - `
         } else {
            itemEmoji = ''
         }
         li.textContent = ` ${item.index}.${itemEmoji} ${itemTitle}${item.text.slice(0, 15)} - ${new Date(item.time).toLocaleString()} (${(size/1024).toFixed(1)}KB)`;

         li.onclick = () => {

            t = item.index - 1
            if (t < 0) {
               t++
            }
            console.log(`item-${t}`)
            document.getElementById(`item-${t}`)
               .scrollIntoView({
                  behavior: 'smooth'
               });
         };

         ol.appendChild(li);
      })

   bars.appendChild(ol);
}

function parseDelimiter(str) {
   if (!str) return '\n'; // 預設

   return str
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');
}

function parseJoinDelimiter(str) {
   if (!str) return ','; // 預設

   return str
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');
}
//checkbox取值
//data-0-0取值 <input type="checkbox" id="ckbox-8-0" value="data-8-0">
function getDataInner(ckboxIdValue) {
   const rawDelimiter = document.getElementById('delimiterInput').value;
   const delimiter = parseDelimiter(rawDelimiter);
   a = ckboxIdValue.value.split('-')
   return data[a[1]]['text'].split(delimiter)[a[2]]
}

function getAllckboxText() {
   texts = []
   boxs = document.getElementsByClassName('ckboxCodeTarget');
   [...boxs].forEach(dataNum => {
      if (dataNum.checked) {
         texts.push(getDataInner(dataNum))
      }
   })
   return texts
}

function sendToinput() {
   s = getAllckboxText();
   s = s.join('\n')
   input.value = s
   auto_grow(input)
}
//checkbox取值


function render() {
   oclass = ['setMenuol']

   data.forEach((item, index) => {
      item.index = index;
   });

   const rawDelimiter = document.getElementById('delimiterInput').value;
   const delimiter = parseDelimiter(rawDelimiter);

   list.innerHTML = '';
   //////
   function createBtnClickFun(BtnText, clickFun, title, style) {
      const lineBtn = document.createElement('button');
      lineBtn.textContent = BtnText;
      if (style) {
         lineBtn.style = style
      }
      if (title) {
         lineBtn.title = title
      }
      lineBtn.className = 'buttomStyle1'


      lineBtn.onclick = () => {
         clickFun();
      };
      return lineBtn
   }


   //////

   data.forEach((item, index) => {
      //過濾表情標籤
      if (displayEmojiAnswer.checked) {
         if (item.emoji != searchEmoji.value) {
            return;
         }
      }
      //過濾表情標籤
      const divTop = document.createElement('div');
      divTop.className = 'divTop'
      const div = document.createElement('li');
      div.className = 'item';
      div.id = `item-${index}`;

      const time = document.createElement('div');
      time.className = 'time';
      time.textContent = new Date(item.time).toLocaleString();

      /*點擊輸入標題*/
      const inputTitle = document.createElement('div');

      inputTitle.textContent = item.title || '點擊輸入';
      inputTitle.className = 'title';

      if (!item.title) {
         inputTitle.classList.add('co-gray')
      }

      inputTitle.onclick = () => {
         const input = document.createElement('input');

         input.value = item.title || '點擊輸入';
         input.className = 'titleInput';

         // 替換 div → input
         inputTitle.replaceWith(input);

         input.focus();
         input.select();

         const saveTitle = () => {
            item.title = input.value;

            inputTitle.textContent = input.value || '點擊輸入';

            save();

            // 換回 div
            input.replaceWith(inputTitle);
         };

         // Enter 儲存
         input.onkeydown = (e) => {
            if (e.key === 'Enter') {
               saveTitle();
            }
         };

         // 點外面也儲存
         input.onblur = saveTitle;
      };

      /*點擊輸入標題*/
      /*點擊輸入表情*/
      const inputEmoji = document.createElement('div');
      reEmoji = randomObject(emoji)
      inputEmoji.textContent = item.emoji || reEmoji;
      inputEmoji.className = 'emoji';
      if (!item.emoji) {
         inputEmoji.classList.add('opacity')
      }

      inputEmoji.onclick = () => {
         const input = document.createElement('select');

         input.value = item.emoji || inputEmoji.textContent;
         input.className = 'emoji';


         function addOption(str, a) {
            const optionNull = document.createElement('option');


            optionNull.value = str
            if (a) {
               str = 'N'
            }
            optionNull.textContent = str
            input.appendChild(optionNull)
         }

         addOption(inputEmoji.textContent)
         addOption('', 'N')

         for (let index = 0; index < 30; index++) {
            const element = emoji[index];
            if (index < 10) {
               addOption(element)
            } else {
               addOption(randomObject(emoji))

            }

         }

         // 替換 div → input
         inputEmoji.replaceWith(input);
         //input.pointerdown();
         //input.focus();
         //input.select();

         const saveTitle = () => {

            item.emoji = input.value;

            inputEmoji.textContent = input.value || reEmoji;
            if (input.value == '') delete item.emoji
            save()


            if (item.emoji) {
               inputEmoji.classList.remove('opacity')
            } else {
               inputEmoji.classList.add('opacity')
            }
            // 換回 div
            input.replaceWith(inputEmoji);
            //setTimeout(() => render(), 1000);
            //render()
         };

         // Enter 儲存
         input.onchange = (e) => {

            saveTitle();

         };

         // 點外面也儲存
         input.onblur = saveTitle;
      };

      /*點擊輸入標題*/

      const textarea = document.createElement('textarea');
      textarea.className = 'content';
      textarea.value = item.text;

      textarea.oninput = () => {
         item.text = textarea.value;
         save();

         renderBars();
         renderUsage();
         if (item.expanded) {
            auto_grow(textarea);
         }
      };

      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = item.expanded ? '收起' : '展開';
      toggleBtn.className = 'buttomStyle1'
      toggleBtn.onclick = () => {
         item.expanded = !item.expanded;
         save();
         render();
      };

      const testIMGlinkBtn = document.createElement('button');
      testIMGlinkBtn.textContent = item.linkToIMG ? '收起IMG' : '顯示IMG';
      testIMGlinkBtn.className = 'buttomStyle1'
      testIMGlinkBtn.onclick = () => {
         item.linkToIMG = !item.linkToIMG;
         //save();
         render();
      };

      if (item.expanded) {
         textarea.classList.add('fixArea');

         // setTimeout(() => {auto_grow(textarea);}, 0);
      }
      ////切割行
      const toggleBtnToCut = document.createElement('button');
      toggleBtnToCut.textContent = item.toCutConut ? '原文' : '切割';
      toggleBtnToCut.className = 'buttomStyle1'
      toggleBtnToCut.onclick = () => {
         item.toCutConut = !item.toCutConut;

         //save();
         render();
      };
      if (item.toCutConut) {
         per = 0
         const lines = textarea.value.split(delimiter)
         const result = [];
         cutConut = document.getElementById('cutConut').value || 10;

         result.push(`===== 0/${lines.length} 每${cutConut}分隔 0% =====`);

         lines.forEach((line, index) => {

            if (filterSpace.checked) {
               if (line != '') {
                  result.push(line);
               }
            } else {
               result.push(line);
            }


            if ((index + 1) % cutConut === 0) {
               per = Math.floor(((index + 1) / lines.length * 100))
               if (per === 100) {

               } else {
                  result.push(`===== ${index +1}/${lines.length} 行分隔線 ${per}% =====`);
               }

            }

         });
         result.push(`===== ${lines.length}/${lines.length} 行分隔線 100% =====`);
         const text = result.join(delimiter);
         textarea.value = text

      }
      ////切割行

      ////
      const toggleBtnToLower = document.createElement('button');
      toggleBtnToLower.textContent = item.tolowered ? '原文' : '小寫';
      toggleBtnToLower.className = 'buttomStyle1'
      toggleBtnToLower.onclick = () => {
         item.tolowered = !item.tolowered;
         //save();
         render();
      };
      if (item.tolowered) {
         textarea.value = data[index].text.toLowerCase();
      }
      ////
      const toggleBtnTojoinStr = document.createElement('button');
      toggleBtnTojoinStr.textContent = item.TojoinStred ? '原文字' : '替換字';
      toggleBtnTojoinStr.className = 'buttomStyle1'
      toggleBtnTojoinStr.title = '替換文字由delimiterInput joinStr決定'
      toggleBtnTojoinStr.onclick = () => {
         item.TojoinStred = !item.TojoinStred;
         //save();
         render();
      };
      if (item.TojoinStred) {
         textarea.value = data[index].text.replaceAll(delimiter, parseJoinDelimiter(joinStr.value));

      }
      ////
      ////倒敘
      const toggleBtnToReverse = document.createElement('button');
      toggleBtnToReverse.textContent = item.ToReversed ? '原文' : '倒序';
      toggleBtnToReverse.className = 'buttomStyle1'
      toggleBtnToReverse.title = '單行字母倒序 多行陣列倒序'
      toggleBtnToReverse.onclick = () => {
         item.ToReversed = !item.ToReversed;
         //save();
         render();
      };
      if (item.ToReversed) {
         const lines = textarea.value.split(delimiter)
         if (lines.length < 2) {
            wText = data[index].text
            re = []
            for (let index = 0; index < wText.length; index++) {
               re.push(wText[index])
            }
            textarea.value = re.reverse().join('')
            //單行重新分割
         } else {
            lines.reverse()
            textarea.value = lines.join(delimiter)
         }
      }
      ////

      function lineMode() {
         item.lineMode = !item.lineMode;
         //save();展開後儲存狀態
         render();
      }

      function delLine() {
         console.log(data[index].text)
         data.splice(index, 1);
         //save();
         render();
         titleChange('重新整理找回：' + time.textContent + "···操作新資料才保存刪除")
         recoverTitle();
      }

      function recut() {

         textarea.value = textarea.value.replace(/^=====.*=====\n?/gm, '');
      }

      function cpoyLine() {
         data.unshift({
            text: data[index].text,
            time: Date.now(),
            title: `複製 ${data[index].title||''}`,
            emoji: `${data[index].emoji||''}`
         });
         save();
         render();
         titleChange('複製區塊：' + time.textContent + "···")
         recoverTitle();
      }

      function cpoyShare() {
         shareText = []

         function returnModelText(text) {
            return `【${text}】`
         }
         const shareList = ['text', 'time', 'title']

         keys = Object.keys(item)

         keys.forEach((key) => {

            if (!shareList.includes(key)) {
               return
            }

            itemName = key
            itemVaule = item[key]

            if (itemName == "text") {
               itemVaule = `\n${itemVaule}\n`
               // itemVaule=`\n--START--\n${itemVaule}\n--END--`
            }

            if (itemName == "time") {
               itemVaule = new Date(itemVaule).toLocaleString()
            }

            if (itemName == "title") {
               if (item['emoji']) {
                  itemVaule = `${item['emoji']} ${itemVaule}`
               }
            }

            shareText.push(`${returnModelText(itemName)}:${itemVaule}`)

         })
         //console.log(a)
         shareText = shareText.sort().reverse().join('\n')
         copyText(shareText)
      }

      function openALLurl() {
         if (!allowOPENallurl.checked) {
            titleChangeUse('先允許全部訪問');
            return
         }

         const lines = textarea.value.split(delimiter).filter(l => l.trim());
         startsleeptime = 0
         sleep = OPENAllwindowTimeset.value * 1000
         lines.forEach(line => {
            setTimeout(() => {
               openNewWindow(line);
            }, startsleeptime);
            startsleeptime += sleep
            // console.log(startsleeptime)
         })
         setTimeout(() => {
            recoverTitle();
         }, startsleeptime);
      }
      const divNum = document.createElement('div');
      divNum.textContent = item.index
      divNum.className = 'divNum'
      const divinline = document.createElement('div');
      const divtitle = document.createElement('div');


      divtitle.className = 'divtitle'

      divtitle.appendChild(inputTitle)
      //divtitle.appendChild(inputEmoji)
      divtitle.appendChild(time);
      const divNumAndOther = document.createElement('div');
      const divOther = document.createElement('div');
      divOther.className = 'grid1fr1fr1fr'
      divNumAndOther.className = 'grid1fr1fr'
      divNumAndOther.appendChild(divNum);
      divNumAndOther.appendChild(divOther);
      divtitle.appendChild(divNumAndOther);

      divinline.appendChild(divtitle)
      divinline.className = 'divinline'
      const divlineAndBtns = document.createElement('div');
      divlineAndBtns.appendChild(divinline)
      const divBtn = document.createElement('div');

      divBtn.className = 'divBtns'

      divBtn.appendChild(createBtnClickFun('複製', () => copyText(textarea.value, index), '複製內容'));
      divBtn.appendChild(toggleBtn); //展開收起
      divBtn.appendChild(createBtnClickFun('逐行', lineMode));
      divBtn.appendChild(toggleBtnTojoinStr); //替換字

      divBtn.appendChild(toggleBtnToCut); //切割行數
      if (item.toCutConut) {
         divBtn.appendChild(createBtnClickFun('刪除切割行', recut, '刪除切割行'));
      }

      divBtn.appendChild(toggleBtnToLower); //全部小寫
      divBtn.appendChild(toggleBtnToReverse); //倒序


      divBtn.appendChild(testIMGlinkBtn); //IMG訪問
      divBtn.appendChild(createBtnClickFun('url全部訪問', openALLurl));


      divOther.appendChild(createBtnClickFun('⏎', cpoyLine, '複製整個區塊'));
      divOther.appendChild(createBtnClickFun('🔗', cpoyShare, '模板分享'));
      divOther.appendChild(createBtnClickFun('❌', delLine, '刪除'));

      divlineAndBtns.className = 'inlineflex'
      divinline.appendChild(divBtn);
      divlineAndBtns.appendChild(inputEmoji)

      div.appendChild(divlineAndBtns);

      div.appendChild(textarea);


      //if function要在按鈕建立之後 不然排版會混亂

      //逐行模式
      if (item.lineMode) {
         const ol = document.createElement('ol');
         const lastdiv = document.createElement('div');
         lastdiv.style = 'margin-top: 10px;'
         //ol.id = `colScreen-${index}`;
         //ol.className = 'col'; 
         ol.classList.add('col')
         ol.classList.add('hide-scrollbar');
         //卡片模式
         if (lineCardMode.checked) {
            //ol.className +=' horizLine '
            ol.classList.add('horizLine');
            //滾動軸
            const lndiv = document.createElement('div');
            lndiv.className = 'lndiv'


            //拉條
            const inputRange = document.createElement('input');

            inputRange.type = 'range';
            inputRange.min = '0';
            inputRange.max = '-1';
            inputRange.step = '1';
            inputRange.value = '0';


            function bindRangeScroll(range, targetScroll) {

               function updateRange() {
                  if (range.max != '-1') {
                     return
                  }
                  range.min = 0;

                  range.max =
                     Math.max(
                        0,
                        targetScroll.scrollWidth -
                        targetScroll.clientWidth
                     );

                  range.value =
                     targetScroll.scrollLeft;

               }


               range.oninput = () => {

                  targetScroll.scrollTo({
                     left: Number(range.value),
                     //behavior:"smooth"
                  });

               };


               targetScroll.onscroll = () => {

                  range.value =
                     targetScroll.scrollLeft;
                  updateRange();
               };

               range.addEventListener(
                  "pointerdown",
                  updateRange
               );

            }

            bindRangeScroll(inputRange, ol);

            lndiv.appendChild(inputRange);
            const inputPage = document.createElement('input');

            inputPage.placeholder = `快速跳轉`

            function allChildrenlength() {
               inputPage.placeholder = `項目:${ol.children.length}`
            }
            inputPage.addEventListener(
               "pointerdown",
               allChildrenlength
            );


            inputPage.oninput = () => {

               const index =
                  Number(inputPage.value) - 1;

               target =
                  ol.children[index];
               console.log()
               if (index > ol.children.length) {
                  num = ol.children.length - 1
                  target = ol.children[num];
               }
               if (target) {

                  ol.scrollTo({
                     left: target.offsetLeft,
                     behavior: 'smooth'
                  });

               }

            };

            lndiv.appendChild(inputPage)

            //
            lastdiv.appendChild(lndiv)
            //滾動軸

         } else {
            ol.classList.add('strLine');
         }
         //卡片模式
         //const lines = item.text.split('\n').filter(l => l.trim());

         const lines = textarea.value.split(delimiter).filter(l => l.trim());
         lines.forEach((line, innerIndex) => {
            //const ldiv = document.createElement('div');
            const ldiv = document.createElement('li');
            ldiv.className = 'line';


            if (lineCardMode.checked) {

               ldiv.classList.add('lineCardExhibit')

            }

            //
            //ldiv.onclick = () => navigator.clipboard.writeText(line);
            ///
            ldiv.onclick = () => {
               copyText(line, index);
               ldiv.style.backgroundColor = randomColor();
               console.log(ldiv)
               setTimeout(() => {
                  ldiv.style.backgroundColor = ''
               }, 20 * 1000);
               //多久恢復顏色
               if (lineUrlahref.checked) {
                  openNewWindow(line);
               }
            }
            ///checkBox項目區
            if (lineCheckMode.checked) {
               //ldiv.className += ' lineCardExhibit';
               const checkBox = document.createElement('input');
               checkBox.type = 'checkbox'
               //checkBox.id=`ckbox-${index}-${innerIndex}`
               checkBox.className = `ckboxCodeTarget`
               dataInnerIndex = `data-${index}-${innerIndex}`
               checkBox.value = dataInnerIndex
               //勾選的時候紀錄 以免刷新
               checkBox.onchange = () => {
                  const item = selectCheckBoxData.find(
                     item => item.box === checkBox.value
                  );

                  if (item) {
                     item.select = checkBox.checked;
                  } else {
                     selectCheckBoxData.unshift({
                        box: checkBox.value,
                        select: checkBox.checked
                     });
                  }
                  save_selectCheckBoxData();
               }
               //取得勾選紀錄
               const item = selectCheckBoxData.find(
                  item => item.box === checkBox.value
               );
               if (item) {
                  if (item.select) {
                     checkBox.checked = true;
                  }
               }
               ldiv.onclick = () => {
                  checkBox.pointerdown()
                  copyText(line, index);
               }
               //勾選的時候紀錄 以免刷新
               //可以再回到data取值
               const label = document.createElement('label');
               label.textContent = line
               ldiv.append(label)
               ldiv.prepend(checkBox);
               ///checkBox項目區
            } else {
               ldiv.textContent = line;

            }
            ol.appendChild(ldiv);
            ////組裝
            div.appendChild(ol);
            if (lineCardMode.checked) {

               div.appendChild(lastdiv);
            }
         });
      }
      /*
       
        */
      if (item.linkToIMG) {

         imgcheckbox = document.getElementById('IMGcheckBox');

         addHttpscheckBox = document.getElementById('addHttpscheckBox');

         const lines = textarea.value.split(delimiter).filter(l => l.trim());
         const Topfdiv = document.createElement('div');
         Topfdiv.className = 'divTestImgTop'
         lines.forEach(line => {
            const fdiv = document.createElement('div');
            fdiv.className = 'divTestImg'
            const img = document.createElement('img');
            if (imgcheckbox.checked) {

               img.src = line
               img.className = 'testImg'
               //img.onerror="this.style.display='none'"
               img.onerror = function () {
                  this.style.display = 'none';
               };


               const ahref = document.createElement('a');

               if (addHttpscheckBox.checked) {
                  line = urlHttps(line)
               }

               ahref.href = line
               ahref.textContent = line
               ahref.title = line
               ahref.target = "_blank"


               img.onclick = () => copyText(line, index);
               fdiv.appendChild(ahref)
               fdiv.appendChild(img);
               Topfdiv.appendChild(fdiv);
            } else {
               titleChangeUse('先允許訪問IMG');
               const fdiv = document.createElement('p');
               fdiv.textContent = '先允許訪問IMG'
               Topfdiv.appendChild(fdiv);
            }

         });

         div.appendChild(Topfdiv);
      }
      divTop.appendChild(div);
      list.appendChild(divTop);
      oclass.push(inputTitle, time)


   });

   searchEmojiSelect();
   renderBars();
   renderUsage();
   oclass = addClassName(oclass, 'overflowAuto')

}
///////rander到這裡///////rander到這裡///////rander到這裡///////rander到這裡///////rander到這裡///////rander到這裡
function recoverTitle() {
   setTimeout(() => {
      titleOrogin = document.getElementsByTagName('title')[0].textContent;
      titleChange(titleOrogin + randomFacetext());
   }, 3000);
}

function addClassName(o, className) {
   o.forEach(i => {

      if (typeof i == 'string') {
         i = document.getElementById(i)
      }

      if (![...i.classList].includes(className)) {

         i.classList.add(className)
      }
   })

   return null
}

function titleChange(string) {
   titleA = document.getElementById('titleA');
   titleA.textContent = string
}

function titleChangeUse(string) {
   titleChange(string)
   recoverTitle()
}

function copyText(text, index) {

   navigator.clipboard.writeText(text)
   text20 = text.slice(0, 20)
   titleChange('已複製：' + text20 + "···")
   recoverTitle();
   /*
                 if (typeof(index)=='number'){
                   nodeTimeTitle=document.getElementById(`item-${index}`).childNodes[0].childNodes[0].childNodes[0].childNodes[1]
                
                   nodeTimeTitle.textContent='已複製：'+text20+"···"+randomFacetext()
               setTimeout(() => {
                   nodeTimeTitle.textContent=new Date(data[index].time).toLocaleString()//+"···"+randomFacetext()
               }, 3000);
              
                 }
               */

}
//
//開視窗
//
windowsObject = []
newWindowConf = {
   x: 0,
   y: 0,
   baseline: 60,
   userScreenMaxWidth: 1200,
   userScreenMaxHeight: 1000,
   windowHeight: 200,
   windowWidth: 200
}

function openNewWindow(url) {
   if (windowHWset.value) {
      u = windowHWset.value.split(',');
      u = u.map(Number);
      newWindowConf.windowHeight = u[0]
      newWindowConf.windowWidth = u[1]
      newWindowConf.userScreenMaxWidth = u[2]
      newWindowConf.userScreenMaxHeight = u[3]
      newWindowConf.baseline = u[4]
   }
   if (addHttpscheckBox.checked) {
      url = urlHttps(url)
   }

   w = window.open(
      url,
      '_blank',
      `height=${newWindowConf.windowHeight},width=${newWindowConf.windowWidth},left=${newWindowConf.x},top=${newWindowConf.y}`
   ); // 在新的標籤頁或視窗中打開每個連結
   windowsObject.push(w);


   nextWindowPosition(newWindowConf);
   titleChange(`開${windowsObject.length}次視窗${randomFacetext()}`);
   //console.log('x:',typeof(newWindowConf.x),'y:',newWindowConf.y);

}

function closeMultipleWindows() {
   windowsObject.forEach(windowO => {
      if (windowO && !windowO.closed) {
         windowO.close(); // 关闭有效且尚未关闭的窗口
      }
   })
   windowsObject = []
   newWindowConf.x = 0
   newWindowConf.y = 0
   titleChangeUse(`關掉所有視窗${randomFacetext()}`);
}

function urlHttps(url) {
   checkhttp = url.trim().slice(0, 4)
   if (checkhttp != 'http') {
      url = 'https://' + url
   }
   return url
}

function nextWindowPosition(conf) {

   conf.x += conf.windowWidth;

   // 換行
   if (
      conf.x + conf.windowWidth >
      conf.userScreenMaxWidth
   ) {
      conf.x = 0;

      conf.y += (
         conf.windowHeight +
         conf.baseline
      );
   }

   // 超出高度
   if (
      conf.y + conf.windowHeight >
      conf.userScreenMaxHeight
   ) {
      conf.x = 0;
      conf.y = 0;
   }
}
///


// 匯出
exportBtn.onclick = () => {
   const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
   });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'backup.json';
   a.pointerdown();
};

// 匯入
importFile.onchange = (e) => {
   const file = e.target.files[0];
   const reader = new FileReader();
   reader.onload = () => {
      const imported = JSON.parse(reader.result);
      data = [...imported, ...data];
      save();
      render();
   };
   reader.readAsText(file);
};

// paste
input.addEventListener('paste', () => {
   mainaction();
});

function mainaction() {
   setTimeout(() => {
      const value = input.value.trim();
      if (value) {
         data.unshift({
            text: value,
            time: Date.now(),
            expanded: false,
            lineMode: false
         });
         save();
         render();
         titleChange('已貼上：' + value.slice(0, 20) + "···")
         recoverTitle();
         input.value = '';
         // clearAllSelect();
         window.location.href = '#'
      }
   }, 0);
}

render();
///刪除時間前資料
function removeBeforeTime() {

   const value =
      document.getElementById('timeInput').value;
   const strTime = new Date(value).toLocaleString()
   if (!value) {
      titleChangeUse('請選擇時間');
      return;
   }

   if (!confirm(`本次刪除${strTime}前的資料`)) {
      titleChangeUse(`取消本次刪除${strTime}前的資料`);
      return;
   }

   // datetime-local -> timestamp
   const targetTime = new Date(value).getTime();

   // 保留指定時間後的資料
   data = data.filter(item => {
      return item.time >= targetTime;
   });

   titleChangeUse(`刪除${strTime}前的資料,操作一個新資料之後才save`);

   render();

}
////
const slider = document.getElementById('slider');
// 拉條改文字大小


slider.addEventListener('input', (e) => {
   document.documentElement.style.setProperty('--font-size', e.target.value + 'px');
});

const sliderIMG = document.getElementById('sliderIMG');
// 拉條改文字大小


sliderIMG.addEventListener('input', (e) => {
   document.documentElement.style.setProperty('--img-size', e.target.value + 'px');
});