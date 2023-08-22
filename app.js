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
let mode = 1; //1: pomodoro; 2: break; 3: long-break

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
        console.log(settings.video);
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
    const isPomodoroFinished = (mode === 1);
    const isBreakFinished = (mode === 2 || mode === 3);
    
    if ((isBreakFinished && !settings.autoStartPomodoros) || 
    (isPomodoroFinished && !settings.autoStartBreaks)) {

        if (mode === 1) {
            multimediaReset();
        }
        
        currentStatus = 0;
        return;
    }

    if (isPomodoroFinished && settings.autoStartBreaks) {
         if (parseInt(pomodorosCompleted) === parseInt(settings.pomodorosToLongBreak)) {
            switchMode(3);
            resetTimer();
            startTimer();
            pomodorosCompleted = 0;
         } else {
            switchMode(2);
            resetTimer();
            startTimer();
         }     
    } else if (isBreakFinished && settings.autoStartPomodoros) {
        switchMode(1);
        startTimer();           
   }
}

const timeIsUp = async () => {
    stopTimer();
    if (mode === 1) {
        pomodorosCompleted++;
        pomodoroBtn.textContent = `pomodoro (${pomodorosCompleted})`;   
    }
    if (settings.notificationsOn) {
        console.log('shownotification');
        console.log(mode);
        showNotification(mode);
    }
    if (settings.alarm !== "" && mode === 1) {        
        startPauseBtn.classList.add('disabled');
        await playAlarmAudio();  
        startPauseBtn.classList.remove('disabled');  
    }
   
    goNext();
}

const performStart = async () => {
    if (settings.start !== "" && mode === 1 && currentStatus !== 2) {

        currentStatus = -1;
        startPauseBtn.innerText = 'cancel';
        
        resetBtn.classList.add('disabled');
        settingsBtn.classList.add('disabled');
        timer.textContent = 'starting...';
        
        await playStartAudio();
        currentStatus = 0;
        setTimer();
        settingsBtn.classList.remove('disabled');
        resetBtn.classList.remove('disabled');       
    }
}

/* TIMER */
const startTimer = async () => {
    await performStart();

    console.log(currentStatus);
    console.log(mode);

    if (currentStatus === 1) {
        stopTimer();
    } else if (currentStatus === 0 || currentStatus === 2) {
        currentStatus = 1;
        interval = setInterval(() => {
            timeLeft--;
            if (timeLeft === -1) {
                timeIsUp();
            } else {
                transformTime();
            }
            
        }, 1000);
        if (mode === 1) {
            multimediaStart();
        }
        
        startPauseBtn.innerText = 'Pause';
    }    
}

const stopTimer = () => {
    clearInterval(interval);
    if (mode === 1) {
         multimediaStop();
     }
    currentStatus = 2;
    startPauseBtn.innerText = 'Start';
}

const resetTimer = () => {
    console.log('mode', mode);
    stopTimer();
    setTimer();
    if (mode === 1 && currentStatus === 1) {
        console.log('mode 1 confirmed, should stop and reset multi');
        multimediaStop();
        multimediaReset();
    }
    currentStatus = 0;
}

const setTimer = () => {
    switch (mode) {
        case 1:
            timeLeft = settings.pomodoro * 60;
             //DELETE NEXT LINE
              //timeLeft = 5;
            break;
        
        case 2:
            timeLeft = settings.shortBreak * 60;
             //DELETE NEXT LINE
              //timeLeft = 5;
            break;
        
        case 3:
            timeLeft = settings.longBreak * 60;
             //DELETE NEXT LINE
              //timeLeft = 5;
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
        settingsBtn.classList.remove('disabled');
        resetBtn.classList.remove('disabled'); 
    }
}

const startOrPause = () => {
    
    switch (currentStatus) {
        case -1:
            cancelStart();
            break;

        case 0:
        case 2: 
            startTimer();
            break;

        case 1:
            stopTimer();
            break;    
    }
}

