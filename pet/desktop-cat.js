(function () {
  if (window.__Desktop_Cat__) return;
  window.__Desktop_Cat__ = true;
const catCanvas = document.createElement('canvas');
catCanvas.id='canvas'
//document.getElementsByTagName('body')[0].appendChild(catCanvas);
document.getElementsByTagName('body')[0].prepend(catCanvas);
const canvas = catCanvas
const ctx = canvas.getContext('2d');

//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

canvas.width = window.innerWidth;
canvas.height = '150';
//canvas.height = window.innerHeight;
const foods = [];
const coins = [];
pets=[];
monsters=[]

let score = 0;
let maxOwnPets=11


// UI 位置（右上角）
const UI_POS = {
  x: canvas.width - 60,
  y: 40
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
     console.log('食物',foods.length,'個')
  }

  if (f < 0.001 && pets.length>5) {
    monsterCreat();
    console.log('怪物',monsters.length,'個')
  }
   
 //console.log(f)
})}

function update(pets) {
    pets.forEach(cat => {
    ///
    if (cat.hungry>60) {
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
      console.log(pets[i],'餓死了')
    }
    if ( pets[i].remove == true) {
        console.log(pets[i],'被殺死了')
        pets.splice(i, 1);
        
    monsters.forEach(mouse => {
        mouse.HP--;
        //所有老鼠生命-1
    })

    


        }
  }

  for (let i = monsters.length - 1; i >= 0; i--) {
    if (monsters[i].HP<1) {
       console.log(monsters[i],'老鼠死了')
       
      for (let index = 0; index < maxOwnPets*3; index++) {
       foodCreat();
      }
      monsters.splice(i, 1);
    }
  }
  
if (score>2 && pets.length<maxOwnPets) {
    petCreat();
    score=0;
}

if (score>50 ) {
    score=0;
    monsterCreat();
}




}

//mouse system
function updateMouse(monsters, cats) {
    monsters.forEach(mouse => {
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

    mouse.x += dx * 0.02;
    mouse.y += dy * 0.02;

    mouse.dir = dx > 0 ? 1 : -1;

    // 碰到貓 → 清除
    if (minDist < 20) {
      nearest.remove = true;
    }
  }})
}
//

function drawCat(pets) {
    pets.forEach(cat => {
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
ctx.arc(headX, headY, 12, 0, Math.PI*2);
ctx.stroke();
  } else {
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
  } else {
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
  let baseX = -20;
  let baseY = 5;

  for (let i=0;i<3;i++) {
    const wave = Math.sin(cat.tailTime + i*0.5) * 5;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(baseX - 10, baseY - 10 + wave);
    ctx.stroke();
    baseX -= 10;
    baseY -= 10;
  }

  // 睡覺 Z
  if (cat.state === 'sleep') {
    ctx.fillText('Z', 40, -20);
  }

  ctx.restore();
})
}



//mouse
function drawMouse(monsters) {
    monsters.forEach(mouse => {
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

  ctx.fillText('🪙 ' + score, canvas.width - 20, 40);

  ctx.restore();
}
//

function drawHungry(object,type) {
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
         y = object.y - 30;
        drawType=object.HP*10
        height=6;
    }

  const width = 40;
 

  const x = object.x - width / 2;
  //const y = object.y - 30;
  

  // 限制範圍（0~100）
  const value = Math.max(0, Math.min(100, drawType));
  const percent = value / 100;

  ctx.save();

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



canvas.addEventListener('click', (e) => {
    if (monsters.length>0) {
        monsters.forEach(mouse => {
        mouse.HP-=5;
        //所有老鼠生命-1
    })
    }else{
  foods.push({
    x: e.clientX,
    y: e.clientY,
    type: Math.random() > 0.5 ? 'food' : 'fish',
    eaten: false
  });
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

function foodCreat(){
      foods.push({
    x: Math.random() * canvas.width +PADDING.width ,
    y: Math.random() * canvas.height+PADDING.height ,
    type: Math.random() > 0.5 ? 'food' : 'fish',
    eaten: false
  });
}

function petCreat(){
      pets.push({
  type:'cat',
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
  HP:10});
//
function monsterCreat(){
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
  HP:10

  });
  console.log(monsters)
}
//
//petCreat();

function coinCreat(cat){
coins.push({
    x: cat.x,
    y: cat.y,
    vx: (Math.random() - 0.5) * 4,
    vy: -5,
    gravity: 0.4,
    bounce: 0.5,
    state: 'drop', // drop → idle → fly
    timer: 0,
    time: 0
  });

}


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
    drawUI();
  foods.forEach(food => {
  if (food.eaten) return;

  if (food.type === 'fish') {
    drawFishBone(food);
  } else {
    drawFood(food);
  }
});
//
  coins.forEach(coin => {
  //if (coin.eaten) return;

  drawCoin(coin);
});

//
}

function petCrontol(){
    if (pets.length==0){
    petCreat();
   
}
}



function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  petCrontol();
  update(pets);
  updateMouse(monsters,pets)
  //updateCoins();
  updateCoins();
  drawCat(pets);
  drawCatStatus(pets);
  drawMousesStatus(monsters);
  drawMouse(monsters)
    drawFoodmain();
  requestAnimationFrame(animate);
}

changeState(pets);
animate();
})();