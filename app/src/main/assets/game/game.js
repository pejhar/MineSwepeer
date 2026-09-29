// =====================================================
// Hormuz Minesweeper
// Final Version
// Part 1 / 5
// Difficulty + Map Engine + Water Detection + Hex Grid
// Long Press Fixed Version
// =====================================================

// =====================================================
// Difficulty Buttons
// =====================================================

let eventController = null;

// =====================================================
// Difficulty Settings
// =====================================================

const DIFFICULTIES = {

    easy:{
        mines:10,
        image:"assets/easy.png"
    },


    medium:{
        mines:15,
        image:"assets/medium.png"
    },


    hard:{
        mines:25,
        image:"assets/hard.png"
    }

};

const difficultyButton = document.getElementById("difficulty-btn");
const difficultyImage = document.getElementById("difficulty-image");


function updateDifficultyButton(){

    if(!difficultyImage) return;


    difficultyImage.src =
    DIFFICULTIES[currentDifficulty].image;


    if(difficultyButton){
        difficultyButton.dataset.level = currentDifficulty;
    }

}

let difficultyIndex = 1;
let currentDifficulty = "medium";
let MINE_COUNT = DIFFICULTIES.medium.mines;

// =====================================================
// Map Assets
// =====================================================

const mapImage = new Image();

mapImage.src = "assets/map.png";

const maskImage = new Image();

maskImage.src = "assets/water_mask.png";

const mapCanvas = document.createElement("canvas");

const mapContext = mapCanvas.getContext("2d", {
  willReadFrequently: true,
});

let MAP_WIDTH = 0;

let MAP_HEIGHT = 0;

// =====================================================
// Board Data
// =====================================================

let board = [];

let cellIdCounter = 0;

// =====================================================
// Water Detection
// =====================================================

// Black = water
// White = land

function isWaterPixel(x, y) {
  x = Math.round(x);
  y = Math.round(y);

  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
    return false;
  }

  const pixel = mapContext.getImageData(x, y, 1, 1).data;

  return pixel[0] < 128;
}

function isWaterAt(centerX, centerY, radius) {
  let water = 0;

  let total = 0;

  const step = Math.max(1, Math.floor(radius / 3));

  for (let dy = -radius; dy <= radius; dy += step) {
    for (let dx = -radius; dx <= radius; dx += step) {
      if (dx * dx + dy * dy > radius * radius) {
        continue;
      }

      total++;

      if (isWaterPixel(centerX + dx, centerY + dy)) {
        water++;
      }
    }
  }

  return total > 0 && water / total >= 0.38;
}

// =====================================================
// Hex Settings
// =====================================================

const TARGET_HEX_SIZE_NATURAL = 40;

let HEX_SIZE_NAT = 0;

let HEX_WIDTH_NAT = 0;

let HEX_HEIGHT_NAT = 0;

let VERTICAL_SPACING_NAT = 0;

function calculateNaturalHexSize() {
  HEX_SIZE_NAT = TARGET_HEX_SIZE_NATURAL;

  HEX_WIDTH_NAT = HEX_SIZE_NAT * Math.sqrt(3);

  HEX_HEIGHT_NAT = HEX_SIZE_NAT * 2;

  VERTICAL_SPACING_NAT = HEX_HEIGHT_NAT * 0.75;
}

// =====================================================
// Coordinate Convert
// =====================================================

function naturalToScreen(nx, ny) {
  const map = document.getElementById("sea-map");

  if (!map) {
    return {
      x: 0,
      y: 0,
    };
  }

  const scaleX = map.clientWidth / MAP_WIDTH;

  const scaleY = map.clientHeight / MAP_HEIGHT;

  return {
    x: nx * scaleX,

    y: ny * scaleY,
  };
}

// =====================================================
// Build Hex Grid From Water Mask
// =====================================================

function buildHexGridFromMask() {
  board = [];

  cellIdCounter = 0;

  calculateNaturalHexSize();

  const HEX_GAP = 8;

  const stepX = HEX_WIDTH_NAT + HEX_GAP;

  const stepY = VERTICAL_SPACING_NAT + HEX_GAP * 0.75;

  const radius = HEX_SIZE_NAT * 0.52;

  let row = 0;

  for (let y = stepY * 0.5; y < MAP_HEIGHT + stepY; y += stepY, row++) {
    const offsetX = row % 2 === 1 ? stepX * 0.5 : 0;

    for (let x = stepX * 0.5 + offsetX; x < MAP_WIDTH + stepX; x += stepX) {
      if (isWaterAt(x, y, radius)) {
        board.push({
          id: cellIdCounter++,

          naturalX: x,

          naturalY: y,

          mine: false,

          number: 0,

          open: false,

          flag: false,

          exploded: false,

          element: null,

          neighbors: [],
        });
      }
    }
  }

  console.log("Water hexes:", board.length);
}

