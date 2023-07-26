const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');
const resetBtn = document.querySelector('#reset-btn');
const timer = document.querySelector('#timer');
const video = document.querySelector('.background-video');
const audio = document.querySelector('.background-audio');
const preloader = document.querySelector('.preloader');
const modal = document.querySelector('.modal');
const settingsBtn = document.querySelector('.settings-btn');
const closeIcon = document.querySelector('.close-icon');
const container = document.querySelector('.container');

let interval;
let timeLeft = 1500;

const transformTime = () => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timer.textContent = `${padTime(minutes)}:${padTime(seconds)}`;

}

const padTime = (time) => {
    return time.toString().padStart(2, '0');
}

const multimediaStart = () => {
    video.play();
    audio.play();
}

const multimediaStop = () => {
    video.pause();
    audio.pause();
}

const multimediaReset = () => {
    video.currentTime = 0;
    audio.currentTime = 0;
}


const startTimer = () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;
    multimediaStart();
    
    interval = setInterval(() => {
        timeLeft--;
        transformTime();
        if (timeLeft === -1) {
            clearInterval(interval);
            alert("Time's up");
            timeLeft = 1500;
        }
        transformTime();
    }, 1000);
}
const stopTimer = () => {
    clearInterval(interval);
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = false;
    multimediaStop();
}
const resetTimer = () => {
    stopTimer();
    timeLeft = 1500;
    transformTime();
    multimediaReset();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
}



 modal.addEventListener('click', e => {
   const dialogDimensions = modal.getBoundingClientRect()
   if (
     e.clientX < dialogDimensions.left ||
     e.clientX > dialogDimensions.right ||
     e.clientY < dialogDimensions.top ||
     e.clientY > dialogDimensions.bottom
   ) {
     modal.close();
     container.classList.remove('background-on');
   }
 });

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
settingsBtn.addEventListener('click', () => {
    console.log('joy');
    modal.showModal();
    container.classList.add('background-on');
});
closeIcon.addEventListener('click', () => {
    modal.close();
    container.classList.remove('background-on');
    console.log('closeicon clicked');
 });

stopBtn.disabled = true;
resetBtn.disabled = true;
window.addEventListener('load', () => {
    preloader.style.zIndex = -2;
});