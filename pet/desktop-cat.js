(function () {
  if (window.__Desktop_Cat__) {
    document.getElementById('Desktop_Cat').remove();
     window.__Desktop_Cat__ = false;
     cancelAnimationFrame(anid)
     console.log('停止繪畫',anid)
    return};
  window.__Desktop_Cat__ = true;
const gameDiv = document.createElement('div');
gameDiv.id='Desktop_Cat'
const catCanvas = document.createElement('canvas');

//按鈕
  const startToggleBtn = document.createElement('button');
    startToggleBtn.textContent = '開始暫停'
    startToggleBtn.className='buttomStyle1'
    startToggleBtn.onclick = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    gameStart= !gameStart
    console.log('開始暫停遊戲');
    };

    const clearBtn = document.createElement('button');
    clearBtn.textContent = '清畫面'
    clearBtn.className='buttomStyle1'
    clearBtn.onclick = () => {
     ctx.clearRect(0,0,canvas.width,canvas.height);
    paths=[]
    console.log('清畫面');
    };
    
   const fullScreenBtn = document.createElement('button');
    fullScreenBtn.textContent = '全螢幕'
    fullScreenBtn.className='buttomStyle1'
    fullScreenBtn.onclick = () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    console.log('全螢幕');
    };

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    gameStart= !gameStart
    console.log('暫停遊戲');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyC') {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    paths=[]
    
    console.log('C 清空畫面');
  }
});

//
catCanvas.id='canvas'
//document.getElementsByTagName('body')[0].appendChild(catCanvas);
gameDiv.appendChild(catCanvas)
gameDiv.appendChild(fullScreenBtn)
gameDiv.appendChild(startToggleBtn)
gameDiv.appendChild(clearBtn)
document.getElementsByTagName('body')[0].prepend(gameDiv);
const canvas = catCanvas
const ctx = canvas.getContext('2d');

//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

//canvas.height = '150';

canvas.width = window.innerWidth;
//canvas.height = '150';
canvas.height = window.innerHeight*0.85;
gameStart=true
 foods = [];
const coins = [];
pets=[];
monsters=[]
//const popTexts = [];

let score = 0;

let maxlevel=20
let level=0
let catPower=1
let rank=0
let maxOwnPets=11+rank*0.5
let diePetNum=0
let dieMonNum=0
let maxFoodNum=999
let mouseSpeed=0.5+rank*0.1 //老鼠的數度 是乘法 1是正常
let creatCDtimer=60;
canCreatMonster=1

//手勢睏鼠
let drawing = false;
let currentPath = [];
paths = [];
let drawPathTime=60*5 //筆跡存在時間 秒
//


// UI 位置（右上角）
const UI_POS = {
  //x: canvas.width - 60,
  //y: 40
  x: 10,
  y: 10
};

const PADDING ={
    width :50,
    height: 15
};

/*
let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  console.log(mouse.x,mouse.y)
});
*/

const cat1 = {
  x: canvas.width/2,
  y: canvas.height/2,
  vx: 0,
  vy: 0,
  targetX: 0,
  targetY: 0,
  state: 'idle',
  timer: 0,
  dir: 1,
  walkCycle: 0,
  tailTime: 0,
  hungry:30,
  energy:0
};

function changeState(pets) {
      pets.forEach(cat => {
    //每次動作扣飢餓
    cat.hungry--;

  
    //console.log(cat.hungry)

   
  const r = Math.random();
  const f = Math.random();
  //飢餓了才吃東西 不然一直睡覺
  if (cat.hungry<30){
    cat.state = 'sleep';
    cat.timer = 200 + Math.random() * 200;
  }
  if (r < 0.5) {
    cat.state = 'wander';
    cat.targetX = PADDING.width + Math.random() * (canvas.width - PADDING.width * 2);
    cat.targetY = PADDING.height + Math.random() * (canvas.height - PADDING.height * 2);
    //console.log(cat.targetX,cat.targetY)
    cat.timer = 200 + Math.random() * 200;
  } else if (r < 0.8) {
    cat.state = 'idle';
    cat.timer = 100 + Math.random() * 100;
  } else {
    cat.state = 'sleep';
    cat.timer = 200 + Math.random() * 200;
     if (cat.energy>99) {
        cat.hungry-=30
        cat.energy=0;
        coinCreat(cat);
        //console.log('消耗能量')
    }
  }
  //創立食物
  if (f < 0.2 && foods.length<4) {
    for (let index = 0; index <  pets.length*0.6; index++) {
       foodCreat();
       
    }
     //console.log('食物',foods.length,'個')
  }

  if (f < 0.01 && pets.length>5) {
    monsterCreat();
    //console.log('怪物',monsters.length,'個')
  }
   
 //console.log(f)
})}

