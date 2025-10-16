/* background.js — responsive canvas + theme sync + touch support */

// elements
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const container = document.querySelector('.container');
const body = document.body;

// create canvas and context
const canvas = document.createElement('canvas');
canvas.id = 'bg';
const ctx = canvas.getContext('2d');
body.prepend(canvas);

// device pixel ratio support
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', () => {
  resizeCanvas();
  adaptBallsToScreen(); // recalc balls when resize
});

// themes mapped to slide order (must match slide order)
const themes = [
  { name: 'red', gradient: ['#ffffff', '#d41212'], ballColor: '#ec3737ff' },
  { name: 'green', gradient: ['#ffffff', '#189952ff'], ballColor: '#278d51ff' },
  { name: 'black', gradient: ['#ffffff', '#0f0f0f'], ballColor: '#444444' }
];

let currentIndex = 0;

// balls array
let balls = [];
let numBalls = 40; // default for desktop

// create balls based on screen size
function adaptBallsToScreen() {
  const w = window.innerWidth;
  if (w <= 420) numBalls = 18;
  else if (w <= 900) numBalls = 28;
  else numBalls = 40;

  if (balls.length !== numBalls) {
    createBalls(themes[currentIndex].ballColor);
  }
}

function createBalls(color) {
  balls = [];
  for (let i = 0; i < numBalls; i++) {
    balls.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * (window.innerWidth <= 420 ? 10 : 10) + (window.innerWidth <= 420 ? 3 : 5),
      dx: (Math.random() - 0.5) * (window.innerWidth <= 420 ? 2 : 3),
      dy: (Math.random() - 0.5) * (window.innerWidth <= 420 ? 7 : 9),
      color: color
    });
  }
}

function drawBackground(gradientColors) {
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);

  const grad = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) * 0.05,
    w / 2, h / 2, Math.max(w, h) * 0.8
  );
  grad.addColorStop(0, gradientColors[0]);
  grad.addColorStop(1, gradientColors[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawBalls() {
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);
  balls.forEach(b => {
    ctx.beginPath();
    let x = (b.x / (window.devicePixelRatio || 1));
    let y = (b.y / (window.devicePixelRatio || 1));
    ctx.arc(x, y, b.r, 0, Math.PI * 2);

    ctx.fillStyle = b.color;
    ctx.shadowBlur = Math.max(8, b.r * 3);
    ctx.shadowColor = b.color;
    ctx.fill();

    b.x += b.dx;
    b.y += b.dy;

    if ((b.x / (window.devicePixelRatio || 1)) < 0 || (b.x / (window.devicePixelRatio || 1)) > w) b.dx *= -1;
    if ((b.y / (window.devicePixelRatio || 1)) < 0 || (b.y / (window.devicePixelRatio || 1)) > h) b.dy *= -1;
  });
}

function animate() {
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);
  ctx.clearRect(0, 0, w, h);
  drawBackground(themes[currentIndex].gradient);
  drawBalls();
  requestAnimationFrame(animate);
}

function applyTheme(index) {
  currentIndex = index;
  const theme = themes[index];
  container.style.backgroundImage = `radial-gradient(circle at center, ${theme.gradient[0]}, ${theme.gradient[1]})`;
  document.body.style.background = `radial-gradient(circle at center, ${theme.gradient[0]}, ${theme.gradient[1]})`;
  createBalls(theme.ballColor);
}

nextBtn.onclick = function(){
  let lists = document.querySelectorAll('.item');
  document.getElementById('slide').appendChild(lists[0]);
  currentIndex = (currentIndex + 1) % themes.length;
  applyTheme(currentIndex);
}
prevBtn.onclick = function(){
  let lists = document.querySelectorAll('.item');
  document.getElementById('slide').prepend(lists[lists.length - 1]);
  currentIndex = (currentIndex - 1 + themes.length) % themes.length;
  applyTheme(currentIndex);
}

function addTouchSupport() {
  nextBtn.addEventListener('touchstart', (e) => { e.preventDefault(); nextBtn.click(); }, {passive:false});
  prevBtn.addEventListener('touchstart', (e) => { e.preventDefault(); prevBtn.click(); }, {passive:false});
}

// init
resizeCanvas();
adaptBallsToScreen();
applyTheme(currentIndex);
animate();
addTouchSupport();


// ==================== HOODIE SECTIONS HANDLER ====================

// نجيب جميع أزرار "See More"
const seeMoreButtons = document.querySelectorAll('.see-more-btn');

// نجيب جميع السكاشن ديال الهوديز (عن طريق id اللي كيبدا بـ hoodie)
let hoodieSections = window.hoodieSections || document.querySelectorAll('section[id^="hoodie"]');
window.hoodieSections = hoodieSections;

// نجيب جميع أزرار "Back"
const backButtons = document.querySelectorAll('.back-btn');

// ملي المستخدم يضغط على "See More"
seeMoreButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-hoodie'); // id ديال section
    const section = document.getElementById(target);

    // نخفي أي section مفتوح من قبل
    hoodieSections.forEach(sec => sec.style.display = 'none');

    // نظهر section المطلوب
    section.style.display = 'flex';

    // نوقف الخلفية مؤقتاً ببلور
    container.style.filter = 'blur(10px)';
  });
});

// ملي يضغط المستخدم على زر "Back"
backButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    hoodieSections.forEach(sec => sec.style.display = 'none');
    container.style.filter = 'none'; // نرجع الخلفية عادية
  });
});

// ==================== CATEGORY SECTION HANDLER ====================

// الزر فالمينو اللي فيه data-section="category"
const categoryBtn = document.querySelector('[data-section="category"]');
const categorySection = document.getElementById('category');

// ملي كنديرو click على CATEGORY
if (categoryBtn) {
  categoryBtn.addEventListener('click', () => {
    // نخفي السلايدر
    container.style.display = 'none';

    // نخفي أي hoodie section مفتوح
    hoodieSections.forEach(sec => sec.style.display = 'none');

    // نعرض السيكشن ديال الكاتيجوري
    categorySection.style.display = 'flex';
  });
}

// زر الرجوع من الكاتيجوري
if (categorySection) {
  categorySection.querySelector('.back-btn').addEventListener('click', () => {
    categorySection.style.display = 'none';
    container.style.display = 'block';
  });
}
