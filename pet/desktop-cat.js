(function () {
  if (window.__Desktop_Cat__) return;
  window.__Desktop_Cat__ = true;
const catCanvas = document.createElement('canvas');
catCanvas.id='canvas'
//document.getElementsByTagName('body')[0].appendChild(catCanvas);
document.getElementsByTagName('body')[0].prepend(catCanvas);
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

canvas.width = window.innerWidth;
canvas.height = '150';


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

const cat = {
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
  tailTime: 0
};

function changeState() {
  const r = Math.random();
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
  }
}

function update() {
  cat.timer--;
  if (cat.timer <= 0) changeState();

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
}

function drawCat() {
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
  ctx.beginPath();
  ctx.arc(25, -5, 12, 0, Math.PI*2);
  ctx.stroke();

    num=1
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
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  update();
  drawCat();
  requestAnimationFrame(animate);
}

changeState();
animate();
})();