function Carousel(containerID = '#carousel', slideID = '.slide') {
    this.container = document.querySelector(containerID);
    this.slides = this.container.querySelectorAll(slideID);
    this.interval = 1000;
}

Carousel.prototype = {

    _initProps() {
        this.test = 'test';
        this.test2 = 'test2';

        this.slidesCount = this.slides.length;

        this.CODE_LEFT_ARROW = 'ArrowLeft';
        this.CODE_RIGHT_ARROW = 'ArrowRight';
        this.CODE_SPACE = 'Space';

        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
        this.FA_PREV = '<i class="fas fa-angle-left"></i>';
        this.FA_NEXT = '<i class="fas fa-angle-right"></i>';


        this.currentSlide = 0;
        this.isPlaying = true;
        this.timerID = null;
        this.swipeStartX = null;
        this.swipeEndX = null;
    },

    _initControls() {

        const controls = document.createElement('div');

        const PAUSE = `<span id="pause-btn" class="control control--pause">${this.FA_PAUSE}</span>`;
        const PREV = `<span id="prev-btn" class="control control--pause">${this.FA_PREV}</span>`;
        const NEXT = `<span id="next-btn" class="control control--pause">${this.FA_NEXT}</span>`;


        controls.setAttribute('class', 'controls')
        controls.innerHTML = PAUSE + PREV + NEXT;

        this.container.appendChild(controls)

        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.nextBtn = this.container.querySelector('#next-btn');
    },

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

    },

    _initListeners() {
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));

        this.indicatorsContainer.addEventListener('click', this._indicate.bind(this));

        document.addEventListener('keydown', this._pressKey.bind(this));
    },

    _goToNth(n) {
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
        this.currentSlide = (n + this.slidesCount) % this.slidesCount;
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
    },

    _goToPrev() {
        this._goToNth(this.currentSlide - 1)
    },

    _goToNext() {
        this._goToNth(this.currentSlide + 1)
    },

    _pause() {
        if (this.isPlaying) {
            clearInterval(this.timerID);
            this.isPlaying = false;
            this.pauseBtn.innerHTML = this.FA_PLAY;
        }
    },

    _play() {
        this.timerID = setInterval(() => this._goToNext(), this.interval);
        this.isPlaying = true;
        this.pauseBtn.innerHTML = this.FA_PAUSE;
    },

    _indicate(e) {
        const target = e.target;
        if (target && target.classList.contains('indicator')) {
            this._pause();
            this._goToNth(+target.dataset.slideTo);
        }
    },

    _pressKey(e) {
        if (e.code === this.CODE_LEFT_ARROW) this.prev();
        if (e.code === this.CODE_RIGHT_ARROW) this.next();
        if (e.code === this.CODE_SPACE) this.pausePlay();
    },

    pausePlay() {
        this.isPlaying ? this._pause() : this._play();
    },

    prev() {
        this._pause();
        this._goToPrev();
    },

    next() {
        this._pause();
        this._goToNext();
    },

    init() {
        this._initProps();
        this._initControls();
        this._initIndicators();
        this._initListeners();
        this.timerID = setInterval(() => this._goToNext(), this.interval);
    }
}

function SwipeCarousel() {
    Carousel.apply(this, arguments);
}

SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.constructor = SwipeCarousel;

SwipeCarousel.prototype._swipeStart = function (e) {
    this.swipeStartX = e.changedTouches[0].pageX;
};

SwipeCarousel.prototype._swipeEnd = function (e) {
    this.swipeEndX = e.changedTouches[0].pageX;
    if (this.swipeStartX - this.swipeEndX > 100) this.next();
    if (this.swipeStartX - this.swipeEndX < -100) this.prev();
};

SwipeCarousel.prototype._initListeners = function () {
    Carousel.prototype._initListeners.apply(this);
    this.container.addEventListener('touchstart', this._swipeStart.bind(this));
    this.container.addEventListener('touchend', this._swipeEnd.bind(this));
}
