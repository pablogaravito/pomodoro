const startBtn = document.querySelector('#startBtn');
const stopBtn = document.querySelector('#stopBtn');
const resetBtn = document.querySelector('#resetBtn');
const timer = document.querySelector('#timer');
const video = document.querySelector('.backgroundVideo');

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

const startTimer = () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;
    video.play();
    
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
    video.pause();

}
const resetTimer = () => {
    stopTimer();
    timeLeft = 1500;
    transformTime();
    video.currentTime = 0;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

stopBtn.disabled = true;
resetBtn.disabled = true;