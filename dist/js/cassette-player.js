class Cassette {
	constructor() {
		this.message = CASSETTE.querySelector('#cMessage');
		this.playButton = CASSETTE.querySelector('#play');
		this.lastSongIndex = null;
		this.themeIndex = 0;

		this.handleUIFade();
		this.handleUITheme();
		this.handlePlay();
		this.handlePause();
		this.handleSkip();
		this.handleStop();

		PLAYLIST.addEventListener('userSubmitted', () => this.message.innerHTML = 'Press play when you’re ready!');
		PLAYLIST.addEventListener('userCleared', () => this.handleStop());
		VIDEO_WRAPPER.addEventListener('videoEnded', () => this.handleStop());
	}

	handleUIFade() {
		const fadeEls = document.querySelectorAll('.fade-with-playlist');

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

	handleUITheme() {
		const themes = ['felipe', 'porter', 'alexis', 'tesfaye'];
		const themeHook = BODY.querySelector('#cChangeTheme');
		let root = document.documentElement;
		root.classList.add(themes[this.themeIndex]);

		themeHook.addEventListener('click', (event) => {
			root.classList = '';
			root.classList.add(themes[this.themeIndex]);
			this.themeIndex++;

			if (this.themeIndex === themes.length) {
				this.themeIndex = 0;
			}
		});
	}

	animateReels(state) {
		const reels = CASSETTE.querySelectorAll('.c-reels');

		reels.forEach(reel => {
			if (state === 'play') {
				reel.classList.add('animate');
				reel.classList.remove('pause-animations');
			} else if (state === 'pause') {
				reel.classList.add('pause-animations');
			} else {
				reel.classList.remove('animate');
				reel.classList.remove('pause-animations');
			}
		});
	}

	animateTitle(state) {
		const songTitle = CASSETTE.querySelector('#cSongTitle');

		if (state === 'play') {
			console.log(songs[songIndex]);
			songTitle.innerHTML = youtubeTitle;
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
				CASSETTE.dispatchEvent(new Event('cassettePlay'));
				CASSETTE.dataset.cassetteState = 'playing';
				this.updatePlayMessage();
				this.animateReels('play');
				this.animateTitle('play');
			}
		});
	}

	handlePause() {
		const pauseButton = CASSETTE.querySelector('#pause');
		pauseButton.addEventListener('click', () => {
			if (songs.length > 0) {
				CASSETTE.dispatchEvent(new Event('cassettePause'));
				CASSETTE.dataset.cassetteState = 'paused';
				this.animateReels('pause');
				this.animateTitle('pause');
			}
		});
	}

	handleSkip() {
		const skipButton = CASSETTE.querySelector('#skip');
		skipButton.addEventListener('click', () => {
			if (songs.length > 0 && songIndex !== songs.length - 1) {
				songIndex++;
				CASSETTE.dispatchEvent(new Event('cassetteSkip'));

				// Gives YouTube API time to hook into new iframe
				// TODO: This is fragile; change approach to creating all the iframes queued from the video instead
				setTimeout(() => {
					this.playButton.click();
				}, 1000);
			}
		});
	}

	// TODO: Account for video stopping but there are still songs left in playlist
	handleStop() {
		CASSETTE.dataset.cassetteState = '';
		this.message.innerHTML = 'Hey, check the menu! I’ll build a mix for ya.';
		this.animateReels('stop');
		this.animateTitle('stop');
		this.lastSongIndex = null;
		songIndex = 0;
	}

	updatePlayMessage() {
		const playMessages = [
			'Excellent choice!',
			'Is this a throwback?',
			'We have similar tastes ;)',
			'I heard this at a wedding.',
			'I’m not judging you :)'
		];

		if (this.lastSongIndex === null || this.lastSongIndex !== songIndex) {
			let randomIndex = Math.floor(Math.random() * playMessages.length);
			this.message.innerHTML = playMessages[randomIndex];
			this.lastSongIndex = songIndex;
		}
	}
}

const Felipe = new Cassette();