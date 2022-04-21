let player = null;
let youtubeTitle = '';

// These functions are from Youtube iframe API and must exist globally
// https://developers.google.com/youtube/iframe_api_reference#Examples

function onYouTubeIframeAPIReady() {
	const triggerEls = [PLAYLIST, CASSETTE];

	triggerEls.forEach(el => {
		let eventType = (el.getAttribute('id') === 'playlist') ? 'userSubmitted' : 'cassetteSkip';

		el.addEventListener(eventType, async function() {
			if (eventType === 'cassetteSkip') clearVideo();

			let videoProps = await getVideoProps();
			youtubeTitle = videoProps.title;

			player = new YT.Player('youtubeIframe', {
				width: '200',
				height: '200',
				videoId: videoProps.id,
				playerVars: {
					'controls': 0,
					'disablekb': 0,
					'enablejsapi': 1,
					'playsinline': 1
				},
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange,
					'onError': onPlayerError,
				}
			});
		});
	});

	PLAYLIST.addEventListener('userCleared', () => clearVideo());
}

function onPlayerReady() {
	// Creating separate functions for CASSETTE listeners allow us to use removeEventListener
	CASSETTE.addEventListener('cassettePlay', handlePlay);
	CASSETTE.addEventListener('cassettePause', handlePause);
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		VIDEO_WRAPPER.dispatchEvent(new Event('videoEnded'));
	}
}

function onPlayerError() {
	console.log('ERROR');
}

// These functions are my own :)

function handlePlay() {
	player.playVideo();
}

function handlePause() {
	player.pauseVideo();
}

function getVideoProps() {
	return new Promise((resolve, reject) => {
		const query = encodeURIComponent(songs[songIndex]);
		console.log(query);

		fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q='${query}&type=video&key=AIzaSyA_EbJZbrv29sZVA7zXNTWp1O8d3C6Mfn4`)
			.then(result => result.json()) // API response must be parsed first!
			.then(data => {
				return {
					id: data.items[0].id.videoId,
					title: data.items[0].snippet.title
				}
			})
			.then(videoProps => {
				console.log(videoProps);
				resolve(videoProps);
			})
			.catch(err => {
				console.error(err);
				reject(false);
			});
	});
}

function clearVideo() {
	let resetIframe = document.createElement('div');
	resetIframe.setAttribute('id', 'youtubeIframe');

	CASSETTE.removeEventListener('cassettePlay', handlePlay());
	CASSETTE.removeEventListener('cassettePause', handlePause());

	VIDEO_WRAPPER.innerHTML = '';
	VIDEO_WRAPPER.appendChild(resetIframe);
}