function update(pets) {
    pets.forEach(cat => {
    ///
    if (cat.hungry>60 && cat.energy<100) {
        cat.energy++;
        
    }
   // console.log(cat.energy)
    ///
 if (cat.eatTimer > 0) {
  cat.eatTimer--;

  cat.state = 'eat';

  if (cat.eatTimer === 0) {
    cat.targetFood = null;
  }

  return; // 🔥 很重要：吃的時候不做其他行為
}
    ///
  cat.timer--;
  if (cat.timer <= 0) changeState(pets);

  if (cat.state === 'wander') {
    const dx = cat.targetX - cat.x;
    const dy = cat.targetY - cat.y;
    
    cat.vx += dx * 0.001;
    cat.vy += dy * 0.001;
    //console.log(dx,dy,cat.vx,cat.vy)
  }

  // 摩擦（慣性）
  cat.vx *= 0.95;
  cat.vy *= 0.95;

  cat.x += cat.vx;
  cat.y += cat.vy;

  // 方向
  if (Math.abs(cat.vx) > 0.1) {
    cat.dir = cat.vx > 0 ? 1 : -1;
  }

  const speed = Math.sqrt(cat.vx*cat.vx + cat.vy*cat.vy);

  // 步態速度（跑 vs 走）
  cat.walkCycle += speed * 0.3;

  cat.tailTime += 0.1 + Math.random()*0.05;
  ////
  // ===== 找最近食物 =====
let nearest = null;
let minDist = Infinity;

if (cat.hungry<60) {
    if(cat.state=='sleep') return
    foods.forEach(food => {
  if (food.eaten) return;

  const dx = food.x - cat.x;
  const dy = food.y - cat.y;
  const dist = Math.sqrt(dx*dx + dy*dy);

  if (dist < minDist) {
    minDist = dist;
    nearest = food;
  }
});
}



// ===== 吃東西優先權最高 =====
//飢餓小於60才吃

//if(!cat.state=='sleep'){console.log(cat)}

if (nearest  ) {
    //睡覺不吃飯
    if(cat.state=='sleep') return
  cat.targetFood = nearest;

  const dx = nearest.x - cat.x;
  const dy = nearest.y - cat.y;

  // 還沒到 → 走過去
  if (minDist > 20) {
    cat.state = 'walk';

    cat.vx += dx * 0.003;
    cat.vy += dy * 0.003;
  } else {
    // 到了 → 吃
    cat.state = 'eat';
    cat.vx = 0;
    cat.vy = 0;

    cat.eatTimer = 60; // 吃1秒
    cat.hungry+=10;
    nearest.eaten = true;
    
  }
  //updateCoins();
}

//
//coin
  ////
})
}

