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
const videosPath = "res/video/";
const ambientAudiosPath = "res/sound/ambient/";
const defaultSettings = {
    video: "nature",
    audio: "soft-rain"
};
let isTimerActive = false;
let settings = {
    video: "", 
    audio: ""
};

let interval;
let notificationsAllowed = false;
//let timeLeft = 1500;
let timeLeft = 5;

const transformTime = () => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timer.textContent = `${padTime(minutes)}:${padTime(seconds)}`;

}

const defineMultimedia = () => {
    if (settings.video === "") {
        video.removeAttribute('src');
        video.style.display = 'none';
        
    } else {
        video.style.display = 'block';
        video.src = `${videosPath}${settings.video}.mp4`;
    }

    if (!settings.audio === "") {
        audio.removeAttribute('src');
    } else {
        audio.src = `${ambientAudiosPath}${settings.audio}.mp3`;
    }
}

const readSettings = () => {
    if (localStorage.getItem('settings') === null) {
        settings.video = defaultSettings.video;
        settings.audio = defaultSettings.audio;
    } else {
        settings = JSON.parse(localStorage.getItem('settings'));
    }
    defineMultimedia();
}

const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
}

const padTime = (time) => {
    return time.toString().padStart(2, '0');
}

const multimediaStart = () => {
    console.log(settings.audio, settings.video);
    console.log(audio.src, video.src);
    if (settings.video !== "") {
        video.play();
    }
    if (settings.audio !== "") {
        audio.play();
    } 
}

const multimediaStop = () => {
    if (settings.video !== "") {
        video.pause();
    }
    if (settings.audio !== "") {
        audio.pause();
    } 
}

const multimediaReset = () => {
    if (settings.video !== "") {
        video.currentTime = 0;
    }
    if (settings.audio !== "") {
        audio.currentTime = 0;
    } 
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
            // clearInterval(interval);
            // multimediaStop();
            // multimediaReset();
            resetTimer();
                        
            if (notificationsAllowed) {
                showNotification();
            } else {
                alert("Time's up");
            }
            //timeLeft = 1500;
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
    timeLeft = 5;
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
    
    if (isTimerActive) {
        multimediaStop();
    }
    settings.video = videoSelect.value;
    settings.audio = audioSelect.value;
    defineMultimedia();
 
    container.classList.remove('background-on');
    modal.close();
    saveSettings();
    if (isTimerActive) {
        multimediaStart();
    }    
 }

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
settingsBtn.addEventListener('click', () => {
    videoSelect.value = settings.video;
    audioSelect.value = settings.audio;
    modal.showModal();
    container.classList.add('background-on');
});
closeIcon.addEventListener('click', () => {
    // modal.close();
    // container.classList.remove('background-on');
    closeModalAndUpdate();
 });

const showNotification = () => {
    // create a new notification
    const notification = new Notification('Pomodoro by Pablis', {
        body: 'Ciclo terminado!',
        icon: 'res/icon/pomodoro2.png'
    });

    // close the notification after 10 seconds
    setTimeout(() => {
        notification.close();
    }, 5 * 1000);
}

const checkNotification = () => {
    let notifyPermission;
    if (Notification.permission === "granted") {
        notificationsAllowed = true;
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                notificationsAllowed = true;
            }
        });
    } else {
        notificationsAllowed = false;
    }
}

window.addEventListener('focus', () => {
    if (!isTimerActive) {
        console.log('triggered...');
        multimediaStop();
        defineMultimedia();
        multimediaReset();
    }
});

checkNotification();


readSettings();

stopBtn.disabled = true;
resetBtn.disabled = true;
window.addEventListener('load', () => {
    preloader.style.zIndex = -2;
    preloader.style.display = "none";
});

