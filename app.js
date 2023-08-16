//BUTTONS

//Main-Buttons
const startPauseBtn = document.querySelector('#start-pause-btn');
const resetBtn = document.querySelector('#reset-btn');
const settingsBtn = document.querySelector('#settings-btn');

//Mode-Buttons
const pomodoroBtn = document.querySelector('#pomodoro-mode');
const breakBtn = document.querySelector('#break-mode');
const longBreakBtn = document.querySelector('#long-break-mode');

//Preview Buttons
const previewBackBtn = document.querySelector('#preview-back-btn');
const previewAlarmBtn = document.querySelector('#preview-alarm-btn');
const previewStartBtn = document.querySelector('#preview-start-btn');

const closeIcon = document.querySelector('.close-icon');

//MULTIMEDIA

//Img and Videos
const previewVid = document.querySelector('#preview-vid');
const previewImg = document.querySelector('#preview-img');
const video = document.querySelector('.background-video');
const image = document.querySelector('.background-image');

//Audios
const backAudio = document.querySelector('#background-audio');
const alarmAudio = document.querySelector('#alarm-audio');
const startAudio = document.querySelector('#start-audio');

const timer = document.querySelector('#timer');

//CONTROLS

//Selects
const audioSelect = document.querySelector('#audio-select');
const videoSelect = document.querySelector('#video-select');
const imageSelect = document.querySelector('#image-select');
const alarmSelect = document.querySelector('#alarm-select');
const startSelect = document.querySelector('#start-select');

//Inputs
const pomodoroSetting = document.querySelector('#pomodoro-setting');
const breakSetting = document.querySelector('#break-setting');
const longBreakSetting = document.querySelector('#long-break-setting');
const numPomodorosSetting = document.querySelector('#number-pomodoros-setting');

//Switchs
const pomodoroAutoStartSwitch = document.querySelector('#pomodoro-autostart-switch');
const breakAutoStartSwitch = document.querySelector('#break-autostart-switch');
const notificationSwitch = document.querySelector('#notification-switch');

//Ranges
const rangeBackgroundSound = document.querySelector('#range-background-sound');
const rangeAlarmSound = document.querySelector('#range-alarm-sound');
const rangeStartSound = document.querySelector('#range-start-sound');

//COMPONENTS
const preloader = document.querySelector('.preloader');
const modal = document.querySelector('#settings-modal');


const container = document.querySelector('.gral-container');

const videoBackgroundLabel = document.querySelector('#video-background-label');
const videoBackgroundDiv = document.querySelector('.video-background-div');
const videoBackgroundRadio = document.querySelector('#video-background-radio');
const imageBackgroundLabel = document.querySelector('#image-background-label');
const imageBackgroundDiv = document.querySelector('.image-background-div');
const imageBackgroundRadio = document.querySelector('#image-background-radio');

//PATHS
const videosPath = "res/video/";
const imagesPath = "res/img/"
const backgroundAudiosPath = "res/audio/background/";
const alarmAudiosPath = "res/audio/alarm/";
const startAudiosPath = "res/audio/start/";

let currentStatus = 0; //-1: starting; 0: idle; 1: active; 2: paused;
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
    pomodorosToLongBreak: 4,
    autoStartPomodoros: false,
    autoStartBreaks: true,
    backgroundType: 1,
    audioVolume: 50,
    alarmVolume: 90,
    startVolume: 80,
    notificationsOn: true
};

let interval;
let notificationsAllowed = false;
let timeLeft = 0;
let pomodorosCompleted = 0;


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

    

    timeLeft = settings.pomodoro * 60;
    setTimer();

    updateMultimedia();    
}

const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
}

/* MULTIMEDIA */
const videoStart = () => {
    if (settings.video !== "" && settings.backgroundType === 1) {
        video.play();
    }
}

const audioStart = () => {
    if (settings.audio !== "") {
        backAudio.play();
    } 
}

const multimediaStart = () => {
    videoStart();
    audioStart();    
}

const videoStop = () => {
    if (settings.video !== "") {
        video.pause();
    }
}