//coin
function updateCoins() {
  coins.forEach(coin => {
    coin.time += 0.1;

    if (coin.state === 'drop') {
      coin.vy += coin.gravity;
      coin.x += coin.vx;
      coin.y += coin.vy;

      const ground = canvas.height - 20;
      //const ground = coin.y-20;

      if (coin.y > ground) {
        coin.y = ground;
        coin.vy *= -coin.bounce;

        // 停下來
        if (Math.abs(coin.vy) < 1) {
          coin.vy = 0;
          coin.state = 'idle';
          coin.timer = 30; // 停一下再飛
        }
      }
    }

    else if (coin.state === 'idle') {
      coin.timer--;
      if (coin.timer <= 0) {
        coin.state = 'fly';
      }
    }

    else if (coin.state === 'fly') {
      const dx = UI_POS.x - coin.x;
      const dy = UI_POS.y - coin.y;

      coin.x += dx * 0.1;
      coin.y += dy * 0.1;

      // 到 UI
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        coin.collected = true;
        score++;
      }
    }
  });

  // 清掉已收集
  for (let i = coins.length - 1; i >= 0; i--) {
    if (coins[i].collected) {
      coins.splice(i, 1);
    }
  }

  // 清掉吃過的食物
  for (let i = foods.length - 1; i >= 0; i--) {
    if (foods[i].eaten) {
      foods.splice(i, 1);
    }
  }

  // 清掉餓死貓
  for (let i = pets.length - 1; i >= 0; i--) {
    if (pets[i].hungry<10 ) {
      pets.splice(i, 1);
      //console.log(pets[i],'餓死了')
      diePetNum++
    }
    if ( pets[i].remove == true) {
        //console.log(pets[i],'被殺死了')
        pets.splice(i, 1);
        diePetNum++
        /*
    monsters.forEach(mouse => {
        if (pets[i].power) {
            mouse.HP-=pets[i].power
        }else{
        mouse.HP--;
        //所有老鼠生命-1
        //  得想個辦法只扣單個老鼠生命
        }
    })
*/
    foodCreat();
    score++;


        }
  }

  for (let i = monsters.length - 1; i >= 0; i--) {
    if (monsters[i].HP<1) {
       //console.log(monsters[i],'老鼠死了')
      // coinCreat();
      for (let index = 0; index < maxOwnPets*3; index++) {
      foodCreat();
      //console.log(creatCDtimer)
       if (monsters[i].trapped && creatCDtimer<0 && index<3) {
        //m.trapped = true;
        coinCreat();
       } 
      }
      monsters.splice(i, 1);
      dieMonNum++
      if (maxOwnPets<maxlevel) {
        maxOwnPets++
        level++
        catPower++
      }
    }
  }
  if (creatCDtimer>=0) {
    creatCDtimer--;
  }
  
if (score>2 && pets.length<maxOwnPets && creatCDtimer<0) {
    petCreat();
    score-=3;
    creatCDtimer=10;
}

if (score>50 && canCreatMonster ) {
    score-=20;
    hp=0
    for (let index = 0; index < level+pets.length+rank; index++&& creatCDtimer<0) {
       hp++
        //

    }
     monsterCreat(hp);
     console.log('創立怪物',hp,monsters)
    rank++
    canCreatMonster=0
    console.log(canCreatMonster)
}




}

//mouse system
function updateMouse(monsters, cats) {

     //monsters.forEach(m => {
      //status_a 筆跡受困狀態
      function status_a(m){
    if (m.trapped) {
      m.trapTimer--;
      //console.log('a')
      // 🔥 扣血
      m.HP = (m.HP || 100) - 0.1;
      //console.log(m.);
      // 被困住（不能動）
     // m.dx = 0;
     // m.dy = 0;

      if (m.trapTimer <= 0) {
        m.trapped = false;
      }
    }
   // console.log(m.trapped)
    return m.trapped
    }
  //});

    monsters.forEach(mouse => {
     b= status_a(mouse)
    if (b){return} 
     
  let nearest = null;
  let minDist = Infinity;

  cats.forEach(cat => {
    const dx = cat.x - mouse.x;
    const dy = cat.y - mouse.y;
    const dist = Math.hypot(dx, dy);

    if (dist < minDist) {
      minDist = dist;
      nearest = cat;
    }
  });

  if (nearest) {
    const dx = nearest.x - mouse.x;
    const dy = nearest.y - mouse.y;
    
    mouse.x += dx * 0.02 *mouseSpeed;
    mouse.y += dy * 0.02 *mouseSpeed;

    mouse.dir = dx > 0 ? 1 : -1;

    // 碰到貓 → 清除
    if (minDist < 20) {
      nearest.remove = true;
      mouse.HP-=nearest.power
    }
  }})


}
//

