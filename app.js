const startBtn = document.querySelector('#startBtn');
const stopBtn = document.querySelector('#stopBtn');
const resetBtn = document.querySelector('#resetBtn');
const timer = document.querySelector('#timer');
const video = document.querySelector('.backgroundVideo');
const audio = document.querySelector('.backgroundAudio');
const preloader = document.querySelector('.preloader');

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

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

stopBtn.disabled = true;
resetBtn.disabled = true;
window.addEventListener('load', () => {
    preloader.style.zIndex = -2;
});