// =====================================================
// Build Hex Neighbors
// =====================================================

function buildNeighbors() {
  const maxDist = HEX_WIDTH_NAT * 1.18;

  for (let i = 0; i < board.length; i++) {
    const a = board[i];

    a.neighbors = [];

    for (let j = 0; j < board.length; j++) {
      if (i === j) continue;

      const b = board[j];

      const dx = a.naturalX - b.naturalX;

      const dy = a.naturalY - b.naturalY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDist) {
        a.neighbors.push(b);
      }
    }
  }
}

// =====================================================
// Hormuz Minesweeper
// Final Version
// Part 2 / 5
// Resize + CSS + Game State + Board HTML
// =====================================================

// =====================================================
// Resize Board
// =====================================================

function resizeBoard() {
  const map = document.getElementById("sea-map");

  const boardEl = document.getElementById("board");

  if (!map || !boardEl) {
    return;
  }

  boardEl.style.width = map.clientWidth + "px";

  boardEl.style.height = map.clientHeight + "px";

  boardEl.style.left = map.offsetLeft + "px";

  boardEl.style.top = map.offsetTop + "px";

  boardEl.style.position = "absolute";

  boardEl.style.overflow = "hidden";

  const scale = map.clientWidth / MAP_WIDTH;

  const displayWidth = HEX_WIDTH_NAT * scale;

  const displayHeight = HEX_HEIGHT_NAT * scale;

  board.forEach((cell) => {
    if (!cell.element) return;

    const screen = naturalToScreen(cell.naturalX, cell.naturalY);

    cell.element.style.width = displayWidth + "px";

    cell.element.style.height = displayHeight + "px";

    cell.element.style.left = screen.x - displayWidth / 2 + "px";

    cell.element.style.top = screen.y - displayHeight / 2 + "px";
  });
}

window.addEventListener("resize", resizeBoard);

// =====================================================
// Inject Styles
// =====================================================

