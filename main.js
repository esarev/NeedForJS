'use strict';

const MAX_ENEMY = 7;
const HEIGHT_ELEM = 150;

const score = document.querySelector('.score'),
  startGame = document.querySelector('.gameStart'),
  startLevel = document.querySelector('.levels'),
  areaGame = document.querySelector('.gameArea'),
  car = document.createElement('div'),
  btns = document.querySelectorAll('.btn');
  
const music = document.createElement('embed');

music.src = 'Disturbed.mp3';
car.classList.add('car');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

const setting = {
  start: false,
  score: 0,
  traffic: 5,
  speed: 3,
};

let startSpeed = 0;

const changeLevel = (lvl) => {
  
  switch(lvl) {
    case '1':
      setting.traffic = 5;
      setting.speed = 3;
      break;
    case '2':
      setting.traffic = 4;
      setting.speed = 6;
      break;
    case '3':
      setting.traffic = 4;
      setting.speed = 8;
      break;
  }

  startSpeed = setting.speed;
};

function getQuantityElements(heightElement) {
  return (areaGame.offsetHeight / heightElement) + 1;
}

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);


function start(event) {
  const target = event.target;

  // if(!target.classList.contains('btn')) return;

  const levelGame = target.dataset.levelGame;
  changeLevel(levelGame);

  btns.forEach(btn => btn.disabled = true);
  
  document.body.append(music);

  music.classList.add('visually-hidden');
  score.style.width = 100 + '%';
  areaGame.style.height = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM;
  startGame.classList.add('hide');
  startLevel.classList.add('hide');
  areaGame.innerHTML = '';
  areaGame.classList.remove('hide');
  car.style.left = '250px';
  car.style.top = 'auto';
  car.style.bottom = '10px';
  score.style.bottom = 0;
  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * HEIGHT_ELEM) + 'px';
    line.style.height = (HEIGHT_ELEM / 2) + 'px';
    line.y = i * HEIGHT_ELEM;
    areaGame.append(line);
  }

  for(let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (areaGame.offsetWidth - HEIGHT_ELEM)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `
    transparent 
    url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png) 
    center / contain 
    no-repeat
    `;
    
    areaGame.append(enemy);
  }
  setting.score = 0;
  setting.start = true;
  areaGame.append(car);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  
  if(setting.start){
    setting.score += setting.speed;
    score.innerHTML = 'SCORE<br>' + setting.score;
    moveRoad();
    moveEnemy();

    setting.speed = startSpeed + Math.floor(setting.score / 5000);

    if(keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if(keys.ArrowRight && setting.x < 500) {
      setting.x += setting.speed;
    }
    if(keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }
    if(keys.ArrowDown && setting.y < (areaGame.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame); 
  }
}

function startRun(e) {
  if(keys.hasOwnProperty(e.key)){
    e.preventDefault();
    keys[e.key] = true;
  }
}
  
function stopRun(e) {
  if(keys.hasOwnProperty(e.key)){
    e.preventDefault();
    keys[e.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function(line){
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if(line.y >= areaGame.offsetHeight){
      line.y = -HEIGHT_ELEM; 
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(function(item){
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

      if(carRect.top <= enemyRect.bottom &&
        carRect.right >= enemyRect.left &&
        carRect.left <= enemyRect.right &&
        carRect.bottom >= enemyRect.top) {
          setting.start = false;
          console.warn('ДТП');
          startGame.classList.remove('hide');
          // score.style.bottom = score.offsetHeight;
          music.remove('embed');
          btns.forEach(btn => btn.disabled = false); 
        }
      
    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';
    if(item.y >= areaGame.offsetHeight){
      item.y = -HEIGHT_ELEM * setting.traffic;
      item.style.left = Math.floor(Math.random() * (areaGame.offsetWidth - HEIGHT_ELEM)) + 'px';
    }
  });
}

startGame.addEventListener('click', start);
startLevel.addEventListener('click', start);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);