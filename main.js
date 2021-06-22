const score = document.querySelector('.score'),
    startGame = document.querySelector('.game_start'),
    areaGame = document.querySelector('.game_area'),
    car = document.createElement('div');
car.classList.add('car');

startGame.addEventListener('click', start);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3
};

function start() {
    startGame.classList.add('hide');
    setting.start = true;
    areaGame.appendChild(car);
    requestAnimationFrame(playGame);
}

function playGame() {
    console.log('Старт');
    if(setting.start){
        requestAnimationFrame(playGame); 
    }
}

function startRun(e) {
    e.preventDefault();
    keys[e.key] = true;
}
   
function stopRun(e) {
    e.preventDefault();
    keys[e.key] = false;
}
