let songs = [];
let songIndex = 0;

class Playlist {
	constructor() {
		this.submitButton = PLAYLIST.querySelector('#submitButton');
		this.clearButton = PLAYLIST.querySelector('#clearButton');
		this.inputs = [...PLAYLIST.querySelectorAll('input[type="text"]')];

		NAV.addEventListener('click', () => this.togglePlaylist());
		this.submitButton.addEventListener('click', () => this.getInputValues());
		this.clearButton.addEventListener('click', () => this.clearInputValues());
	}

	togglePlaylist() {
		BODY.classList.toggle('push-left');
		NAV.classList.toggle('open-playlist');

		const event = (NAV.classList.contains('open-playlist')) ? new Event('navOpened') : new Event('navClosed');
		NAV.dispatchEvent(event);
	}

	getInputValues() {
		songs = this.inputs
			.filter(input => { return input.value.length > 0; })
			.map(input => input.value);

		console.log(songs);
		PLAYLIST.dispatchEvent(new Event('userSubmitted'));
		NAV.click();
	}

	clearInputValues() {
		songs = [];

		this.inputs.forEach(input => {
			input.value = '';
		});

		PLAYLIST.dispatchEvent(new Event('userCleared'));
	}
}

const thisPlaylist = new Playlist();