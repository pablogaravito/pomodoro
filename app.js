const startPauseBtn = document.querySelector('#start-pause-btn');
const resetBtn = document.querySelector('#reset-btn');
const timer = document.querySelector('#timer');
const previewVid = document.querySelector('#preview-vid');
const previewImg = document.querySelector('#preview-img');
const video = document.querySelector('.background-video');
const image = document.querySelector('.background-image');
const audio = document.querySelector('.background-audio');
const alarm = document.querySelector('.alarm-audio');
const start = document.querySelector('.start-audio');
const audioSelect = document.querySelector('#audio-select');
const videoSelect = document.querySelector('#video-select');
const imageSelect = document.querySelector('#image-select');
const alarmSelect = document.querySelector('#alarm-select');
const startSelect = document.querySelector('#start-select');
const pomodoroSetting = document.querySelector('#pomodoro-setting');
const breakSetting = document.querySelector('#break-setting');
const longBreakSetting = document.querySelector('#long-break-setting');
const numPomodorosSetting = document.querySelector('#number-pomodoros-setting');
const pomodoroAutoStartSwitch = document.querySelector('#pomodoro-autostart-switch');
const breakAutoStartSwitch = document.querySelector('#break-autostart-switch');
const notificationSwitch = document.querySelector('#notification-switch');
const rangeBackgroundSound = document.querySelector('#range-background-sound');
const rangeAlarmSound = document.querySelector('#range-alarm-sound');
const rangeStartSound = document.querySelector('#range-start-sound');
const preloader = document.querySelector('.preloader');
const modal = document.querySelector('#settings-modal');
// const modal = document.querySelector('.tabs');
const settingsBtn = document.querySelector('#settings-btn');
const closeIcon = document.querySelector('.close-icon');
const container = document.querySelector('.gral-container');
const previewBackBtn = document.querySelector('#preview-back-btn');
const previewAlarmBtn = document.querySelector('#preview-alarm-btn');
const previewStartBtn = document.querySelector('#preview-start-btn');
const videoBackgroundLabel = document.querySelector('#video-background-label');
const videoBackgroundDiv = document.querySelector('.video-background-div');
const videoBackgroundRadio = document.querySelector('#video-background-radio');
const imageBackgroundLabel = document.querySelector('#image-background-label');
const imageBackgroundDiv = document.querySelector('.image-background-div');
const imageBackgroundRadio = document.querySelector('#image-background-radio');
const videosPath = "res/video/";
const imagesPath = "res/img/"
const backgroundAudiosPath = "res/audio/background/";
const alarmAudiosPath = "res/audio/alarm/";
const startAudiosPath = "res/audio/start/";

const headers = document.querySelector('.headers');
const tabHeaders = document.querySelectorAll('.header');

const contentContainer = document.querySelector('.tab-content-container') ;
const tabContent = document.querySelectorAll('.tab');

const tabIndicator = document.querySelector('.tab-indicator');

// const defaultSettings = {
//     video: "nature1",
//     audio: "winner-rain",
//     alarm: "success-trumpets",
//     pomodoro: 25,
//     shortBreak: 3,
//     longBreak: 10
// };

let isTimerActive = false;