function drawCat(pets) {
  i=0
    pets.forEach(cat => {
      i++
      if (i<maxFoodNum) {
        
     
  ctx.save();

  ctx.translate(cat.x, cat.y);

  // 身體傾斜（依速度）
  const tilt = cat.vx * 0.05;
  ctx.rotate(tilt);

  ctx.scale(cat.dir, 1);

  const speed = Math.sqrt(cat.vx*cat.vx + cat.vy*cat.vy);

  // 呼吸
  const breathe = Math.sin(Date.now()*0.002) * 0.02;
  ctx.scale(1, 1 + breathe);

  // 走路上下彈
  const bounce = Math.sin(cat.walkCycle) * speed * 2;
  ctx.translate(0, bounce);

  // 身體
  ctx.beginPath();
  ctx.ellipse(0, 10, 20, 12, 0, 0, Math.PI*2);
  ctx.stroke();

  // 頭
  

  // 眼睛
  if (cat.state === 'eat') {
   // 頭的位置（旋轉中心）
const headX = 25;
const headY = -5;

// 吃東西時搖頭
let angle = 0;
if (cat.state === 'eat') {
  angle = Math.sin(Date.now() * 0.02) * 0.3; // 搖頭幅度
}

ctx.translate(headX, headY);
ctx.rotate(angle);
ctx.translate(-headX, -headY);

// 畫頭
ctx.beginPath();
roundRect(25 - 14, -5 - 8, 30, 16, 6);
ctx.stroke();
  }else if (cat.face){
    ctx.font = '10px Arial';

const text = cat.face;
const metrics = ctx.measureText(text);
const textWidth = metrics.width;
const padding = 5; // 左右留白
const headWidth = textWidth + padding;
const headHeight = 20; // 可以固定
//
const headX = 25;
const headY = -5;

ctx.beginPath();
ctx.ellipse(
  headX,
  headY,
  headWidth / 2,
  headHeight / 2,
  0,
  0,
  Math.PI * 2
);
ctx.stroke();
//
//roundRect(25 - 14, -5 - 8, 60, 16, 6);
//function roundRect(x, y, w, h, r) {
ctx.stroke();
  } 
  else {
 ctx.beginPath();
  ctx.arc(25, -5, 12, 0, Math.PI*2);
  ctx.stroke();
  }

  


   
  // 耳朵
  ctx.beginPath();
  ctx.moveTo(18, -12);
  ctx.lineTo(22, -20);
  ctx.lineTo(26, -12);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(30, -12);
  ctx.lineTo(34, -20);
  ctx.lineTo(38, -12);
  ctx.stroke();

  // 眼睛
  if (cat.state === 'sleep') {
    ctx.beginPath();
    ctx.moveTo(22, -5);
    ctx.lineTo(26, -5);
    ctx.moveTo(30, -5);
    ctx.lineTo(34, -5);
    ctx.stroke();
  } 
  else if(cat.face) {
    ctx.beginPath();
    //ctx.arc(25, -5, 1.5, 0, Math.PI*2);
    //ctx.arc(32, -5, 1.5, 0, Math.PI*2);  
   // ctx.textAlign = 'center';
 //ctx.textBaseline = 'middle';
    ctx.font = "10px Arial"; 
    //const metrics = ctx.measureText(cat.face);
    //const textWidth = metrics.width;
    ctx.fillText(cat.face, 10, -5);
    ctx.fill();
  }else{
     ctx.beginPath();
    ctx.arc(25, -5, 1.5, 0, Math.PI*2);
    ctx.arc(32, -5, 1.5, 0, Math.PI*2);  
    ctx.fill();
  }

  // === 四腳步態 ===
  const legPhase = cat.walkCycle;

  function leg(x, phaseOffset) {
    const swing = Math.sin(legPhase + phaseOffset) * 8 * Math.min(speed,1);
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x + swing, 30);
    ctx.stroke();
  }

  // 前腳
  leg(10, 0);
  leg(20, Math.PI);

  // 後腳
  leg(-10, Math.PI);
  leg(-20, 0);

  // === 尾巴（多段） ===
 
    choiceDrawTail(cat)
  // 睡覺 Z
  if (cat.state === 'sleep') {
    ctx.fillText('Z', 40, -20);
  }

  ctx.restore();
   }
})

}

//tailArea

