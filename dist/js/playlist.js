let songs = [];

class Playlist {
	constructor() {
		this.playlist = BODY.querySelector('#playlist');
		this.submitButton = this.playlist.querySelector('#submitButton');
		this.clearButton = this.playlist.querySelector('#clearButton');
		this.inputs = [...this.playlist.querySelectorAll('input[type="text"]')];

		NAV.addEventListener('click', () => this.togglePlaylist());
		this.submitButton.addEventListener('click', () => this.getInputValues());
		this.clearButton.addEventListener('click', () => this.clearInputValues());
		this.playlist.addEventListener('userSubmitted', () => { if (songs.length > 0) NAV.click(); });
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
		this.playlist.dispatchEvent(new Event('userSubmitted'));
	}

	clearInputValues() {
		songs = [];
		this.inputs.forEach(input => {
			input.value = '';
		});

		this.playlist.dispatchEvent(new Event('userCleared'));
	}
}

const thisPlaylist = new Playlist();



















/*

 Note! This site will throw an error for 'cast_sender.js', which is Google-specific and out of my control: http://stackoverflow.com/questions/24490323/google-chrome-cast-sender-error-if-chrome-cast-extension-is-not-installed-or-usi/32872928#32872928

 */

/*
 var thisBody = document.getElementsByTagName('body');
 var thisMessage = document.getElementById('message');
 var theseControls = document.getElementById('controls');

 function revealList() {
	 nav.classList.toggle("morph");
	 thisBody[0].classList.toggle("push");
	 if (nav.classList.contains('morph')) {
		 thisMessage.classList.add("fade-out");
		 theseControls.classList.add("fade-out");
		 setTimeout(function() {
			 theseControls.style.display = 'none';
		 }, 500);
	 } else {
		 thisMessage.classList.remove("fade-out");
		 theseControls.style.display = '';
		 setTimeout(function() {
			 theseControls.classList.remove("fade-out");
		 }, 100);
		 clearPlaceholders(); // function in handle-links.js line 137
	 }
 }


// Load YouTube API async-ly the old-fashioned way
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Used in the youtube API function line 58
var player;

// My variables for custom YouTube link handling
var felipeReels = document.getElementsByClassName('c-reels');
var currentVideo = document.getElementById('currentVideo');
var newVideoSource;
var songInputs = document.getElementsByTagName('input');

// Flags & Counters
var noFirstLink = true;
var firstLinkIs = "empty";
var countEmptys;
var countFinished;

function toggleFelipe(action) {
	var thisAction = action;
	if (thisAction == "play") {
		for (i = 0; i < felipeReels.length; i++) {
			felipeReels[i].classList.add("animate");
		}
	}
	if (thisAction == "pause") {
		for (i = 0; i < felipeReels.length; i++) {
			felipeReels[i].classList.remove("animate");
		}
	}
}
function submitLinks() {
	// TODO Specify origin i.e. &origin=http://example.com
	var arrayLinks = [];
	countEmptys = 0;
	countFinished = 0;

	for (i = 0; i < songInputs.length - 2; i++) {
		arrayLinks[i] = songInputs[i].value;
		if (arrayLinks[i].indexOf("m.youtube") >= 0) {
			arrayLinks[i] = arrayLinks[i].slice(30);
		} else {
			arrayLinks[i] = arrayLinks[i].slice(32);
		}
		// console.log("Input #" + i + " says: " + arrayLinks[i]);

		if (arrayLinks[i] == "") {
			songInputs[i].value = "";
			songInputs[i].placeholder = "Not from youtube or empty!";
			countEmptys++;
		} else if (arrayLinks[i].indexOf("list") >= 0) {
			songInputs[i].value = "";
			songInputs[i].placeholder = "Sorry, can't accept playlist links.";
			countEmptys++;
		} else if (noFirstLink || firstLinkIs == arrayLinks[i]) {
			newVideoSource = "https://www.youtube.com/embed/" + arrayLinks[i] + "?enablejsapi=1&playlist=";
			currentVideo.src = newVideoSource;
			noFirstLink = false;
			firstLinkIs = arrayLinks[i];
		} else {
			newVideoSource = newVideoSource + arrayLinks[i] + ",";
			currentVideo.src = newVideoSource;
			// TODO remove comma if last available link
		}
	}
	// Don't toggle Felipe on submit unless there's at least one link in the form
	if (countEmptys != songInputs.length - 2) {
		// Used a set timeout to compensate for the amount of time Chrome's browser spits out Chromecast errors before playing iframe link
		setTimeout(function() {
			player.playVideo();
			toggleFelipe("play");
		}, 1500);
		thisMessage.innerHTML = "Got it! Now playing.";
	}
	// console.log("Count Empty is " + countEmptys);
}

function clearLinks() {
	player.destroy(); // So YouTube API doesn't roll out infinite errors due to chromecast requests
	reviveCurrVideo();
	noFirstLink = true;
	firstLinkIs = "empty";

	toggleFelipe("pause");
	thisMessage.innerHTML = "Care for another round?";
}

function onYouTubeIframeAPIReady() {
	player = new YT.Player('currentVideo', {
		events: {
			'onStateChange': onPlayerStateChange
		}
	});
	var playButton = document.getElementById('play');
	var pauseButton = document.getElementById('pause');
	var nextButton = document.getElementById('next');

	playButton.onclick = function() {
		player.playVideo();
		toggleFelipe("play");
		thisMessage.classList.remove('fade-out');
	};
	pauseButton.onclick = function() {
		player.pauseVideo();
		toggleFelipe("pause");
		thisMessage.classList.add('fade-out');
	};
	nextButton.onclick = function() {
		player.nextVideo();
		countFinished++;
	};
}

function reviveCurrVideo() {
	var reviveCurrVideo = document.createElement('iframe');
	reviveCurrVideo.id = 'currentVideo';
	firstScriptTag = document.getElementsByTagName('script')[0]; // since first script is now YouTube API
	firstScriptTag.parentNode.insertBefore(reviveCurrVideo, firstScriptTag);
	currentVideo = document.getElementById('currentVideo'); // point variable to new element instance
	onYouTubeIframeAPIReady(); // tie controls to new element
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		var numberOfLinks = (songInputs.length - 2) - countEmptys;
		// console.log("Number of links is: " + numberOfLinks);

		countFinished++;
		// console.log("Count Finished is: " + countFinished);

		if (countFinished == numberOfLinks) {
			clearLinks();
		}
	}
}

function clearPlaceholders() {
	for (i = 0; i < songInputs.length - 2; i++) {
		songInputs[i].placeholder = "YouTube Link #" + (i + 1);
	}
}

function setRepeat() {
	var currVideoSource = currentVideo.src;
	var thisVideoId = player.getVideoUrl();
	thisVideoId = thisVideoId.slice(32);

	if (currVideoSource.indexOf("loop") >= 0) {
		player.destroy();
		reviveCurrVideo();
		currentVideo = document.getElementById('currentVideo'); // point variable to new element instance
		currentVideo.src = newVideoSource;
		thisMessage.innerHTML = "Removing repeats... Playlist refreshed!";
	} else {
		currentVideo.src = "http://www.youtube.com/embed/" + thisVideoId + "?enablejsapi=1&loop=1&playlist=" + thisVideoId;
		setTimeout(function() {
			player.playVideo();
			toggleFelipe("play");
		}, 1000);
		thisMessage.innerHTML = "Sure, I'll put that song on repeat.";
	}
}
*/