function injectStyles() {
  if (document.getElementById("minesweeper-styles")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "minesweeper-styles";

  style.textContent = `


#board{

    position:absolute;

    z-index:10;

    pointer-events:none;

}





.hex{


    position:absolute;


    display:flex;


    align-items:center;


    justify-content:center;



    font-weight:700;



    font-size:
    clamp(
        10px,
        1.4vw,
        14px
    );



    color:white;



    cursor:pointer;



    user-select:none;



    touch-action:none;



    clip-path:
    polygon(

        50% 0%,

        100% 25%,

        100% 75%,

        50% 100%,

        0% 75%,

        0% 25%

    );



    background:
    rgba(
        20,
        58,
        94,
        .35
    );



    box-shadow:

    0 0 0 2px
    rgba(
        0,
        200,
        255,
        .85
    ),


    0 0 8px
    rgba(
        0,
        180,
        255,
        .45
    );



    pointer-events:auto;



    -webkit-tap-highlight-color:
    transparent;



    transition:

    transform .1s,

    filter .1s;


}





.hex:hover{


    transform:
    scale(1.05);



    filter:
    brightness(1.3);



}




.hex.open{


    background:
    rgba(
        184,
        142,
        102,
        .35
    );



    cursor:default;



}





.hex.flagged{


    box-shadow:


    0 0 0 2.5px
    rgba(
        255,
        70,
        70,
        .9
    ),


    0 0 10px
    rgba(
        255,
        80,
        80,
        .5
    );


}





.mine-icon{


    width:60%;


    height:60%;


    object-fit:contain;


    pointer-events:none;


}





.boom{


    font-size:
    40px;


}





.number-1{

color:#ffffff;

text-shadow:
0 0 4px black;

}



.number-2{

color:#b2ff59;

text-shadow:
0 0 4px black;

}



.number-3{

color:#ff8a80;

text-shadow:
0 0 4px black;

}



.number-4{

color:#ea80fc;

text-shadow:
0 0 4px black;

}



.number-5{

color:#ffd740;

text-shadow:
0 0 4px black;

}



.number-6{

color:#80d8ff;

text-shadow:
0 0 4px black;

}




.diff-btn{


padding:
6px 14px;



margin:
0 4px;



border:
0;



border-radius:
8px;



background:
#01579b;



color:white;



cursor:pointer;


}




.diff-btn.active{


background:
#0288d1;



box-shadow:
0 0 0 2px #4fc3f7;



}



`;

  document.head.appendChild(style);
}

// =====================================================
// Game State
// =====================================================

let gameOver = false;

let gameStarted = false;

let gameFinished = false;

let flagsUsed = 0;

let timer = 0;

let timerInterval = null;

// =====================================================
// Sounds
// =====================================================

const clickSound = new Audio("assets/sounds/click.mp3");

const boomSound = new Audio("assets/sounds/boom.mp3");

const winSound = new Audio("assets/sounds/win.mp3");

const oceanSound = document.getElementById("oceanSound");

oceanSound.loop = true;
oceanSound.volume = 0.35;

const boardElement = document.getElementById("board");

function canPlay() {
  return !gameFinished;
}

// =====================================================
// Create Board HTML
// =====================================================

function createBoardHTML() {
  if (!boardElement) return;

  boardElement.innerHTML = "";

  const map = document.getElementById("sea-map");

  const scale = map.clientWidth / MAP_WIDTH;

  const displayWidth = HEX_WIDTH_NAT * scale;

  const displayHeight = HEX_HEIGHT_NAT * scale;

  board.forEach((cell) => {
    const el = document.createElement("div");

    el.className = "hex";

    el.dataset.id = cell.id;

    const screen = naturalToScreen(cell.naturalX, cell.naturalY);

    el.style.width = displayWidth + "px";

    el.style.height = displayHeight + "px";

    el.style.left = screen.x - displayWidth / 2 + "px";

    el.style.top = screen.y - displayHeight / 2 + "px";

    cell.element = el;

    boardElement.appendChild(el);
  });
}

// =====================================================
// Initialize Board
// =====================================================

function initBoard() {
  buildHexGridFromMask();

  buildNeighbors();

  createBoardHTML();
}

// =====================================================
// Hormuz Minesweeper
// Final Version
// Part 3 / 5
//
// =====================================================

// =====================================================
// Mines Engine
// =====================================================

function placeMines() {
  if (board.length < MINE_COUNT) {
    console.error("Water cells are not enough:", board.length);

    return;
  }

  // Shuffle board

  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [board[i], board[j]] = [board[j], board[i]];
  }

  // Put mines

  for (let i = 0; i < MINE_COUNT; i++) {
    board[i].mine = true;
  }

  console.log("Mines placed:", MINE_COUNT);
}

// =====================================================
// Numbers Engine
// =====================================================

function calculateNumbers() {
  board.forEach((cell) => {
    if (cell.mine) {
      cell.number = -1;

      return;
    }

    let count = 0;

    cell.neighbors.forEach((n) => {
      if (n.mine) count++;
    });

    cell.number = count;
  });
}

// =====================================================
// Render Engine
// =====================================================

function renderCell(cell) {
  const el = cell.element;

  if (!el) return;

  el.innerHTML = "";

  el.className = "hex";

  if (cell.flag) {
    el.classList.add("flagged");

    const img = document.createElement("img");

    img.src = "assets/flag.png";

    img.className = "mine-icon";

    el.appendChild(img);

    return;
  }

  if (!cell.open) {
    return;
  }

  el.classList.add("open");

  if (cell.exploded) {
    el.innerHTML = `
            <span class="boom">
            💥
            </span>
            `;

    return;
  }

  if (cell.mine) {
    const img = document.createElement("img");

    img.src = "assets/mine.png";

    img.className = "mine-icon";

    el.appendChild(img);

    return;
  }


    // =====================================================
    // COLORED DOTS
    // =====================================================

    if (cell.number > 0) {

        const dots = document.createElement("div");

        dots.className = "mine-dots";


        // -------------------------------------------------
        // تعیین رنگ بر اساس تعداد مین‌های اطراف
        // -------------------------------------------------

        let dotClass = "low";

        if (cell.number <= 2) {

            dotClass = "low";

        } else if (cell.number <= 4) {

            dotClass = "medium";

        } else if (cell.number <= 6) {

            dotClass = "high";

        } else {

            dotClass = "danger";
        }


        // -------------------------------------------------
        // ساخت نقطه‌ها
        // -------------------------------------------------

        for (let i = 0; i < cell.number; i++) {

            const dot = document.createElement("span");

            dot.className = "mine-dot " + dotClass;

            dots.appendChild(dot);
        }


        el.appendChild(dots);
    }
}

