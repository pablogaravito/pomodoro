const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');
const resetBtn = document.querySelector('#reset-btn');
const timer = document.querySelector('#timer');
const previewVid = document.querySelector('.preview-vid');
const video = document.querySelector('.background-video');
const audio = document.querySelector('.background-audio');
const alarm = document.querySelector('.alarm-audio');
const audioSelect = document.querySelector('#audio-select');
const videoSelect = document.querySelector('#video-select');
const alarmSelect = document.querySelector('#alarm-select');
const preloader = document.querySelector('.preloader');
const modal = document.querySelector('.modal');
const settingsBtn = document.querySelector('.settings-btn');
const closeIcon = document.querySelector('.close-icon');
const container = document.querySelector('.container');
const videosPath = "res/video/";
const backgroundAudiosPath = "res/audio/background/";
const alarmAudiosPath = "res/audio/alarm/";
const defaultSettings = {
    video: "nature1",
    audio: "winner-rain",
    alarm: "yay"
};
let isTimerActive = false;
let settings = {
    video: "", 
    audio: "",
    alarm: ""
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

    if (settings.audio === "") {
        audio.removeAttribute('src');
    } else {
        audio.src = `${backgroundAudiosPath}${settings.audio}.mp3`;
    }

    if (settings.alarm === "") {
        alarm.removeAttribute('src');
    } else {
        alarm.src = `${alarmAudiosPath}${settings.alarm}.mp3`;
    }
}

const readSettings = () => {
    if (localStorage.getItem('settings') === null) {
        settings.video = defaultSettings.video;
        settings.audio = defaultSettings.audio;
        settings.alarm = defaultSettings.alarm;
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
    closeModalAndUpdate();
   }
 });

 const closeModalAndUpdate = () => {
    
    if (isTimerActive) {
        multimediaStop();
    }
    settings.video = videoSelect.value;
    settings.audio = audioSelect.value;
    settings.alarm = alarmSelect.value;
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
    previewVidShow();
    audioSelect.value = settings.audio;
    alarmSelect.value = settings.alarm;
    modal.showModal();
    container.classList.add('background-on');
});

closeIcon.addEventListener('click', () => {
    closeModalAndUpdate();
 });

 previewVid.addEventListener('mouseover', () => {
    if (previewVid.src){
        previewVid.play();
    }   
});

/* Applying the mouse out event to pause the video */
previewVid.addEventListener('mouseout', () => {
    if (previewVid.src){
        previewVid.pause();
    }
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
        multimediaStop();
        defineMultimedia();
        multimediaReset();
    }
});

videoSelect.addEventListener('change', () => {
    previewVidShow();
});

const previewVidShow = () => {
    if (videoSelect.value === "") {
        previewVid.removeAttribute('src');
        previewVid.style.display = 'none';
        
    } else {
        previewVid.style.display = 'block';
        previewVid.src = `${videosPath}min/${videoSelect.value}_min.mp4`;
    }
}

checkNotification();

readSettings();

stopBtn.disabled = true;
resetBtn.disabled = true;
window.addEventListener('load', () => {
    preloader.style.zIndex = -2;
    preloader.style.display = "none";
});

