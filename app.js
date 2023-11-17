const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE = 'player'

const heading = $('header h1');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const volumeBtn = $('.volumn-option');
const changeVolume = $('#volumn');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isVolume: false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},

    songs: [
        {
            name: 'Say you wont let go',
            singer: 'James Arthur',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Somewhere only we know',
            singer: 'Keane',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Be more',
            singer: 'Stephen Sanchez',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Another love',
            singer: 'Tom Odell',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Love the way you lie',
            singer: 'Eminiem',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Nơi này có anh',
            singer: 'Sơn Tùng M-TP',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Someone you love',
            singer: 'Lewis Capaldi',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpeg'
        },
        {
            name: 'Photograph',
            singer: 'Ed Sheeran',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.png'
        },
        {
            name: 'Suýt nữa thì',
            singer: 'Andiez',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Viva la vida',
            singer: 'Coldplay',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        },
        {
            name: 'Let Her Go (Feat. Ed Sheeran - Anniversary Edition)',
            singer: 'Passenger',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config));
    },
    getConfig: function() {
        // this.isRandom = this.config.isRandom;
        // this.isRepeat = this.config.isRepeat;


    },
    loadConfig: function() {

        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body" title="${song.name} - ${song.singer}">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>

                            <div class="option js-option-${index}" onclick="handleOptionClick(event)" data-option=${index}>
                                <i class="fas fa-ellipsis-h"></i>
                                <div class="option-container hide btn-group-vertical" >
                                    <button class="btn btn-primary option-item option-item1-${index}" type="button">
                                        <i class="bi bi-cloud-arrow-down-fill"></i>
                                    </button>
                                    <button class="btn btn-primary option-item option-item2-${index}" type="button">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `
        });
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function() {
        const _this = this;

        // Xử lý xoay cdThumb
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();
        // play 
        playBtn.onclick = function() {
            _this.isPlaying ? audio.pause() : audio.play();
        };
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();

        };
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };
        // Tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPercent;
                const timeRange = $('#timeRange');
                

                function convertSecondsToMinutesAndSeconds(seconds) {
                    let minutes = Math.floor(seconds / 60);
                    let remainingSeconds = seconds % 60;
                
                    // Đảm bảo rằng remainingSeconds luôn là hai chữ số bằng cách thêm số 0 phía trước nếu cần
                    remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
                
                    return `${minutes}:${remainingSeconds}`;
                }
                timeRange.textContent = `${convertSecondsToMinutesAndSeconds(Math.floor(audio.currentTime))}/${convertSecondsToMinutesAndSeconds(Math.floor(audio.duration))}`;

                
            }

        };
        // Tua bài hát
        progress.oninput = function(e) {
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        };

        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            _this.prevSong();
            audio.play();
            _this.updateActiveSong();
            _this.scrollToActiveSong();
        }
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            _this.nextSong();
            audio.play();
            _this.updateActiveSong();
            _this.scrollToActiveSong();

            
        }
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            this.classList.toggle('active', _this.isRandom);
        }
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            this.classList.toggle('active', _this.isRepeat);
        }
        audio.onended = function() {
            if(!_this.isRepeat) {
                _this.nextSong();
            }
            audio.play();
        }
        // Lắng nghe hành vi click vào playList
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode ) {
                _this.currentIndex = songNode.dataset.index;
                _this.loadCurrentSong();
                audio.play();
                _this.updateActiveSong();

            }
        }
        volumeBtn.onclick = function() {

            _this.isVolume = !_this.isVolume;
            changeVolume.style.width = _this.isVolume ? "100px" : "0";
            changeVolume.style.opacity = _this.isVolume ? "1" : "0";

            setTimeout(() => {
                _this.isVolume = false;
                changeVolume.style.opacity = '0';
                changeVolume.style.width = '0';
            }, 5000);

        } 
        changeVolume.oninput = function() {
            const volumeValue = changeVolume.value;
            audio.volume = volumeValue;

            const iconMute = document.querySelector('.bi-volume-mute-fill'); 
            const iconUp = document.querySelector('.bi-volume-up-fill'); 
            const iconDown = document.querySelector('.bi-volume-down-fill'); 
            if(volumeValue == 0) {
                iconMute.classList.remove('hide');
                iconUp.classList.add('hide');
                iconDown.classList.add('hide');
            } else if(volumeValue > 0.5) {
                iconMute.classList.add('hide');
                iconUp.classList.remove('hide');
                iconDown.classList.add('hide');
            } else {
                iconMute.classList.add('hide');
                iconUp.classList.add('hide');
                iconDown.classList.remove('hide');
            }
        }
        

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}`;
        audio.src = this.currentSong.path;
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },    
    playRandomSong: function() {
        let randomIndexSong = Math.floor(Math.random() * this.songs.length);
        while(randomIndexSong === this.currentIndex) {
            randomIndexSong = Math.floor(Math.random() * this.songs.length);
        }
        this.currentIndex = randomIndexSong;
        this.loadCurrentSong();
    },
    updateActiveSong: function() {        
        const songElements = document.querySelectorAll('.song'); 
        songElements.forEach(songElement => {
            songElement.classList.remove('active');
        });
        songElements[this.currentIndex].classList.add('active');
    },
    scrollToActiveSong: function() {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        });
    },

    start: function() {
        // Load config
        this.loadConfig();
        // Định nghĩa thuộc tỉnh cho Obj
        this.defineProperties();
        // Xử lý sự kiện
        this.handleEvents();
        // Tải thông tin đầu hát đầu tiên
        this.loadCurrentSong();
        // Render
        this.render();


        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);

    }, 
};

app.start();