function renderBoard() {
  board.forEach((cell) => {
    renderCell(cell);
  });
}

// =====================================================
// Reveal Mines
// =====================================================

function revealAllMines() {
  board.forEach((cell) => {
    if (cell.mine) {
      cell.open = true;
    }
  });

  renderBoard();
}

// =====================================================
// Open Cell
// =====================================================

function openCellById(id) {
  const cell = board.find((c) => c.id === id);

  if (!cell || !canPlay()) {
    return;
  }

  if (cell.open || cell.flag) {
    return;
  }

  if (!gameStarted) {
    startGame();
  }

  cell.open = true;

  if (cell.mine) {
    cell.exploded = true;

    if (boomSound) {
      boomSound.currentTime = 0;

      boomSound.play().catch(() => {});
    }

    gameLose();

    return;
  }

  if (cell.number === 0) {
    floodFill(cell);
  }

  renderCell(cell);

  checkWin();

  if (clickSound) {
    clickSound.currentTime = 0;

    clickSound.play().catch(() => {});
  }
}

// =====================================================
// Flood Fill
// =====================================================

function floodFill(cell) {
  cell.neighbors.forEach((n) => {
    if (n.open || n.mine || n.flag) {
      return;
    }

    n.open = true;

    renderCell(n);

    if (n.number === 0) {
      floodFill(n);
    }
  });
}

// =====================================================
// Hormuz Minesweeper
// Final Version
// Part 4 / 5
// Flags + Win/Lose + Timer + Pointer Long Press
// =====================================================

// =====================================================
// Flag System
// =====================================================

function toggleFlagById(id) {
  const cell = board.find((c) => c.id === id);

  if (!cell || !canPlay() || cell.open) {
    return;
  }

  if (cell.flag) {
    cell.flag = false;

    flagsUsed--;
  } else {
    if (flagsUsed >= MINE_COUNT) {
      return;
    }

    cell.flag = true;

    flagsUsed++;
  }

  renderCell(cell);

  updateMineCounter();
}

function updateMineCounter() {
  const counter = document.getElementById("mine-count");

  if (counter) {
    counter.textContent = MINE_COUNT - flagsUsed;
  }
}

// =====================================================
// Win / Lose
// =====================================================

function triggerExplosionVibration() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(0);
        navigator.vibrate([120, 60, 220, 60, 350]);
    }
}

function gameLose() {

  triggerExplosionVibration();
  if (event && event.target && event.target.closest) { const h=event.target.closest(".hex"); if(h) h.classList.add("explode"); }
  createParticles(false);

  gameFinished = true;

  gameOver = true;

  stopTimer();

  revealAllMines();
  setTimeout(()=>showResult(false), 500);
}

function gameWin() {
  gameFinished = true;
  const isRecord = saveBestTime();
  createParticles(true);

  stopTimer();

  if (winSound) {
    winSound.currentTime = 0;

    winSound.play().catch(() => {});
  }

  const status = document.getElementById("status");

  if (status) { status.classList.toggle("new-record", isRecord); }
  setTimeout(()=>showResult(true, isRecord), 450);
}

function checkWin() {
  if (gameFinished) return;

  let openedSafe = 0;

  board.forEach((cell) => {
    if (cell.open && !cell.mine) {
      openedSafe++;
    }
  });

  if (openedSafe === board.length - MINE_COUNT) {
    gameWin();
  }
}

// =====================================================
// Timer
// =====================================================

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  startTimer();
}

function startTimer() {
  if (oceanSound.paused) {
    oceanSound.play().catch(() => {});
  }

  if (timerInterval) return;

  timerInterval = setInterval(() => {
    timer++;

    updateTimer();
  }, 1000);
}

function updateTimer() {
  const el = document.getElementById("timer");

  if (el) {
    el.textContent = timer;
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);

    timerInterval = null;
  }
}

// =====================================================
// New Pointer Event System
// Replaces touchstart/touchend
// Fix Long Press Bug
// =====================================================

let pressTimer = null;
let longPressed = false;
let pointerTarget = null;

