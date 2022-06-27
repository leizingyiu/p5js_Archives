// By Leizingyiu
// https://www.leizingyiu.net/?lang=en
// https://twitter.com/leizingyiu
// https://openprocessing.org/sketch/1454055

// Last modified: "2022/02/07 01:41:11"

// This work is licensed under a Creative Commons Attribution NonCommercial ShareAlike 4.0 International License.
// http://creativecommons.org/licenses/by-nc-sa/4.0/

class Musics {
    constructor(loopBoo = false, showTextBoo = false, disableConsoleErrBoo = true, autoplayBoo = true) {

        this.musics = [];
        this.music = undefined;
        this.loadingStatus = false;
        this.failStatus = false;
        this.soundName = '';

        this.loopBoo = loopBoo;
        this.showTextBoo = showTextBoo;
        this.disableConsoleErrBoo = disableConsoleErrBoo;
        this.autoplay = autoplayBoo;
        this.successCallback = () => { };
        this.errorCallback = () => { };
        this.whileLoading = () => { };
    }

    setCallBack(successCallback = this.successCallback,
        errorCallback = this.errorCallback,
        whileLoading = this.whileLoading) {
        this.successCallback = successCallback != false ? successCallback : this.successCallback;
        this.errorCallback = errorCallback != false ? errorCallback : this.errorCallback;
        this.whileLoading = whileLoading != false ? whileLoading : this.whileLoading;
    }

    loadMusicsArr(musicsArr = this.musics) {
        if (arguments.length != 0) {
            this.musics = [...new Set(this.musics.concat(musicsArr))];
        }
        let musicURL = random(this.musics);
        this.loadMusic(musicURL);
    }

    loadMusic(musicURL) {
        this.musics.push(musicURL);
        this.musics = [...new Set(this.musics)];

        if (p5.SoundFile) {
            if (musicURL.match(/[^\.\/]+\.[^\.]+$/)) {
                this.soundName = musicURL.split('/').pop();
            } else {
                console.log('music url is not a file name, pls set manually');
            }

            this.music = loadSound(musicURL,
                () => { // successCallback;
                    this.loadingStatus = false;
                    this.failStatus = false;

                    if (this.autoplay == true) {
                        this.playPauseMusic();
                    } else {
                        let maxStrLength = 20;
                        console.log(`loaded music ${this.soundName.slice(0, maxStrLength) + this.soundName.length > maxStrLength ? '...' : ''}`);
                    }
                    this.successCallback();
                    return this.music;
                },
                () => { // errorCallback;
                    this.loadingStatus = false;
                    this.failStatus = true;
                    if (showTextBoo === true) {
                        this.showMusicStatus();
                    }
                    this.errorCallback();
                    return this.music;
                },
                () => { // loadingCallback;
                    this.loadingStatus = true;
                    this.failStatus = false;
                    if (this.showTextBoo === true) {
                        try {
                            this.showMusicStatus();
                        } catch (err) {
                            console.assert(this.disableConsoleErrBoo, err);
                        }
                    }
                    this.whileLoading();
                    return this.music;
                });
        } else { // error when p5.sound is not load yet
            p5SoundNotLoad()
            this.errorCallback();
            this.soundName = musicURL + ' | load error';
        }
    }

    loadMusicFromJson(jsonUrl) {
        fetch(jsonUrl).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.err(response);
            }
        }).then(json => {
            return this.loadMusicsArr(json);
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
        playingText = "music playing, click to pause",
        pausedText = "music paused, click to play") {

        let str;

        if (this.failStatus === true) {
            str = failText;
        } else if (this.loadingStatus === true) {
            str = loadingText;
        } else if (this.music && this.music.isPlaying() === true) {
            str = playingText;
        } else if (this.music && this.music.isPlaying() === false) {
            str = pausedText;
        } else {
            return false
        }
        return str;
    }
    showMusicStatus() {
        push();
        let str = this.musicStatus();
        translate(width / 2, height / 2)
        textAlign(CENTER, CENTER);
        fill(255);
        text(str, 0, 0);
        pop();
    }
    switchMusic(musicUrl) {

        this.music && this.music.stop();
        delete (this.music);
        this.music = undefined;
        if (arguments.length != 0) {
            this.loadMusic(musicUrl);
        } else {
            this.loadMusicsArr();
        }
        return this.music;
    }

    play() {
        if (p5.SoundFile) {
            this.music.play();
        } else {
            p5SoundNotLoad()
            this.errorCallback();
        }
    }
    pause() {
        if (p5.SoundFile) {
            this.music.pause();
        } else {
            p5SoundNotLoad()
            this.errorCallback();
        }
    }
    loop() {
        if (p5.SoundFile) {
            this.music.loop();
        } else {
            p5SoundNotLoad()
            this.errorCallback();
        }
    }
    stop() {
        if (p5.SoundFile) {
            this.music.stop();
        } else {
            p5SoundNotLoad()
            this.errorCallback();
        }
    }
    isPlaying() {
        if (p5.SoundFile) {

            try {
                return this.music.isPlaying()
            } catch (err) {
                console.assert(disableConsoleErrBoo, err);
            }
        } else {
            p5SoundNotLoad()
            this.errorCallback();
        }
    }
    p5SoundNotLoad() {
        console.log('p5.sound is not load yet')
    }
}