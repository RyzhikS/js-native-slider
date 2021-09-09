class Carousel {
    constructor(p) {

        // let settings = this._initConfig(params);
        let settings = { ...{ containerID: '#carousel', slideID: '.slide', interval: 2000, isPlaying: true }, ...p };

        this.container = document.querySelector(settings.containerID);
        this.slides = this.container.querySelectorAll(settings.slideID);
        this.interval = settings.interval;
        this.isPlaying = settings.isPlaying
    }

    // amazimg
    // _initConfig(o) {
    //     return { ...{ containerID: '#carousel', slideID: '.slide', interval: 2000, isPlaying: true }, ...o }
    // }

    // good
    // _initConfig(o) {
    //     const p = { containerID: '#carousel', slideID: '.slide', interval: 2000, isPlaying: true };

    //     return { ...p, ...o }
    // }
    // bad
    // _initConfig(objectParams) {
    //     const defaultSettings = {
    //         containerID: '#carousel',
    //         slideID: '.slide',
    //         interval: 2000,
    //         isPlaying: true
    //     };

    //     if (objectParams) {
    //         defaultSettings.containerID = objectParams.containerID || defaultSettings.containerID;
    //         defaultSettings.slideID = objectParams.slideID || defaultSettings.slideID;
    //         defaultSettings.interval = objectParams.interval || defaultSettings.interval;
    //         defaultSettings.isPlaying = objectParams.isPlaying || defaultSettings.isPlaying;
    //     }

    //     return defaultSettings;
    // }

    _initProps() {
        this.slidesCount = this.slides.length;
        this.currentSlide = 0;

        this.CODE_LEFT_ARROW = 'ArrowLeft';
        this.CODE_RIGHT_ARROW = 'ArrowRight';
        this.CODE_SPACE = 'Space';

        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
        this.FA_PREV = '<i class="fas fa-angle-left"></i>';
        this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
    }

    _initControls() {

        const controls = document.createElement('div');

        const PAUSE = `<span id="pause-btn" class="control control--pause">${this.isPlaying ? this.FA_PAUSE : this.FA_PLAY}</span>`;
        const PREV = `<span id="prev-btn" class="control control--prev">${this.FA_PREV}</span>`;
        const NEXT = `<span id="next-btn" class="control control--next">${this.FA_NEXT}</span>`;


        controls.setAttribute('class', 'controls')
        controls.innerHTML = PAUSE + PREV + NEXT;

        this.container.appendChild(controls)

        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.nextBtn = this.container.querySelector('#next-btn');
    }

    _initIndicators() {
        const indicators = document.createElement('div');

        indicators.setAttribute('class', 'indicators');

        for (let i = 0; i < this.slidesCount; i++) {
            const indicator = document.createElement('div');
            indicator.setAttribute('class', 'indicator');
            indicator.dataset.slideTo = `${i}`;
            i === 0 && indicator.classList.add('active');
            indicators.appendChild(indicator);
        }

        this.container.appendChild(indicators);

        this.indicatorsContainer = this.container.querySelector('.indicators');
        this.indicators = this.container.querySelectorAll('.indicator');

    }

    _initListeners() {
        document.addEventListener('keydown', this._pressKey.bind(this));

        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.indicatorsContainer.addEventListener('click', this._indicate.bind(this));

        this.container.addEventListener('mouseenter', this._pause.bind(this))
        this.container.addEventListener('mouseleave', this._play.bind(this))

    }

    _goToNth(n) {
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
        this.currentSlide = (n + this.slidesCount) % this.slidesCount;
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
    }

    _goToPrev() {
        this._goToNth(this.currentSlide - 1)
    }

    _goToNext() {
        this._goToNth(this.currentSlide + 1)
    }

    _pause() {
        if (this.isPlaying) {
            clearInterval(this.timerID);
            this.isPlaying = false;
            this.pauseBtn.innerHTML = this.FA_PLAY;
        }
    }

    _play() {
        this.timerID = setInterval(() => this._goToNext(), this.interval);
        this.isPlaying = true;
        this.pauseBtn.innerHTML = this.FA_PAUSE;
    }

    _indicate(e) {
        const target = e.target;
        if (target && target.classList.contains('indicator')) {
            this._pause();
            this._goToNth(+target.dataset.slideTo);
        }
    }

    _pressKey(e) {
        if (e.code === this.CODE_LEFT_ARROW) this.prev();
        if (e.code === this.CODE_RIGHT_ARROW) this.next();
        if (e.code === this.CODE_SPACE) this.pausePlay();
    }

    pausePlay() {
        this.isPlaying ? this._pause() : this._play();
    }

    prev() {
        this._pause();
        this._goToPrev();
    }

    next() {
        this._pause();
        this._goToNext();
    }

    init() {
        this._initProps();
        this._initControls();
        this._initIndicators();
        this._initListeners();
        if (this.isPlaying) {
            this.timerID = setInterval(() => this._goToNext(), this.interval);
        }

    }
}

export default Carousel;