// جدید: متغیر برای جلوگیری از اجرای دوباره toggle
let longPressExecuted = false;

// =====================================================
// Click Event – اصلاح‌شده
// =====================================================
function enableBoardClick() {
  if (!boardElement) return;

  boardElement.addEventListener("click", (e) => {
    // اگر عملیات long press اخیراً اجرا شده، کلیک را نادیده بگیر
    if (longPressExecuted) {
      longPressExecuted = false; // ریست برای دفعات بعد
      return;
    }

    const target = e.target.closest(".hex");
    if (!target) return;
    const id = Number(target.dataset.id);
    if (flagMode) toggleFlagById(id);
    else openCellById(id);
  });
}

// =====================================================
// Right Click (Desktop) – اصلاح‌شده
// =====================================================
function enableRightClick() {
  if (!boardElement) return;

  boardElement.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // جلوگیری از منوی context مرورگر

    // اگر long press قبلاً اجرا شده، از toggle مجدد جلوگیری کن
    if (longPressExecuted) {
      longPressExecuted = false; // ریست
      return;
    }

    const target = e.target.closest(".hex");
    if (!target) return;
    toggleFlagById(Number(target.dataset.id));
  });
}

// =====================================================
// Long Press Mobile – نسخه اصلاح‌شده
// =====================================================
function enableLongPress() {
  if (!boardElement) return;

  boardElement.addEventListener("pointerdown", (e) => {
    const target = e.target.closest(".hex");
    if (!target) return;

    pointerTarget = target;
    longPressed = false;
    longPressExecuted = false; // ریست در شروع

    pressTimer = setTimeout(() => {
      longPressed = true;
      longPressExecuted = true; // علامت‌گذاری که long press اجرا شد
      toggleFlagById(Number(pointerTarget.dataset.id));
      if (navigator.vibrate) {
        navigator.vibrate(40);
      }
    }, 400); // کاهش زمان برای واکنش بهتر
  });

  boardElement.addEventListener("pointerup", () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    pointerTarget = null;
    // توجه: longPressExecuted را اینجا ریست نمی‌کنیم، زیرا ممکن است رویداد click/contextmenu بعدی نیاز به تشخیص داشته باشد
  });

  boardElement.addEventListener("pointercancel", () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    longPressExecuted = false; // ریست در صورت لغو
    pointerTarget = null;
  });

  boardElement.addEventListener("pointermove", () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  });
}

// =====================================================
// Hormuz Minesweeper
// Final Version
// Part 5 / 5
// Start Application + Restart + Service Worker
// =====================================================

// =====================================================
// Difficulty Change
// =====================================================

function setDifficulty(level){

    if(!DIFFICULTIES[level]){
        return;
    }


    currentDifficulty = level;


    MINE_COUNT =
    DIFFICULTIES[level].mines;


    updateDifficultyButton();


    restartGame();

}

// =====================================================
// Start / Restart Game
// =====================================================

async function startApplication() {
  // جلوگیری از چند بار ثبت Event

  if (eventController) {
    eventController.abort();
  }

  eventController = new AbortController();

  console.log("Starting Hormuz Minesweeper...");

  injectStyles();

  // Reset State

  gameFinished = false;

  gameOver = false;

  gameStarted = false;

  flagsUsed = 0;

  timer = 0;

  stopTimer();

  updateTimer();

  updateMineCounter();

  await loadMap();

  initBoard();

  placeMines();

  calculateNumbers();

  renderBoard();

  resizeBoard();

  // Events

  enableBoardClick();

  enableRightClick();

  enableLongPress();

  console.log("Game Ready");
}

function restartGame() {
  stopTimer();

  startApplication();
}

// =====================================================
// Load Map
// =====================================================

function loadMap() {
  return new Promise((resolve) => {
    let loaded = 0;

    const done = () => {
      loaded++;

      if (loaded < 2) {
        return;
      }

      MAP_WIDTH = mapImage.naturalWidth;

      MAP_HEIGHT = mapImage.naturalHeight;

      mapCanvas.width = MAP_WIDTH;

      mapCanvas.height = MAP_HEIGHT;

      mapContext.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

      mapContext.drawImage(maskImage, 0, 0, MAP_WIDTH, MAP_HEIGHT);

      calculateNaturalHexSize();

      resolve();
    };

    mapImage.onload = done;

    maskImage.onload = done;

    if (mapImage.complete && mapImage.naturalWidth) {
      done();
    }

    if (maskImage.complete && maskImage.naturalWidth) {
      done();
    }
  });
}