let settings = {
    video: "nature1", 
    image: "tokyo-sakura",
    audio: "winner-rain",
    alarm: "success-trumpets",
    start: "study-sonso",
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    numPomodoros: 4,
    pomodoroAutoStart: false,
    breakAutoStart: true,
    backgroundType: 1,
    audioVolume: 50,
    alarmVolume: 90,
    startVolume: 80,
    notificationOn: true
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
    // if (localStorage.getItem('settings') === null) {
    //     settings.video = defaultSettings.video;
    //     settings.audio = defaultSettings.audio;
    //     settings.alarm = defaultSettings.alarm;
    // } else {
    //     settings = JSON.parse(localStorage.getItem('settings'));
    // }

    if (localStorage.getItem('settings') !== null) {
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

    setBackground();
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

    if (settings.start === "") {
        start.removeAttribute('src');
    } else {
        start.src = `${startAudiosPath}${settings.start}.mp3`;
    }
}
    // if (settings.video === "") {
    //     video.removeAttribute('src');
    //     // video.style.display = 'none';
        
        
    // } else {
    //     video.style.display = 'block';
    //     video.src = `${videosPath}${settings.video}.mp4`;
    // }

/* TIMER */
const startTimer = () => {
    isTimerActive = true;
    startPauseBtn.innerText = 'Pause';
    if (settings.start !== "") {
        playStart();
    }
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

modal.addEventListener('hidden.bs.modal', () => {
    closeModalAndUpdate();
})

startPauseBtn.addEventListener('click', startOrPause);
resetBtn.addEventListener('click', resetTimer);
settingsBtn.addEventListener('click', () => {
    openSettings();
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

startSelect.addEventListener('change', () => {
    //previewBackgroundAudio();
    if (startSelect.value === '') {
        previewStartBtn.disabled = true;
    } else {
        previewStartBtn.disabled = false;
    }
});

previewAlarmBtn.addEventListener('mouseover', () => {
    if (alarmSelect.value){
        previewAlarmAudio();
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

previewStartBtn.addEventListener('mouseover', () => {
    if (startSelect.value){
        previewStartAudio();
        start.play();       
    }   
});

previewBackBtn.addEventListener('mouseout', () => {
    if (startSelect.value){
        start.pause();
        start.currentTime = 0;
    }
});


imageBackgroundLabel.addEventListener('click', () => {
    imageBackgroundDiv.classList.remove('hide');
    videoBackgroundDiv.classList.add('hide');
    settings.backgroundType = 0;
});

videoBackgroundLabel.addEventListener('click', () => {
    imageBackgroundDiv.classList.add('hide');
    videoBackgroundDiv.classList.remove('hide');
    settings.backgroundType = 1;
});

videoSelect.addEventListener('change', () => {
    previewVidShow();
});

imageSelect.addEventListener('change', () => {
    previewImgShow();
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

const playStart = () => {
    start.play();
}

const setBackground = () => {
    if (settings.backgroundType === 0) {
        image.classList.remove('hide');
        video.classList.add('hide');
        image.src = `${imagesPath}${settings.image}.jpg`;
    } else {
        image.classList.add('hide');
        video.classList.remove('hide');
        video.src = `${videosPath}${settings.video}.mp4`;
    }
}

const openSettings = () => {
    console.log('triggered');
    if (isTimerActive) {
        multimediaStop();
        stopTimer();
    }
    console.log(settings);
    videoSelect.value = settings.video;
    previewVidShow();
    imageSelect.value = settings.image;
    previewImgShow();
    audioSelect.value = settings.audio;
    alarmSelect.value = settings.alarm;
    startSelect.value = settings.start;  
    pomodoroSetting.value = settings.pomodoro;
    breakSetting.value = settings.shortBreak;
    longBreakSetting.value = settings.longBreak;
    numPomodorosSetting.value = settings.numPomodoros;
    pomodoroAutoStartSwitch.checked = settings.pomodoroAutoStart;
    breakAutoStartSwitch.checked = settings.breakAutoStart;
    notificationSwitch.checked = settings.notificationOn;
    rangeBackgroundSound.value = settings.alarmVolume;
    rangeAlarmSound.value = settings.alarmVolume;
    rangeStartSound.value = settings.startVolume;
    if (settings.backgroundType === 0) {
        imageBackgroundRadio.checked = true;
        imageBackgroundDiv.classList.remove('hide');
        videoBackgroundDiv.classList.add('hide');    
    } else {
        videoBackgroundRadio.checked = true;
        imageBackgroundDiv.classList.add('hide');
        videoBackgroundDiv.classList.remove('hide');
    } 
}

const closeModalAndUpdate = () => {
    settings.video = videoSelect.value;
    settings.image = imageSelect.value;
    settings.audio = audioSelect.value;
    settings.alarm = alarmSelect.value;
    settings.start = startSelect.value;
    settings.pomodoro = pomodoroSetting.value;
    settings.shortBreak = breakSetting.value;
    settings.longBreak = longBreakSetting.value;
    settings.numPomodoros = numPomodorosSetting.value;
    settings.pomodoroAutoStart = pomodoroAutoStartSwitch.checked;
    settings.breakAutoStart = breakAutoStartSwitch.checked;
    if (videoBackgroundRadio.checked) {
        settings.backgroundType = 1;
    } else {
        settings.backgroundType = 0;
    }
    settings.audioVolume = rangeBackgroundSound.value;
    settings.alarmVolume = rangeAlarmSound.value;
    settings.startVolume = rangeStartSound.value;
    settings.notificationOn = notificationSwitch.checked;

    defineMultimedia();
    saveSettings();
 }

const previewAlarmAudio = () => {
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

const previewStartAudio = () => {
    if (startSelect.value === "") {
        start.removeAttribute('src');     
    } else {
        start.src = `${startAudiosPath}${startSelect.value}.mp3`;
    }
}

const previewVidShow = () => {
    if (videoSelect.value === "") {
        previewVid.removeAttribute('src');
        previewVid.classList.add('hide');
    } else {
        //previewVid.style.display = 'block';
        previewVid.classList.remove('hide');
        previewVid.src = `${videosPath}min/${videoSelect.value}_min.mp4`;
    }
}

const previewImgShow = () => {
    if (imageSelect.value === "") {
        previewImg.removeAttribute('src');
        previewImg.classList.add('hide');
    } else {
        previewImg.classList.remove('hide');
        previewImg.src = `${imagesPath}${imageSelect.value}.jpg`;
    }
}

/* EXECUTION STARTS */


readSettings();

if (settings.notificationOn) {
    checkNotification();
}


window.addEventListener('load', () => {
    preloader.style.zIndex = -2;
    preloader.style.display = "none";
});

