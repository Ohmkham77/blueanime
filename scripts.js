const videoContainer = document.querySelector(".video-container");
const playPauseBtn = document.querySelector(".play-pause-btn");
const videoControlsContainer = document.querySelector(".video-controls-container");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const video = document.querySelector("video");
const settingBtn = document.querySelector(".setting-btn");
const captionBtn = document.querySelector(".caption-btn");
const timeLineContainer = document.querySelector(".timeline-container");
const videoControlsOnVideo = document.querySelector(".video-controls-onVideo");
const videoTrackContainer = document.querySelector('.video-track-container');
const VideoCurrentTime = document.querySelector(".current-time");
const VideoDuration = document.querySelector(".total-time");

document.addEventListener("keydown", e => {

    const tageName = document.activeElement.tagName.toLowerCase();

    if (tageName === "input") return;

    switch (e.key.toLowerCase()) {
        case " ":
            if (tageName === "button") return;
        case "k": togglePlay();
            videoControlsOnVideo.classList.remove("opacity-zero");
            break;
        case "f": toggleFullScreenMode();
            break;
    }
});

// Time Line

timeLineContainer.addEventListener("mousemove", handleTimeLineUpdate);
timeLineContainer.addEventListener("click", UpdateTimeLine);

function handleTimeLineUpdate(e) {
    const rect = timeLineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timeLineContainer.style.setProperty("--preview-position", percent);
}

function UpdateTimeLine(e) {
    const rect = timeLineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timeLineContainer.style.setProperty("--progress-position", percent);
    video.currentTime = percent * video.duration;
}

video.addEventListener("timeupdate", () => {
    VideoCurrentTime.textContent = formatDuration(video.currentTime);
    const percent = video.currentTime / video.duration;
    timeLineContainer.style.setProperty("--progress-position", percent);
})

// Duration

video.addEventListener("loadeddata", () => {
    VideoDuration.textContent = formatDuration(video.duration);
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2, });

function formatDuration(time) {
    const sec = Math.floor(time % 60);
    const min = Math.floor(time / 60) % 60;
    const hor = Math.floor(time / 3600);

    if (hor === 0) {
        return `${min}:${leadingZeroFormatter.format(sec)}`
    } else {
        return `${hor}:${leadingZeroFormatter(min)}:${leadingZeroFormatter.format(sec)}`
    }
}

//  Play and Pause

videoControlsOnVideo.addEventListener("click", function () {
    togglePlay();
    videoControlsOnVideo.classList.remove("opacity-zero");
});
playPauseBtn.addEventListener("click", function () {
    togglePlay();
    videoControlsOnVideo.classList.add("opacity-zero");
});

function togglePlay() {
    video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
    videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
    videoContainer.classList.add("paused");
});

// FullScreen

let timeoutId;


fullScreenBtn.addEventListener("click", toggleFullScreenMode);
videoContainer.addEventListener("dblclick", toggleFullScreenMode);

function toggleFullScreenMode() {

    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen();
        SetControlsInPlayFullMode();
    } else {
        document.exitFullscreen();
    }
}

document.addEventListener("fullscreenchange", () => {
    videoContainer.classList.toggle("full-screen");
    SetControlsInPlayFullMode();
});

function SetControlsInPlayFullMode() {
    let videoContainerFullScreen = videoContainer.classList.contains("full-screen");

    function fadeOut() {
        videoContainer.classList.add("opacity-zero");
        videoContainer.style.cursor = "none";
    }

    function resetOpcatiy() {
        videoContainer.classList.remove("opacity-zero");
        videoContainer.style.cursor = "default";
    }
    videoContainer.addEventListener('mousemove', function () {
        if (videoContainer.classList.contains("opacity-zero") || !videoContainerFullScreen) {
            clearTimeout(timeoutId);
            resetOpcatiy();
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(fadeOut, 4000);
        }
    });
}


// ASS Subtitle


(function (libjass) {
    'use strict';

    var vjs_ass = function (options) {
        var overlay = document.createElement('div'),
            clock = null,
            clockRate = options.rate || 1,
            delay = options.delay || 0,
            player = options.player,
            subCon = options.subCon,
            renderer = null,
            AssButton = null;

        if (!options.src) {
            return;
        }

        overlay.className = 'vjs-ass';

        subCon.insertBefore(overlay, subCon.firstChild.nextSibling);

        function getCurrentTime() {
            return player.currentTime - delay;
        }

        clock = new libjass.renderers.AutoClock(getCurrentTime, 500);

        player.addEventListener('play', function () {
            clock.play();
        });

        player.addEventListener('pause', function () {
            clock.pause();
        });

        player.addEventListener('seeking', function () {
            clock.seeking();
        });

        function updateClockRate() {
            clock.setRate(player.playbackRate * clockRate);
        }

        updateClockRate();
        player.addEventListener('ratechange', updateClockRate);

        function updateDisplayArea() {
            setTimeout(function () {
                renderer.resize(player.offsetWidth, player.offsetHeight);
            }, 10);
        }

        window.addEventListener('resize', updateDisplayArea);

        player.addEventListener('loadedmetadata', updateDisplayArea);
        player.addEventListener('resize', updateDisplayArea);
        player.addEventListener('fullscreenchange', updateDisplayArea);

        player.addEventListener('dispose', function () {
            clock.disable();
        });

        libjass.ASS.fromUrl(options.src, libjass.Format.ASS).then(
            function (ass) {
                var rendererSettings = new libjass.renderers.RendererSettings();
                if (options.hasOwnProperty('enableSvg')) {
                    rendererSettings.enableSvg = options.enableSvg;
                }
                if (options.hasOwnProperty('fontMap')) {
                    rendererSettings.fontMap = new libjass.Map(options.fontMap);
                } else if (options.hasOwnProperty('fontMapById')) {
                    rendererSettings.fontMap = libjass.renderers.RendererSettings
                        .makeFontMapFromStyleElement(document.getElementById(options.fontMapById));
                }

                renderer = new libjass.renderers.WebRenderer(ass, clock, overlay, rendererSettings);
            }
        );

        captionBtn.addEventListener('click', () => {
            updateDisplayArea();
            if (videoContainer.classList.contains('inactive')) {
                videoContainer.classList.remove('inactive');
                overlay.style.display = "";
            } else {
                videoContainer.classList.add('inactive');
                overlay.style.display = "none";
            }
        })
    };

    window.libjass_ass = vjs_ass;
}(window.libjass));


window.addEventListener("resize", setEpListConHeight);
window.addEventListener("DOMContentLoaded", setEpListConHeight);

function setEpListConHeight() {
    const relatedEpCon = document.querySelector(".related-episode-con");
    const videoPlayerHeight = videoContainer.scrollHeight;
    relatedEpCon.style.setProperty("--episode-list-height", videoPlayerHeight + "px");
}