// =====================================================
// Service Worker
// =====================================================

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => {
        console.log("Service Worker Registered");
      })
      .catch((err) => {
        console.log("SW Error:", err);
      });
  }
}

// =====================================================
// DOM Ready
// =====================================================

function enableDifficultyButton(){

    if(!difficultyButton) return;


    difficultyButton.addEventListener("click",()=>{


        if(currentDifficulty === "easy"){

            setDifficulty("medium");

        }

        else if(currentDifficulty === "medium"){

            setDifficulty("hard");

        }

        else{

            setDifficulty("easy");

        }


    });


}

window.addEventListener("DOMContentLoaded", () => {


    updateDifficultyButton();


    enableDifficultyButton();


    startApplication();


    registerServiceWorker();


});

// ===== Explicit DIG / FLAG mode =====
let flagMode = false;
function applyFlagMode(){
  const b=document.getElementById('flag-mode-btn');
  if(b){ b.classList.toggle('active',flagMode); b.setAttribute('aria-pressed',flagMode?'true':'false'); }
  document.getElementById('board')?.classList.toggle('flag-mode',flagMode);
}
function toggleFlagMode(){ flagMode=!flagMode; applyFlagMode(); if(navigator.vibrate) navigator.vibrate(20); }

// ===== Lightweight polish: sound, pause, records, particles =====
let soundEnabled = localStorage.getItem('hm_sound') !== '0';
let paused = false;
function applySound(){ [clickSound,boomSound,winSound,oceanSound].forEach(a=>{ if(a) a.muted=!soundEnabled; }); const b=document.getElementById('sound-btn'); if(b)b.textContent=soundEnabled?'🔊':'🔇'; }
function toggleSound(){ soundEnabled=!soundEnabled; localStorage.setItem('hm_sound',soundEnabled?'1':'0'); applySound(); if(soundEnabled) oceanSound.play().catch(()=>{}); }
function togglePause(forceClose=false){ const o=document.getElementById('pause-overlay'); if(!o)return; if(forceClose){paused=false;o.classList.add('hidden');} else {paused=!paused; o.classList.toggle('hidden',!paused); if(paused){stopTimer(); renderBestTimes();} else if(gameStarted&&!gameFinished){startTimer();}} const b=document.getElementById('pause-btn'); if(b){b.textContent=paused?'▶':'⏸';b.classList.toggle('active',paused);} }
function bestKey(){return 'hm_best_'+currentDifficulty;}
function saveBestTime(){ const old=Number(localStorage.getItem(bestKey())||0); if(!old||timer<old){localStorage.setItem(bestKey(),String(timer));return true;} return false; }
function renderBestTimes(){ const el=document.getElementById('best-times'); if(!el)return; el.innerHTML=['easy','medium','hard'].map(k=>{let v=localStorage.getItem('hm_best_'+k);return `<div class="best-row"><span>${k.toUpperCase()}</span><b>${v?v+'s':'—'}</b></div>`}).join(''); }
function showResult(win,record=false){const o=document.getElementById('result-overlay');if(!o)return;document.getElementById('result-icon').textContent=win?'🏆':'💥';document.getElementById('result-title').textContent=win?(record?'NEW RECORD!':'YOU WIN!'):'BOOM!';document.getElementById('result-text').textContent=win?`Time: ${timer}s • ${currentDifficulty.toUpperCase()}`:'Try again — the sea is full of surprises.';o.classList.remove('hidden');}
function hideResult(){document.getElementById('result-overlay')?.classList.add('hidden');}
function createParticles(win){const box=document.getElementById('particles');if(!box)return;box.innerHTML='';const n=win?36:22;for(let i=0;i<n;i++){const p=document.createElement('i');p.className='particle';p.style.left='50%';p.style.top='48%';const a=Math.random()*Math.PI*2,d=60+Math.random()*190;p.style.setProperty('--x',Math.cos(a)*d+'px');p.style.setProperty('--y',Math.sin(a)*d+'px');if(!win)p.style.background='#ff6b35';box.appendChild(p);}setTimeout(()=>box.innerHTML='',900);}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&gameStarted&&!gameFinished&&!paused)togglePause();});
window.addEventListener('DOMContentLoaded',()=>{applySound();applyFlagMode();});