function choiceDrawTail(cat){
    //console.log('use',cat.type)
    switch (cat.tail_type) {
  case 0:
    // Code to run if expression === value1
    break;
  case 1:
    // Code to run if expression === value1
    drawTail(cat)
    break;
  case 2:
    // Code to run if expression === value2
    drawTailSmooth(cat)
    break;
  case 3:
    // Code to run if expression === value2
    drawTailSwing(cat)
    break;
  case 4:
    // Code to run if expression === value2
    drawTailShake(cat)
    break;
  default:
    // Code to run if no cases match
    drawTailCurl(cat)
}



function drawTail(cat){
    let baseX = -20;
    let baseY = 5;
    if (cat) {
            for (let i=0;i<3;i++) {
            const wave = Math.sin(cat.tailTime + i*0.5) * 5;
            ctx.beginPath();
            ctx.moveTo(baseX, baseY);
            ctx.lineTo(baseX - 10, baseY - 10 + wave);
            ctx.stroke();
            baseX -= 10;
            baseY -= 10;
        }
    }
}

function drawTailSmooth(cat) {
  let x = -20;
  let y = 5;

  ctx.beginPath();
  ctx.moveTo(x, y);

  for (let i = 0; i < 3; i++) {
    const wave = Math.sin(cat.tailTime + i * 0.5) * 6;

    const cx = x - 8;                 // 控制點
    const cy = y - 10 + wave;

    const nx = x - 16;                // 終點
    const ny = y - 12 + wave;

    ctx.quadraticCurveTo(cx, cy, nx, ny);

    x = nx;
    y = ny;
  }
ctx.stroke();
  
}

function drawTailSwing(cat) {
  let x = -20;
  let y = 5;

  const swing = Math.sin(cat.tailTime) * 15;

  ctx.beginPath();
  ctx.moveTo(x, y);

  ctx.quadraticCurveTo(
    x - 20,
    y - 10 + swing,
    x - 40,
    y + swing
  );

  ctx.stroke();
}

function drawTailShake(cat) {
  let baseX = -20;
  let baseY = 5;

  for (let i = 0; i < 4; i++) {
    const jitter = Math.sin(cat.tailTime * 5 + i) * 3;

    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(baseX - 10, baseY - 10 + jitter);
    ctx.stroke();

    baseX -= 10;
    baseY -= 10;
  }
}

function drawTailCurl(cat) {
  const t = cat.tailTime;

  ctx.beginPath();
  ctx.moveTo(-20, 5);

  ctx.bezierCurveTo(
    -40, -10,
    -30, -30,
    -10 + Math.sin(t)*5, -20
  );

  ctx.stroke();
}

}
//tailArea



