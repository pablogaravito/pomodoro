const startPauseBtn = document.querySelector('#start-pause-btn');
const resetBtn = document.querySelector('#reset-btn');
const timer = document.querySelector('#timer');
const previewVid = document.querySelector('#preview-vid');
const previewImg = document.querySelector('#preview-img');
const video = document.querySelector('.background-video');
const image = document.querySelector('.background-image');
const backAudio = document.querySelector('#background-audio');
const alarmAudio = document.querySelector('#alarm-audio');
const startAudio = document.querySelector('#start-audio');
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

let isTimerActive = false;

// let currentStatus = 0; //0: idle; 1: pomodoro; 2: break; 3: long-break
let currentStatus = 0; //0: idle; 1: active; 2: paused;
let currentMode = 1; //1: pomodoro; 2: break; 3: long-break

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
    if (settings.video !== "" && settings.backgroundType === 1) {
        video.play();
    }
    if (settings.audio !== "") {
        backAudio.play();
    } 
}

const multimediaStop = () => {
    if (settings.video !== "") {
        video.pause();
    }
    if (settings.audio !== "") {
        backAudio.pause();
    } 
}

const multimediaReset = () => {
    if (settings.video !== "") {
        video.currentTime = 0;
    }
    if (settings.audio !== "") {
        backAudio.currentTime = 0;
    } 
}

const convertVolume = (level) => {
    return level/100;
}

const defineMultimedia = () => {

    setBackground();
    if (settings.audio === "") {
        backAudio.removeAttribute('src');
    } else {
        backAudio.src = `${backgroundAudiosPath}${settings.audio}.mp3`;
        backAudio.volume = convertVolume(rangeBackgroundSound.value);
    }

    if (settings.alarm === "") {
        alarmAudio.removeAttribute('src');
    } else {
        alarmAudio.src = `${alarmAudiosPath}${settings.alarm}.mp3`;
        alarmAudio.volume = convertVolume(rangeAlarmSound.value);
    }

    if (settings.start === "") {
        startAudio.removeAttribute('src');
    } else {
        startAudio.src = `${startAudiosPath}${settings.start}.mp3`;
        startAudio.volume = convertVolume(rangeStartSound.value);
    }
}

/* TIMER */
const startTimer = () => {
    currentStatus = 1;
    multimediaStart();
    startPauseBtn.innerText = 'Pause';
    
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
                alarmAudio.play();
            }
            //timeLeft = 1500;
        }
        transformTime();
    }, 1000);
}

const stopTimer = () => {
    clearInterval(interval);
    multimediaStop();
    currentStatus = 2;
    startPauseBtn.innerText = 'Start';
}

const resetTimer = () => {
    stopTimer();
    timeLeft = 5;
    transformTime();
    multimediaReset();
    // isTimerActive = false;
    currentStatus = 0;
}

const startOrPause = async () => {
    // if (isTimerActive) {
    //     stopTimer();
    // } else {
    //     startTimer();
    // }
    switch (currentStatus) {
        case 0: 
            if (settings.start !== "") {
                await playStartAudio();
            }
            startTimer();
            break;

        case 1:
            stopTimer();
            break;
        
        case 2:
            startTimer();     
    }

    // if (currentStatus === 0) {
    //     if (settings.start !== "") {
    //         await playStartAudio();
    //     }
    //     startPauseBtn.innerText = 'Pause';
    //     startTimer();
    // } else if (currentStatus === 2) {
    //     startTimer();
    // } else if  {
    //     stopTimer();
    // }

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
    if (alarmSelect.value === '') {
        previewAlarmBtn.disabled = true;
    } else {
        previewAlarmBtn.disabled = false;
    }
});

audioSelect.addEventListener('change', () => {
    if (audioSelect.value === '') {
        previewBackBtn.disabled = true;
    } else {
        previewBackBtn.disabled = false;
    }
});

startSelect.addEventListener('change', () => {
    if (startSelect.value === '') {
        previewStartBtn.disabled = true;
    } else {
        previewStartBtn.disabled = false;
    }
});

previewStartBtn.addEventListener('click', () => {
    const audio = new Audio(`${startAudiosPath}${startSelect.value}.mp3`);
    audio.volume = convertVolume(rangeStartSound.value);
    audio.play();
    setTimeout(() => {
        if (!audio.paused || audio.currentTime) {
            audio.pause();
        }      
      }, "5000");
});

previewBackBtn.addEventListener('click', () => {
    const audio = new Audio(`${backgroundAudiosPath}${audioSelect.value}.mp3`);
    audio.volume = convertVolume(rangeBackgroundSound.value);
    audio.play();
    setTimeout(() => {
        if (!audio.paused || audio.currentTime) {
            audio.pause();
        }      
      }, "5000");
});

previewAlarmBtn.addEventListener('click', () => {
    const audio = new Audio(`${alarmAudiosPath}${alarmSelect.value}.mp3`);
    audio.volume = convertVolume(rangeAlarmSound.value);
    audio.play();
    setTimeout(() => {
        if (!audio.paused || audio.currentTime) {
            audio.pause();
        }      
      }, "5000");
});

rangeBackgroundSound.addEventListener('change', () => {
    backAudio.volume = convertVolume(rangeBackgroundSound.value);
});

const playStartAudio = () => {
    return new Promise(res=>{
        startAudio.play();
        startAudio.onended = res;
      });
};

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
    // if (!audio.paused || audio.currentTime) {
    //     audio.pause();
    // }     
});

/* MISC */

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
    
    // if (isTimerActive) {
    //     multimediaStop();
    //     stopTimer();
    // }

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
    rangeBackgroundSound.value = settings.audioVolume;
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

const previewVidShow = () => {
    if (videoSelect.value === "") {
        previewVid.removeAttribute('src');
        previewVid.classList.add('hide');
    } else {
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

