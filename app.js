const startPauseBtn = document.querySelector('#start-pause-btn');
//const stopBtn = document.querySelector('#stop-btn');
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
const modal = document.querySelector('.tabs');
const settingsBtn = document.querySelector('#settings-btn');
const closeIcon = document.querySelector('.close-icon');
const container = document.querySelector('.gral-container');
const previewBackBtn = document.querySelector('#preview-back-btn');
const previewAlarmBtn = document.querySelector('#preview-alarm-btn');
const videosPath = "res/video/";
const backgroundAudiosPath = "res/audio/background/";
const alarmAudiosPath = "res/audio/alarm/";

const headers = document.querySelector('.headers');
const tabHeaders = document.querySelectorAll('.header');

const contentContainer = document.querySelector('.tab-content-container') ;
const tabContent = document.querySelectorAll('.tab');

const tabIndicator = document.querySelector('.tab-indicator');

const defaultSettings = {
    video: "nature1",
    audio: "winner-rain",
    alarm: "success-trumpets",
    pomodoro: 25,
    shortBreak: 3,
    longBreak: 10
};

let isTimerActive = false;

let settings = {
    video: "", 
    audio: "",
    alarm: "",
    pomodoro: 0,
    shortBreak: 0,
    longBreak: 0
};

let interval;
let notificationsAllowed = false;
//let timeLeft = 1500;
let timeLeft = 5;

for (let i=0; i < tabHeaders.length; i++) {
    tabHeaders[i].addEventListener('click', function () {
        headers.getElementsByClassName('active')[0].classList.remove('active');
        tabHeaders[i].classList.add('active');

        tabIndicator.style.top = `calc(80px + ${i*50}px)`;

        contentContainer.getElementsByClassName('active')[0].classList.remove('active');
        tabContent[i].classList.add('active');
     });
}

/* FORMAT TIME */
const padTime = (time) => {
    return time.toString().padStart(2, '0');
}
const transformTime = () => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timer.textContent = `${padTime(minutes)}:${padTime(seconds)}`;
}

/* SETTINGS */
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

/* MULTIMEDIA */
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

/* TIMER */
const startTimer = () => {
    isTimerActive = true;
    startPauseBtn.innerText = 'Pause';
    //startBtn.disabled = true;
    //stopBtn.disabled = false;
    //resetBtn.disabled = false;
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
            if (settings.alarm !== "") {
                playAlarm();
                // setTimeout(() => { 
                //     alarm.pause();
                //     alarm.currentTime = 0;
                //  }, 3000);
            }
            //timeLeft = 1500;
        }
        transformTime();
    }, 1000);
}

const stopTimer = () => {
    clearInterval(interval);
    // startBtn.disabled = false;
    // stopBtn.disabled = true;
    // resetBtn.disabled = false;
    multimediaStop();
    isTimerActive = false;
    startPauseBtn.innerText = 'Start';
}

const resetTimer = () => {
    stopTimer();
    timeLeft = 5;
    transformTime();
    multimediaReset();
    // startBtn.disabled = false;
    // stopBtn.disabled = true;
    // resetBtn.disabled = true;
    isTimerActive = false;
}

const startOrPause = () => {
    if (isTimerActive) {
        stopTimer();
    } else {
        startTimer();
    }
}

/* NOTIFICATION */
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

/* EVENT LISTENERS */
window.addEventListener('focus', () => {
    if (!isTimerActive) {
        multimediaStop();
        defineMultimedia();
        multimediaReset();
    }
});

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

modal.addEventListener('keydown', function(e) {
    if (e.key == "Escape") {
      closeModalAndUpdate();
    }
});

// startBtn.addEventListener('click', startTimer);
// stopBtn.addEventListener('click', stopTimer);
startPauseBtn.addEventListener('click', startOrPause);
resetBtn.addEventListener('click', resetTimer);
settingsBtn.addEventListener('click', () => {
    openSettings();
});

closeIcon.addEventListener('click', () => {
    closeModalAndUpdate();
 });

alarmSelect.addEventListener('change', () => {
    //previewAlarm();
    if (alarmSelect.value === '') {
        previewAlarmBtn.disabled = true;
    } else {
        previewAlarmBtn.disabled = false;
    }
});

audioSelect.addEventListener('change', () => {
    //previewBackgroundAudio();
    if (audioSelect.value === '') {
        previewBackBtn.disabled = true;
    } else {
        previewBackBtn.disabled = false;
    }
});

previewAlarmBtn.addEventListener('mouseover', () => {
    if (alarmSelect.value){
        previewAlarm();
        alarm.play();       
    }   
});

previewAlarmBtn.addEventListener('mouseout', () => {
    if (alarmSelect.value){
        alarm.pause();
        alarm.currentTime = 0;
    }
});

previewBackBtn.addEventListener('mouseover', () => {
    if (audioSelect.value){
        previewBackgroundAudio();
        audio.play();       
    }   
});

previewBackBtn.addEventListener('mouseout', () => {
    if (audioSelect.value){
        audio.pause();
        audio.currentTime = 0;
    }
});

videoSelect.addEventListener('change', () => {
    previewVidShow();
});

/* Mouse Over preview video */ 
previewVid.addEventListener('mouseover', () => {
    if (previewVid.src){
        previewVid.play();
    }   
});

previewVid.addEventListener('mouseout', () => {
    if (previewVid.src){
        previewVid.pause();
    }
});

/* MISC */
const playAlarm = () => {
    alarm.play();
}

const openSettings = () => {
    if (isTimerActive) {
        multimediaStop();
        stopTimer();
    }
    videoSelect.value = settings.video;
    previewVidShow();
    audioSelect.value = settings.audio;
    alarmSelect.value = settings.alarm;
    modal.showModal();
    container.classList.add('background-on');
}

const closeModalAndUpdate = () => {
    settings.video = videoSelect.value;
    settings.audio = audioSelect.value;
    settings.alarm = alarmSelect.value;
    defineMultimedia();
    container.classList.remove('background-on');
    modal.close();
    saveSettings();
 }

const previewAlarm = () => {
    if (alarmSelect.value === "") {
        alarm.removeAttribute('src');     
    } else {
        alarm.src = `${alarmAudiosPath}${alarmSelect.value}.mp3`;
    }
}

const previewBackgroundAudio = () => {
    if (audioSelect.value === "") {
        audio.removeAttribute('src');     
    } else {
        audio.src = `${backgroundAudiosPath}${audioSelect.value}.mp3`;
    }
}

const previewVidShow = () => {
    if (videoSelect.value === "") {
        previewVid.removeAttribute('src');
        previewVid.style.display = 'none';      
    } else {
        previewVid.style.display = 'block';
        previewVid.src = `${videosPath}min/${videoSelect.value}_min.mp4`;
    }
}

/* EXECUTION STARTS */
checkNotification();

readSettings();

//stopBtn.disabled = true;
//resetBtn.disabled = true;
window.addEventListener('load', () => {
    preloader.style.zIndex = -2;
    preloader.style.display = "none";
});