//mouse
function drawMouse(monsters) {
  i=0
  if (i<50) {
    
  
    monsters.forEach(mouse => {
      i++;
  ctx.save();
  ctx.translate(mouse.x, mouse.y);
  ctx.scale(mouse.dir || 1, 1); // 面向方向

  // 身體（橢圓）
  ctx.beginPath();
  ctx.ellipse(0, 5, 12, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
  const jitter = Math.sin(Date.now() * 0.02) * 1;
ctx.translate(0, jitter);

  // 頭
  ctx.beginPath();
  ctx.arc(12, 0, 6, 0, Math.PI * 2);
  ctx.stroke();

  // 耳朵
  ctx.beginPath();
  ctx.arc(9, -5, 3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(15, -5, 3, 0, Math.PI * 2);
  ctx.stroke();

  // 眼睛
  ctx.beginPath();
  ctx.arc(14, -1, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // 鼻子
  ctx.beginPath();
  ctx.arc(18, 0, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // 鬍鬚
  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(22, -2);
  ctx.moveTo(18, 0);
  ctx.lineTo(22, 2);
  ctx.stroke();

  // 尾巴（曲線）
  ctx.beginPath();
  ctx.moveTo(-10, 5);
  ctx.quadraticCurveTo(-25, -5, -30, 10);
  ctx.stroke();

  

const wave = Math.sin(Date.now() * 0.1) * 5;

ctx.beginPath();
ctx.moveTo(-10, 5);
ctx.quadraticCurveTo(-25, -5 + wave, -30, 10 + wave);
ctx.stroke();

  ctx.restore();
   })
   }
}
//mouse
//eat
function drawFishBone(food) {
  ctx.save();
  ctx.translate(food.x, food.y);

  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;

  // 主骨
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(10, 0);
  ctx.stroke();

  // 魚頭（三角）
    ctx.beginPath();
    ctx.moveTo(15, 0);    // 尖端（右）
    ctx.lineTo(10, -5);   // 上
    ctx.lineTo(10, 5);    // 下
    ctx.closePath();
    ctx.stroke();

  // 魚尾（叉）
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-15, -5);
  ctx.moveTo(-10, 0);
  ctx.lineTo(-15, 5);
  ctx.stroke();

  // 肋骨
  for (let i = -6; i <= 6; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - 3, -4);
    ctx.moveTo(i, 0);
    ctx.lineTo(i - 3, 4);
    ctx.stroke();
  }

  ctx.rotate(Math.sin(Date.now() * 0.005) * 0.1);

  

  ctx.restore();
}

function drawFood(food) {
  ctx.save();
  ctx.translate(food.x, food.y);

  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#8B5A2B'; // 飼料棕色
  ctx.fill();

  ctx.restore();
}

//coin
function drawCoin(coin) {
  ctx.save();
  ctx.translate(coin.x, coin.y);

  // 翻轉動畫
  const scaleX = Math.abs(Math.sin(coin.time));
  ctx.scale(scaleX, 1);

  const r = 10;

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, r - 3, 0, Math.PI * 2);
  ctx.fillStyle = '#FFC107';
  ctx.fill();

  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 高光
  ctx.beginPath();
  ctx.arc(-3, -3, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fill();

  ctx.restore();
}
//coin
//ui
function drawUI() {
  ctx.save();

  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';
  ctx.textAlign = 'right';
  w=canvas.width - 20
  

  ctx.fillText('💰: ' + score, w, 40);
  ctx.fillText('🆙: ' + level, w, 70);
  ctx.fillText('🐱: ' + pets.length, w, 100);
  ctx.fillText('🐭: ' + monsters.length, w, 130);
  ctx.fillText('🍖: ' + foods.length, w, 160);
  ctx.fillText('🆖: ' + rank, w, 190);
  ctx.fillText('☠️🐱: ' + diePetNum, w, 220);
  ctx.fillText('☠️🐭: ' + dieMonNum, w, 250);

  ctx.restore();
}

function drawTopHUD() {
  ctx.save();

  ctx.font = '14px Arial';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  //
 //ctx.fillStyle = 'rgba(184, 184, 184, 0.4)';
//ctx.fillRect(0, 0, canvas.width, canvas.height);
//ctx.shadowColor = 'black';
//ctx.shadowBlur = 4;
  //

  let x = 10;
  let y = 10;
  const gap = 20;

  const items = [
    '💰 ' + score,
    '🆙 ' + level,
    '🐱 ' + pets.length,
    '🐭 ' + monsters.length,
    '🍖 ' + foods.length,
    '🆖 ' + rank,
    '☠️🐱 ' + diePetNum,
    '☠️🐭 ' + dieMonNum
  ];
//items.join('   |   ')

  items.forEach(text => {
   
    ctx.fillText(text, x, y);
    
    const width = ctx.measureText(text).width;
    x += width + gap; // 🔥 根據實際寬度往右排
    if (x>canvas.width-50) {
      y+=25
      x=10
    }
  });

  ctx.restore();
}
//

function drawHungry(object,type) {
  ctx.save();
     y =0;
     height = 0;
    if (type=='hungry') {
         y = object.y - 30;
        drawType=object.hungry
        height=6;
    }
    if (type=='energy') {
         y = object.y - 33;
        drawType=object.energy
        height=3;
    }
        if (type=='HP') {
          y = object.y - 10;
          ctx.font = "16px Arial";
          ctx.fillStyle = "red"; 
       ctx.fillText(Math.floor(object.HP), object.x, y);
       ctx.restore();
    return
    }



  

  const width = 40;
 

  const x = object.x - width / 2;
  //const y = object.y - 30;
  

  // 限制範圍（0~100）
  const value = Math.max(0, Math.min(100, drawType));

  const percent = value / 100;
  

  

  // 背景（灰底）
  ctx.fillStyle = '#444';
  ctx.fillRect(x, y, width, height);

  // 顏色（隨飢餓變化）
  let color = '#4caf50'; // 綠（不餓）

  
  if (percent < 0.3) color = '#f44336'; // 紅（很餓）
  if (type=='energy' ) color = '#ffc107'; // 黃
/*
  // 前景（飢餓值）
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * percent, height);

  // 外框（可選）
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x, y, width, height);
*/
 // 外框（可選）
  roundRect(x, y, width, height, 3);
ctx.fillStyle = '#444';
ctx.fill();
 // 前景（飢餓值）
roundRect(x, y, width * percent, height, 3);
ctx.fillStyle = color;
ctx.fill();

  ctx.restore();
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/*
foods.push({
  x: e.clientX,
  y: e.clientY,
  type: Math.random() > 0.5 ? 'food' : 'fish',
  eaten: false
});
*/
function randomFacetext(){
  warFace=[

 '⋛⋋( ‘Θ’)⋌⋚',
 '▼・ᴥ・▼',
 '/ᐠ .ᆺ. ᐟ\\ﾉ',
 '/ᐠ｡ꞈ｡ᐟ\\',
 'ฅ^•ﻌ•^ฅ',
 'Ꮚ･ꈊ･Ꮚ',
 
 '(′゜ω。‵)',
 '(つ´ω`)つ',
 '⧸⎩⎠⎞͏(・∀・)⎛͏⎝⎭⧹',
 '( ˊ̱˂˃ˋ̱ )',
 '(ꐦ°᷄д°᷅)',
 '⁽⁽٩(๑˃̶͈̀ ᗨ ˂̶͈́)۶⁾⁾',
 '⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄',
 '⸜(* ॑꒳ ॑* )⸝',
 '(◉３◉)',
 '(ノ▼Д▼)ノ',
 '(=^-ω-^=)',
 '(╯✧∇✧)╯',
 '_(┐ ◟;ﾟдﾟ)ノ',

 '(｡・ω・｡)',
 
 '(つд⊂)',
 '∑(✘Д✘๑ )',
 '(•ө•)',
 
 '(灬ºωº灬)',
 'ლ(́◕◞౪◟◕‵ლ)',


 '٩(◦`꒳´◦)۶',
 '(๑¯∀¯๑)',
 '(ΦωΦ)',
 '( ╯' - ')╯ ┻━┻',
 '༼ つ ◕_◕ ༽つ',
 '( ﾒ∀・)',
 '⊙谷⊙',
 '(╬▼дﾟ)▄︻┻┳═一',
 '(:◎)≡',
 
 'σ`∀´)σ',
 '（’へ’）',
 'ヽ( ° ▽°)ノ',
 '(☍﹏⁰)'
  ]
  
  return warFace[getRandomInt(warFace.length-1)]
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function monstersHPdown(){
      monsters.forEach(mouse => {
        mouse.HP-=5;
})
}
//

//原本的食物
canvas.addEventListener('click', (e) => {
    if (monsters.length>2) {
      monstersHPdown()
        //所有老鼠生命-1
   // })
    // coinCreat(0,e.clientX,e.clientY)
    }else if (foods.length>50 ) {
       coinCreat(0,e.clientX,e.clientY)
      /*
      foods.forEach(f => {
       // console.log(f)
       coinCreat(0,f.x,f.y);
      })
*/
     // foods=[]

    }else{
  foodCreat(e.clientX,e.clientY)
  
  //console.log(e.clientX,e.clientY)
  //petCreat()
  //coinCreat()
  //console.log(foods)
  }
  //
});
//
/*
monsters.push({
  type:'mouse',
  x: PADDING.width + Math.random() * (canvas.width - PADDING.width * 2),
  y: PADDING.height + Math.random() * (canvas.height - PADDING.height * 2),
  vx: 0,
  vy: 0,
  targetX: 0,
  targetY: 0,
  state: 'idle',
  timer: 0,
  dir: 1,
  walkCycle: 0,
  tailTime: 0,
  hungry:30,
  energy:0

  });
  */
//

//睏鼠
canvas.style.touchAction = 'none'; // 手機沒加沒法滑圖
canvas.addEventListener('pointerdown', (e) => {
  drawing = true;
  currentPath = [];
  path=[]
});

canvas.addEventListener('pointermove', (e) => {
  if (!drawing) return;

  currentPath.push({
    x: e.clientX,
    y: e.clientY
  });

 if (currentPath.length != 0) {
     path = {
      points: currentPath,
      life: drawPathTime
    };
    paths.push(path);  
  }

});

canvas.addEventListener('pointerup', () => {
  drawing = false;
if (currentPath.length > 10 && gameStart) {
  checkTrap(path); // 🔥 判斷圈
   
  }
  
});

function isClosed(path) {
  const last = path.points[path.points.length - 1];

  for (let i = 0; i < path.points.length - 10; i++) {
    const p = path.points[i];

    const dx = last.x - p.x;
    const dy = last.y - p.y;

    if (Math.hypot(dx, dy) < 30) {
      console.log('算閉合')
      return true;
      
    }
  }

  return false;
}



function getBounds(points) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  points.forEach(p => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });

  return { minX, maxX, minY, maxY };
}

function checkTrap(path) {
  //console.log('1')
  if (!isClosed(path)){ 
    return};
//console.log('3')
  const box = getBounds(path.points);

  monsters.forEach(m => {
    //console.log('1')
    if (
      m.x > box.minX &&
      m.x < box.maxX &&
      m.y > box.minY &&
      m.y < box.maxY
    ) {
      m.trapped = true;
      m.trapTimer = drawPathTime;
    }
  });
}



function drawPaths() {
  ctx.save();

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.6)';

  paths.forEach(path => {
    ctx.beginPath();

    path.points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.stroke();
  });

  ctx.restore();
}

function updatePaths() {
  paths.forEach(p => {
    p.life--;
  });

  for (let i = paths.length - 1; i >= 0; i--) {
    if (paths[i].life <= 0) {
      paths.splice(i, 1);
    }
  }
}
//

function foodCreat(x,y){
    if (x && y){
        x=x
        y=y
    }else{
        x=Math.random() * canvas.width +PADDING.width
        y=Math.random() * canvas.height+PADDING.height
    }

    if (foods.length<maxFoodNum) {
         foods.push({
    x: x ,
    y: y ,
    type: Math.random() > 0.5 ? 'food' : 'fish',
    eaten: false
  });
    }
}

function petCreat(){
    c={
  type:'cat',
  
  x: PADDING.width + Math.random() * (canvas.width - PADDING.width * 2),
  y: PADDING.height + Math.random() * (canvas.height - PADDING.height * 2),
  vx: 0,
  vy: 0,
  targetX: 0,
  targetY: 0,
  state: 'idle',
  timer: 0,
  creatCDtimer:10,
  dir: 1,
  walkCycle: 0,
  tailTime: 0,
  hungry:30,
  energy:0,
  power:1,
  tail_type:rank
  }
  if (monsters.length>0) {
     c.face=randomFacetext()
     c.power=catPower
  }
pets.push(c);
}

//
monsters.push({
  type:'mouse',
  x: PADDING.width + Math.random() * (canvas.width - PADDING.width * 2),
  y: PADDING.height + Math.random() * (canvas.height - PADDING.height * 2),
  vx: 0,
  vy: 0,
  targetX: 0,
  targetY: 0,
  state: 'idle',
  timer: 0,
  dir: 1,
  walkCycle: 0,
  tailTime: 0,
  hungry:30,
  energy:0,
  HP:10+level+pets.length+1*rank
});
//
function monsterCreat(hp){
  if (hp) {
    hp=hp
  }else{
    hp=10
  }
  console.log('建立',hp)
d={
  HP:hp,
  type:'mouse',
  x: PADDING.width + Math.random() * (canvas.width - PADDING.width * 2),
  y: PADDING.height + Math.random() * (canvas.height - PADDING.height * 2),
  vx: 0,
  vy: 0,
  targetX: 0,
  targetY: 0,
  state: 'idle',

  }

 monsters.push(d);
  console.log(monsters)
}
//
//petCreat();

function coinCreat(cat,x,y){
if (x && y){
        x=x
        y=y
    }else if (cat){
  x= cat.x
    y= cat.y
    }
    else{
        x=Math.random() * canvas.width +PADDING.width
        y=Math.random() * canvas.height+PADDING.height
    }
coins.push({
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 4,
    vy: -5,
    gravity: 0.4,
    bounce: 0.5,
    state: 'drop', // drop → idle → fly
    timer: 0,
    time: 0
  });

}
//socore effict

//

//eat

function drawCatStatus(pets){
    pets.forEach(cat => {
drawHungry(cat,'hungry')
drawHungry(cat,'energy')
})}

function drawMousesStatus(monsters){
    monsters.forEach(mouse => {
drawHungry(mouse,'HP')
})}

function drawFoodmain(){
    
    i=0;
  foods.forEach(food => {
    i++
    if (i>49) {
        return
    }
  if (food.eaten) return;

  if (food.type === 'fish') {
    drawFishBone(food);
  } else {
    drawFood(food);
  }
});
i=0
//
  coins.forEach(coin => {
  //if (coin.eaten) return;
    i++
    if (i>49) {
        return
    }else{
      drawCoin(coin);
    }

  
});

//
}

function petCrontol(){
    if (pets.length==0){
    petCreat();
   level-=1
   if (rank>1) {rank-=1}
   
}
if (monsters.length==0) {canCreatMonster=1}
}

function animate() {
  
  if (gameStart) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  petCrontol();
  update(pets);
  updatePaths()
  updateMouse(monsters,pets)
  updateCoins();
  
  drawCat(pets);
  drawCatStatus(pets);
  drawPaths();
  drawMousesStatus(monsters);
  drawMouse(monsters)
  drawFoodmain(); 
  drawTopHUD();
  
  
  }else{
   // updatePaths()
    drawPaths();
  }
  anid=requestAnimationFrame(animate);
}
changeState(pets);
anid=''
animate();
console.log('開始繪製',anid)
})();