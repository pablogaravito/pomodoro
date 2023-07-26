const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');
const resetBtn = document.querySelector('#reset-btn');
const timer = document.querySelector('#timer');
const video = document.querySelector('.background-video');
const audio = document.querySelector('.background-audio');
const audioSelect = document.querySelector('#audio-select');
const videoSelect = document.querySelector('#video-select');
const preloader = document.querySelector('.preloader');
const modal = document.querySelector('.modal');
const settingsBtn = document.querySelector('.settings-btn');
const closeIcon = document.querySelector('.close-icon');
const container = document.querySelector('.container');
let isTimerActive = false;

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
    isTimerActive = true;
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
    isTimerActive = false;
}
const resetTimer = () => {
    stopTimer();
    timeLeft = 1500;
    transformTime();
    multimediaReset();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
    isTimerActive = false;
}

 modal.addEventListener('click', e => {
   const dialogDimensions = modal.getBoundingClientRect()
   if (
     e.clientX < dialogDimensions.left ||
     e.clientX > dialogDimensions.right ||
     e.clientY < dialogDimensions.top ||
     e.clientY > dialogDimensions.bottom
   ) {
    //  modal.close();
    //  container.classList.remove('background-on');
    closeModalAndUpdate();
   }
 });

 const closeModalAndUpdate = () => {
    const videosPath = "res/video/";
    const ambientAudiosPath = "res/sound/ambient/";
    if (isTimerActive) {
        multimediaStop();
    }
    
    if (videoSelect.value === "") {
        video.src = "";
    } else {
        video.src = `${videosPath}${videoSelect.value}.mp4`;
    }

    if (audioSelect.value === "") {
        audio.src = "";
    } else {
        audio.src = `${ambientAudiosPath}${audioSelect.value}.mp3`;
    }
    container.classList.remove('background-on');
    modal.close();
    if (isTimerActive) {
        multimediaStart();
    }    
 }

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
settingsBtn.addEventListener('click', () => {
    console.log('joy');
    modal.showModal();
    container.classList.add('background-on');
});
closeIcon.addEventListener('click', () => {
    // modal.close();
    // container.classList.remove('background-on');
    closeModalAndUpdate();
 });

stopBtn.disabled = true;
resetBtn.disabled = true;
window.addEventListener('load', () => {
    preloader.style.zIndex = -2;
    preloader.style.display = "none";
});