const audioStop = () => {
    if (settings.audio !== "" && (!backAudio.paused || backAudio.currentTime)) {
        backAudio.pause();
    } 
}

const multimediaStop = () => {
    videoStop();
    audioStop();
}

const audioReset = () => {
    if (settings.audio !== "") {
        backAudio.currentTime = 0;
    } 
}

const videoReset = () => {
    if (settings.video !== "") {
        video.currentTime = 0;
    }
}

const multimediaReset = () => {
    videoReset();
    audioReset();
}

const convertVolume = (level) => {
    return level/100;
}

const updateAudio = () => {
    if (settings.audio === "") {
        backAudio.removeAttribute('src');
    } else {
        backAudio.src = `${backgroundAudiosPath}${settings.audio}.mp3`;
        backAudio.volume = convertVolume(settings.audioVolume);
    }

    if (settings.alarm === "") {
        alarmAudio.removeAttribute('src');
    } else {
        alarmAudio.src = `${alarmAudiosPath}${settings.alarm}.mp3`;
        alarmAudio.volume = convertVolume(settings.alarmVolume);
    }

    if (settings.start === "") {
        startAudio.removeAttribute('src');
    } else {
        startAudio.src = `${startAudiosPath}${settings.start}.mp3`;
        startAudio.volume = convertVolume(settings.startVolume);
    }
}

const updateMultimedia = () => {
    setBackground();
    updateAudio();    
}

const goNext = () => {
    const isPomodoroFinished = (currentMode === 1);
    const isBreakFinished = (currentMode === 2 || currentMode === 3);
    console.log('isPomodoroFinished', isPomodoroFinished);
    console.log('isBreakFinished', isBreakFinished);
    

    console.log(settings.autoStartPomodoros);
    console.log(settings.autoStartBreaks);
    console.log(settings.pomodorosToLongBreak);
    console.log('pomodorosCompleted', pomodorosCompleted);
    console.log(pomodorosCompleted === settings.pomodorosToLongBreak);
    console.log(parseInt(pomodorosCompleted) === parseInt(settings.pomodorosToLongBreak));

    
    if ((isBreakFinished && !settings.autoStartPomodoros) || 
    (isPomodoroFinished && !settings.autoStartBreaks)) {
        console.log('hm');
        multimediaStop();
        multimediaReset();
        currentStatus = 0;
        return;
    }

    if (isPomodoroFinished && settings.autoStartBreaks) {
        console.log('a');
         if (parseInt(pomodorosCompleted) === parseInt(settings.pomodorosToLongBreak)) {
            console.log('b');
            currentMode = 3;
            adjustModeBtnsStyle(3);
            setTimer();
            startTimer();
            pomodorosCompleted = 0;
         } else {
            console.log('c');
            currentMode = 2;
            adjustModeBtnsStyle(2);
            setTimer();
            startTimer();
         }     
    } else if (isBreakFinished && settings.autoStartPomodoros) {
        console.log('d');
        currentMode = 1;
        adjustModeBtnsStyle(1);
        setTimer();
        startTimer();           
   }

    // if ((currentMode === 2 || currentMode === 3) && settings.autoStartPomodoros) {
    //     currentMode = 1;
    //     adjustModeBtnsStyle(1);
    //     setTimer();
    //     startTimer();
    // }
}

const timeIsUp = async () => {
    resetTimer();
    
    if (currentMode === 1) {
        pomodorosCompleted++;
        if (settings.alarm !== "") {
            await playAlarmAudio();    
        }
    }  
   
    goNext();
}

