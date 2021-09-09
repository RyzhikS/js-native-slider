(function () {
    const container = document.querySelector('#carousel');
    const slides = container.querySelectorAll('.slide');
    const indicatorsContainer = container.querySelector('#indicators-container');
    const indicators = container.querySelectorAll('.indicator');
    const pauseBtn = container.querySelector('#pause-btn');
    const prevBtn = container.querySelector('#prev-btn');
    const nextBtn = container.querySelector('#next-btn');

    const slidesCount = slides.length;

    const CODE_LEFT_ARROW = 'ArrowLeft';
    const CODE_RIGHT_ARROW = 'ArrowRight';
    const CODE_SPACE = 'Space';

    const FA_PAUSE = '<i class="far fa-pause-circle"></i>';
    const FA_PLAY = '<i class="far fa-play-circle"></i>';


    let currentSlide = 0;
    let isPlaying = true;
    let timerID = null;
    let swipeStartX = null;
    let swipeEndX = null;
    let interval = 1000;

    function goToNth(n) {
        slides[currentSlide].classList.toggle('active');
        indicators[currentSlide].classList.toggle('active');
        currentSlide = (n + slidesCount) % slidesCount;
        slides[currentSlide].classList.toggle('active');
        indicators[currentSlide].classList.toggle('active');
    }

    const goToPrev = () => goToNth(currentSlide - 1);

    const goToNext = () => goToNth(currentSlide + 1);

    function pause() {
        if (isPlaying) {
            clearInterval(timerID);
            isPlaying = false;
            pauseBtn.innerHTML = FA_PLAY
        }
    }

    function play() {
        timerID = setInterval(goToNext, interval);
        isPlaying = true;
        pauseBtn.innerHTML = FA_PAUSE;
    }

    const pausePlay = () => isPlaying ? pause() : play();

    function prev() {
        pause();
        goToPrev();
    }

    function next() {
        pause();
        goToNext();
    }

    timerID = setInterval(goToNext, interval);

    function indicate(e) {
        const target = e.target;
        if (target && target.classList.contains('indicator')) {
            pause();
            goToNth(+target.dataset.slideTo);
        }
    }

    function pressKey(e) {
        if (e.code === CODE_LEFT_ARROW) next();
        if (e.code === CODE_RIGHT_ARROW) next();
        if (e.code === CODE_SPACE) pausePlay();
    }

    function swipeStart(e) {
        swipeStartX = e.changedTouches[0].pageX;
    }

    function swipeEnd(e) {
        swipeEndX = e.changedTouches[0].pageX;
        if (swipeStartX - swipeEndX > 100) next();
        if (swipeStartX - swipeEndX < -100) prev();

    }

    pauseBtn.addEventListener('click', pausePlay);
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    indicatorsContainer.addEventListener('click', indicate);
    carousel.addEventListener('touchstart', swipeStart);
    carousel.addEventListener('touchend', swipeEnd);
    document.addEventListener('keydown', pressKey);

}())