/* NOTIFICATION */
const showNotification = (mode) => {
    
    let notificationMsg;
    switch (mode) {
        case 1:
            console.log('case 1');
            if (parseInt(settings.pomodorosToLongBreak) === parseInt(pomodorosCompleted)) {
                console.log(parseInt(settings.pomodorosToLongBreak) === parseInt(pomodorosCompleted));
                notificationMsg = 'Hora del descanso largo, te lo has ganado!!!';
            } else {
                notificationMsg = 'Pomodoro terminado! Tómate un descanso!'; 
            }      
            break;
        case 2:
            console.log('case2');
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
    
        // close the notification after 8 seconds
        setTimeout(() => {
            notification.close();
        }, 8 * 1000);
    } else {
        alert(notificationMsg);
    }    
}

const checkNotification = () => {
    if (Notification.permission === "granted") {
        notificationsAllowed = true;
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            
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
    if (currentStatus === 0 || mode !== 1) {
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
    previewAlarmBtn.disabled = (alarmSelect.value === '');
});

audioSelect.addEventListener('change', () => {
    previewBackBtn.disabled = (audioSelect.value === '');
});

startSelect.addEventListener('change', () => {
    previewStartBtn.disabled = (startSelect.value === '');
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

const switchMode = (modeParam) => {
    if (mode === modeParam) {
        return;
    }
    if (currentStatus === -1) {
        cancelStart();
    }
    adjustModeBtnsStyle(modeParam);
    
    console.log('currentstatus inside switch mode', currentStatus);
    resetTimer();
    mode = modeParam;
    setTimer();
}

pomodoroBtn.addEventListener('click', () => {
    switchMode(1);
});

breakBtn.addEventListener('click', () => {
    switchMode(2);
});

longBreakBtn.addEventListener('click', () => {
    switchMode(3);
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
    previewBackBtn.disabled = (audioSelect.value === '');
    alarmSelect.value = settings.alarm;
    previewAlarmBtn.disabled = (alarmSelect.value === '');
    startSelect.value = settings.start; 
    previewStartBtn.disabled = (startSelect.value === '');

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
        //TIMER IS -NOT ACTIVE- WHEN CLOSING MODAL
        if (videoBackgroundRadio.checked) {
            settings.backgroundType = 1;
        } else {
            settings.backgroundType = 0;
        }
        settings.video = videoSelect.value;
        settings.audio = audioSelect.value;
        settings.image = imageSelect.value;
        setBackground();
        updateAudio();
    } else {
        //TIMER IS -ACTIVE- WHEN CLOSING MODAL
        if ((videoBackgroundRadio.checked && settings.backgroundType === 0) || 
        (imageBackgroundRadio.checked && settings.backgroundType === 1))  {
            //background type changed
            if (videoBackgroundRadio.checked) {
                //changing from img to video
                settings.backgroundType = 1;         
                settings.image = imageSelect.value;      
                settings.video = videoSelect.value;
                setBackground();
                if (mode === 1) {
                    videoStart(); 
                }
                 
            } else {
                //changing from video to img
                settings.backgroundType = 0;
                if (mode === 1) {
                    videoStop(); 
                }
                settings.image = imageSelect.value;
                settings.video = videoSelect.value;
                setBackground();
            }
        } else {
            //background type not changed
            if (videoBackgroundRadio.checked && settings.video !== videoSelect.value) {
                //video background and video changed
                console.log('video background and video changed');
                if (mode === 1) {
                    videoStop();
                    settings.image = imageSelect.value;
                    settings.video = videoSelect.value;
                    setBackground();
                    videoStart();
                } else {
                    settings.image = imageSelect.value;
                    settings.video = videoSelect.value;
                    setBackground();
                }
                
            } else if (imageBackgroundRadio.checked && settings.image !== imageSelect.value) {
                console.log('image background and image changed');
                settings.image = imageSelect.value;
                setBackground();
            }
        }

        if (settings.audio !== audioSelect.value) {
            //audio was changed while timer is active
            audioStop();
            settings.audio = audioSelect.value;
            updateAudio();
            if (settings.audio) {
                audioStart();
            }
            
        } else {
            settings.audio = audioSelect.value;
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
    }
    
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

