// By Leizingyiu
// https://www.leizingyiu.net/?lang=en
// https://twitter.com/leizingyiu
// https://openprocessing.org/sketch/1454055

// This work is licensed under a Creative Commons Attribution NonCommercial ShareAlike 4.0 International License.
// http://creativecommons.org/licenses/by-nc-sa/4.0/

class Musics {
    constructor(loopBoo = false, showTextBoo = false, disableConsoleErrBoo = true) {

        this.musics = [];
        this.music = undefined;
        this.loadingStatus = false;
        this.failStatus = false;
        this.soundName = '';

        this.loopBoo = loopBoo;
        this.showTextBoo = showTextBoo;
        this.disableConsoleErrBoo = disableConsoleErrBoo;
    }
    loadMusic(musicsArr) {
        if (arguments.length == 0) {
            musicsArr = this.musics;
        }
        this.musics = musicsArr;
        let musicR = random(this.musics);
        this.soundName = musicR.split('/').pop();

        if (p5.SoundFile) {
            this.music = loadSound(musicR, () => {
                this.loadingStatus = false;
                this.failStatus = false;
                this.playPauseMusic();
                return this.music;
            }, () => {
                this.loadingStatus = false;
                this.failStatus = true;
                if (showTextBoo === true) { this.showMusicStatus(); }
                return this.music;
            }, () => {
                this.loadingStatus = true;
                this.failStatus = false;
                if (this.showTextBoo === true) {
                    try {
                        this.showMusicStatus();
                    } catch (err) {
                        console.assert(this.disableConsoleErrBoo, err);
                    }
                }
                return this.music;
            });
        } else { console.log('p5.sound is not load yet') }
    }

    loadMusicFromJson(jsonUrl) {
        fetch(jsonUrl).then(response => {
            if (response.ok) { return response.json(); } else { console.err(response); }
        }).then(json => {
            return this.loadMusic(json);
        })
    }
    playPauseMusic() {
        if (this.music.isPlaying() == true) {
            this.music.pause();
        } else {
            if (this.loopBoo == true) {
                this.music.loop();
            } else {
                this.music.play();
            }
        }

        if (this.showTextBoo === true) {
            try {
                this.showMusicStatus();
            } catch (err) {
                console.assert(this.disableConsoleErrBoo, err)
            }
        }
        return this.music;
    }

    musicStatus(failText = "load error,please reload",
        loadingText = "loading, please wait",
        playingText = "music paused, click to play",
        pausedText = "music playing, click to pause") {

        let str;

        if (this.failStatus === true) {
            str = failText;
        } else if (this.loadingStatus === true) {
            str = loadingText;
        } else if (this.music && this.music.isPlaying() === false) {
            str = playingText;
        } else {
            str = pausedText;
        }
        return str;
    }

    switchMusic() {
        this.music.stop();
        delete (this.music);
        this.music = undefined;
        this.loadMusic();
        return this.music;
    }

    play() { this.music.play(); }
    pause() { this.music.pause(); }
    loop() { this.music.loop(); }
    stop() { this.music.stop(); }
    isPlaying() {
        try { return this.music.isPlaying() } catch (err) { console.assert(disableConsoleErrBoo, err); }
    }
}
