class Cassette {
	constructor() {
		this.cassette = BODY.querySelector('#cassette');
		this.message = this.cassette.querySelector('#cMessage');
		this.playButton = this.cassette.querySelector('#play');
		this.playlist = BODY.querySelector('#playlist');
		this.songIndex = 0;

		this.handleUIFade();
		this.handlePlay();
		this.handlePause();
		this.handleSkip();

		this.playlist.addEventListener('userSubmitted', () => { if (songs.length > 0) this.playButton.click()});
		this.playlist.addEventListener('userCleared', () => this.handleStop());
	}

	handleUIFade() {
		const fadeEls = document.querySelectorAll('.fade-with-playlist');
		const controls = this.cassette.querySelector('#cControls')

		NAV.addEventListener('navOpened', () => {
			fadeEls.forEach(el => {
				el.classList.add('fade-out');
			});
		});

		NAV.addEventListener('navClosed', () => {
			fadeEls.forEach(el => {
				el.classList.remove('fade-out');
			});
		});
	}

	animateWheels(state) {
		const wheels = this.cassette.querySelectorAll('.c-wheels');

		wheels.forEach(wheel => {
			if (state === 'play') {
				wheel.classList.add('animate');
				wheel.classList.remove('pause-animations');
			} else if (state === 'pause') {
				wheel.classList.add('pause-animations');
			} else {
				wheel.classList.remove('animate');
				wheel.classList.remove('pause-animations');
			}
		});
	}

	animateTitle(state) {
		const songTitle = this.cassette.querySelector('#cSongTitle');

		if (state === 'play') {
			console.log(songs[this.songIndex]);
			songTitle.innerHTML = songs[this.songIndex];
			songTitle.classList.add('animate');
			songTitle.classList.remove('pause-animations');
		} else if (state === 'pause') {
			songTitle.classList.add('pause-animations');
		} else {
			songTitle.innerHTML = '';
			songTitle.classList.remove('animate');
			songTitle.classList.remove('pause-animations');
		}
	}

	handlePlay() {
		this.playButton.addEventListener('click', () => {
			if (songs.length > 0) {
				this.cassette.dataset.cassetteState = 'playing';
				this.animateWheels('play');
				this.animateTitle('play');
			}
		});
	}

	handlePause() {
		const pauseButton = this.cassette.querySelector('#pause');
		pauseButton.addEventListener('click', () => {
			if (songs.length > 0) {
				this.cassette.dataset.cassetteState = 'paused';
				this.animateWheels('pause');
				this.animateTitle('pause');
			}
		});
	}

	handleSkip() {
		const skipButton = this.cassette.querySelector('#skip');
		skipButton.addEventListener('click', () => {
			if (songs.length > 0 && this.songIndex !== songs.length - 1) {
				this.songIndex++;
				this.animateWheels('play');
				this.animateTitle('play');
			}
		});
	}

	handleStop() {
		this.cassette.dataset.cassetteState = '';
		this.animateWheels('stop');
		this.animateTitle('stop');
		this.songIndex = 0;
	}
}

const Felipe = new Cassette();