/* TIMER */
const startTimer = () => {
    currentStatus = 1;
    multimediaStart();
    startPauseBtn.innerText = 'Pause';
    
    interval = setInterval(() => {
        timeLeft--;
        //transformTime();
        if (timeLeft === -1) {
            timeIsUp();
            //currentStatus = 0;
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
    setTimer();
    multimediaReset();
    //currentStatus = 0;
}

const setTimer = () => {
    switch (currentMode) {
        case 1:
            timeLeft = settings.pomodoro * 60;
            //DELETE NEXT LINE
            timeLeft = 8;
            break;
        
        case 2:
            timeLeft = settings.shortBreak * 60;
            //DELETE NEXT LINE
            timeLeft = 8;
            break;
        
        case 3:
            timeLeft = settings.longBreak * 60;
            //DELETE NEXT LINE
            timeLeft = 8;
    }

    transformTime();
}

const cancelStart = () => {
    if (!startAudio.paused || startAudio.currentTime) {
        startAudio.pause();
        startAudio.currentTime = 0;
        currentStatus = 0;
        resetTimer();
        startPauseBtn.innerText = 'Start';
    }
}

const startOrPause = async () => {
    resetBtn.classList.add('disabled');
    settingsBtn.classList.add('disabled');
    switch (currentStatus) {
        case -1:
            cancelStart();
            break;
        case 0: 
            if (settings.start !== "" && currentMode === 1) {
                currentStatus = -1;
                startPauseBtn.innerText = 'cancel';
                timer.textContent = 'starting...';
                
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
    settingsBtn.classList.remove('disabled');
    resetBtn.classList.remove('disabled');
}

/* NOTIFICATION */
const showNotification = (mode) => {
    // create a new notification
    let notificationMsg;
    switch (mode) {
        case 1:
            if (parseInt(settings.pomodorosToLongBreak) === parseInt(pomodorosCompleted)) {
                notificationMsg = 'Hora del descanso largo, te lo has ganado!!!';
            } else {
                notificationMsg = 'Pomodoro terminado! Tómate un descanso!'; 
            }
                     
            break;
        case 2:
            notificationMsg = 'Hora de concentrarse!'; 
            break;
        case 3: 
            notificationMsg = 'Hora de concentrarse!'; 
            
    }


    if (notificationsAllowed) {
        const notification = new Notification('Pomodoro by Pablis', {
            body: `${notificationMsg}`,
            icon: 'res/icon/pomodoro2.png'
        });
    
        // close the notification after 10 seconds
        setTimeout(() => {
            notification.close();
        }, 5 * 1000);
    } else {
        alert(notificationMsg);
    }

    
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
    if (currentStatus === 0) {
        setBackground();
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

rangeAlarmSound.addEventListener('change', () => {
    alarmAudio.volume = convertVolume(rangeAlarmSound.value);
});

rangeStartSound.addEventListener('change', () => {
    startAudio.volume = convertVolume(rangeStartSound.value);
})

const playStartAudio = () => {
    return new Promise(res=>{
        startAudio.play();
        startAudio.onended = res;
      });
};

const playAlarmAudio = () => {
    return new Promise(res=>{
        alarmAudio.play();
        alarmAudio.onended = res;
      });
}

imageBackgroundLabel.addEventListener('click', () => {
    imageBackgroundDiv.classList.remove('hide');
    videoBackgroundDiv.classList.add('hide');
});

videoBackgroundLabel.addEventListener('click', () => {
    imageBackgroundDiv.classList.add('hide');
    videoBackgroundDiv.classList.remove('hide');
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

const adjustModeBtnsStyle = (mode) => {
    switch (mode) {
        case 1:
            pomodoroBtn.classList.add('active-mode');
            breakBtn.classList.remove('active-mode');
            longBreakBtn.classList.remove('active-mode');
            break;

        case 2:
            breakBtn.classList.add('active-mode');
            pomodoroBtn.classList.remove('active-mode');
            longBreakBtn.classList.remove('active-mode');
            break;

        case 3:
            longBreakBtn.classList.add('active-mode');
            breakBtn.classList.remove('active-mode');
            pomodoroBtn.classList.remove('active-mode');
    }
}

pomodoroBtn.addEventListener('click', () => {
    if (currentMode !== 1) {
        currentMode = 1;
        adjustModeBtnsStyle(1);
        if (currentStatus === 1) {
            resetTimer();
        } else {
            setTimer();
        }
    }   
});

breakBtn.addEventListener('click', () => {
    if (currentStatus === -1) {
        cancelStart();
        return;
    }
    if (currentMode !== 2) {
        currentMode = 2;
        adjustModeBtnsStyle(2);
        if (currentStatus === 1) {
            resetTimer();
        } else {
            setTimer();
        }
    } 
});

longBreakBtn.addEventListener('click', () => {
    if (currentStatus === -1) {
        cancelStart();
        return;
    }
    if (currentMode !== 3) {
        currentMode = 3;
        adjustModeBtnsStyle(3);
        if (currentStatus === 1) {
            resetTimer();
        } else {
            setTimer();
        }
    } 
});

/* MISC */

const setBasicBackground = () => {
    document.body.style.backgroundColor = 'black';
    image.classList.add('hide');
    video.classList.add('hide');
}

const setBackground = () => {
    if (settings.backgroundType === 0) {
        image.classList.remove('hide');
        video.classList.add('hide');
        if (settings.image) {
            image.src = `${imagesPath}${settings.image}.jpg`;          
        } else {
            setBasicBackground();
        }
        
    } else {
        image.classList.add('hide');
        video.classList.remove('hide');
        if (settings.video) {
            video.src = `${videosPath}${settings.video}.mp4`;
        } else {
            setBasicBackground();
        }
    }    
}

const openSettings = () => {
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
    numPomodorosSetting.value = settings.pomodorosToLongBreak;
    pomodoroAutoStartSwitch.checked = settings.autoStartPomodoros;
    breakAutoStartSwitch.checked = settings.autoStartBreaks;
    notificationSwitch.checked = settings.notificationsOn;
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
    
    settings.image = imageSelect.value;

    settings.alarm = alarmSelect.value;
    settings.start = startSelect.value;
    settings.pomodoro = pomodoroSetting.value;
    settings.shortBreak = breakSetting.value;
    settings.longBreak = longBreakSetting.value;
    settings.pomodorosToLongBreak = numPomodorosSetting.value;
    settings.autoStartPomodoros = pomodoroAutoStartSwitch.checked;
    settings.autoStartBreaks = breakAutoStartSwitch.checked;
    
    settings.audioVolume = rangeBackgroundSound.value;
    settings.alarmVolume = rangeAlarmSound.value;
    settings.startVolume = rangeStartSound.value;
    settings.notificationsOn = notificationSwitch.checked;
    
    if (currentStatus !== 1) {
        //TIMER IS ACTIVE WHEN CLOSING MODAL
        if (videoBackgroundRadio.checked) {
            settings.backgroundType = 1;
        } else {
            settings.backgroundType = 0;
        }
        settings.video = videoSelect.value;
        settings.audio = audioSelect.value;
        setBackground();
        updateAudio();
    } else {
        //TIMER IS -NOT- ACTIVE WHEN CLOSING MODAL
        if ((videoBackgroundRadio.checked && settings.backgroundType === 0) || 
        (imageBackgroundRadio.checked && settings.backgroundType === 1))  {
            //background type changed
            if (videoBackgroundRadio.checked) {
                //changing from img to video
                settings.backgroundType = 1;               
                settings.video = videoSelect.value;
                setBackground();
                videoStart();  
            } else {
                //changing from video to img
                settings.backgroundType = 0;
                videoStop();
                settings.video = videoSelect.value;
                setBackground();
            }
        } else {
            //background type not changed
            if (videoBackgroundRadio.checked && settings.video !== videoSelect.value) {
                //video background and video changed
                console.log('video background and video changed');
                videoStop();
                settings.video = videoSelect.value;
                setBackground();
                videoStart();
            } else {
                settings.video = videoSelect.value;
            }
        }

        if (settings.audio !== audioSelect.value) {
            //audio was changed while timer is active
            audioStop();
            settings.audio = audioSelect.value;
            updateAudio();
            audioStart();
        } else {
            //audio remains the same
            settings.audio = audioSelect.value;
        }
    }

    setTimer();
    
    if (settings.notificationsOn && !notificationsAllowed) {
        checkNotification();
    }
    
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

if (settings.notificationsOn) {
    checkNotification();
}

window.addEventListener('load', () => {
    preloader.style.zIndex = -2;
    preloader.style.display = "none";
});

