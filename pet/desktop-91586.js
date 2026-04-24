(function () {
  if (window.__Desktop_91586__) return;
  window.__Desktop_91586__ = true;
const catCanvas = document.createElement('canvas');
catCanvas.id='canvas'
//document.getElementsByTagName('body')[0].appendChild(catCanvas);
document.getElementsByTagName('body')[0].prepend(catCanvas);
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

canvas.height = '150';



// === 載入圖片 ===
const sprite = new Image();
sprite.src = '../pet/image/91586-maplestory.png';

const FRAME_W = 135;
const FRAME_H = 130;

// === 動畫設定 ===

const animations = {
  idle:  { row: 1, frames: 2, speed: 0.05 },
  walk:  { row: 1, frames: 5, speed: 0.1 },
  sleep: { row: 1, frames: 2, speed: 0.05 }
};

// === 貓 ===
const cat = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  targetX: 0,
  targetY: 0,
  state: 'idle',
  timer: 0,
  dir: 1,
  frame: 0
};

// === 狀態切換 ===
function changeState() {
  const r = Math.random();

  if (r < 0.5) {
    cat.state = 'walk';
    cat.targetX = randX();
    cat.targetY = randY();
    cat.timer = 200;
  } else if (r < 0.8) {
    cat.state = 'idle';
    cat.timer = 120;
  } else {
    cat.state = 'sleep';
    cat.timer = 200;
  }

  cat.frame = 0; // 重置動畫
}

// === 邊界內隨機 ===
const PADDING = 80;

function randX() {
  return PADDING + Math.random() * (canvas.width - PADDING * 2);
}
function randY() {
  return PADDING + Math.random() * (canvas.height - PADDING * 2);
}

// === 更新 ===
function update() {
  cat.timer--;
  if (cat.timer <= 0) changeState();

  if (cat.state === 'walk') {
    const dx = cat.targetX - cat.x;
    const dy = cat.targetY - cat.y;

    cat.vx += dx * 0.002;
    cat.vy += dy * 0.002;
  }

  // 慣性
  cat.vx *= 0.92;
  cat.vy *= 0.92;

  cat.x += cat.vx;
  cat.y += cat.vy;

  // 邊界限制
  cat.x = Math.max(PADDING, Math.min(canvas.width - PADDING, cat.x));
  cat.y = Math.max(PADDING, Math.min(canvas.height - PADDING, cat.y));

  // 方向
  if (Math.abs(cat.vx) > 0.1) {
    //cat.dir = cat.vx > 0 ? 1 : -1;
    cat.dir = cat.vx > 0 ? -1 : 1;
  }

  // 動畫更新
  const anim = animations[cat.state];
  cat.frame += anim.speed;

  if (cat.frame >= anim.frames) {
    cat.frame = 0;
  }
}

// === 畫 ===
function draw() {
  ctx.save();

  ctx.translate(cat.x, cat.y);
  ctx.scale(cat.dir, 1);

  // 呼吸（idle/sleep）
  if (cat.state !== 'walk') {
    const breathe = Math.sin(Date.now() * 0.002) * 2;
    ctx.translate(0, breathe);
  }


  //const img = assets[cat.state];



const anim = animations[cat.state];
const frameIndex = Math.floor(cat.frame);

ctx.drawImage(
  sprite,
  frameIndex * FRAME_W,          // x
  anim.row * FRAME_H,            // y（關鍵差別）
  FRAME_W,
  FRAME_H,
  -FRAME_W/2,
  -FRAME_H/2,
  FRAME_W,
  FRAME_H
);

  ctx.restore();
}

// === loop ===
function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  update();
  draw();
  requestAnimationFrame(loop);
}

// === 等圖片載入 ===
sprite.onload = () => {
  changeState();
  loop();
};
})();