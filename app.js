class MoodMusicApp {
	constructor() {
		this.currentMood = 'happy';
		this.isPlaying = false;
		this.currentTrackIndex = 0;
		this.spotifyPlayer = null;
		this.embedError = false;
		this.initializeElements();
		this.initializeEventListeners();
	}

	initializeElements() {
		this.moodEmoji = document.getElementById('mood-emoji');
		this.moodName = document.getElementById('mood-name');
		this.moodSlider = document.getElementById('mood-slider');
		this.playlistContainer = document.getElementById('playlist-container');
		this.playlistFrame = document.getElementById('playlist-frame');
		this.fallbackMessage = document.getElementById('fallback-message');
		this.playlistLink = document.getElementById('playlist-link');
		this.playPauseBtn = document.getElementById('play-pause');
		this.prevTrackBtn = document.getElementById('prev-track');
		this.nextTrackBtn = document.getElementById('next-track');
		this.shareBtn = document.getElementById('share-btn');
		this.moodLabels = document.querySelectorAll('.mood-labels span');
	}

	initializeEventListeners() {
		this.moodSlider.addEventListener('input', () => this.handleMoodChange());
		this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
		this.prevTrackBtn.addEventListener('click', () => this.previousTrack());
		this.nextTrackBtn.addEventListener('click', () => this.nextTrack());
		
		document.querySelector('.menu-btn').addEventListener('click', () => this.handleMenu());
		document.querySelector('.back-btn').addEventListener('click', () => this.previousTrack());
		document.querySelector('.forward-btn').addEventListener('click', () => this.nextTrack());
		document.querySelector('.play-btn').addEventListener('click', () => this.togglePlayPause());
		
		this.shareBtn.addEventListener('click', () => this.sharePlaylist());

		// Listen for Spotify iframe errors
		window.addEventListener('error', (event) => {
			if (event.target.tagName === 'IFRAME') {
				this.handleSpotifyError();
			}
		}, true);
	}

	handleMoodChange() {
		const moods = [
			{ name: 'Happy', emoji: '😊' },
			{ name: 'Energetic', emoji: '🔥' },
			{ name: 'Relaxed', emoji: '😌' },
			{ name: 'Nostalgic', emoji: '🌟' },
			{ name: 'Romantic', emoji: '💖' },
			{ name: 'Meditation', emoji: '🧘' },
			{ name: 'Sad', emoji: '😢' }
		];

		const index = parseInt(this.moodSlider.value);
		const mood = moods[index];
		
		this.currentMood = mood.name.toLowerCase();
		this.moodEmoji.textContent = mood.emoji;
		this.moodName.textContent = mood.name;

		this.moodLabels.forEach((label, i) => {
			label.classList.toggle('active', i === index);
		});

		this.generatePlaylist(this.currentMood);
	}

	generatePlaylist(mood) {
		const playlists = {
			happy: {
				embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0",
				link: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0"
			},
			energetic: {
				embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP",
				link: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP"
			},
			relaxed: {
				embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp",
				link: "https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp"
			},
			nostalgic: {
				embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4o1oenSJRJd",
				link: "https://open.spotify.com/playlist/37i9dQZF1DX4o1oenSJRJd"
			},
			romantic: {
				embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DWXb9I5xoXLjp",
				link: "https://open.spotify.com/playlist/37i9dQZF1DWXb9I5xoXLjp"
			},
			meditation: {
				embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZqd5JICZI0u",
				link: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u"
			},
			sad: {
				embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DX7qK8ma5wgG1",
				link: "https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1"
			}
		};

		this.playlistFrame.innerHTML = `
			<iframe 
				src="${playlists[mood].embed}" 
				width="100%" 
				height="300" 
				frameborder="0" 
				allowtransparency="true" 
				allow="encrypted-media"
				id="spotify-iframe">
			</iframe>
		`;

		this.playlistLink.href = playlists[mood].link;
		this.playlistContainer.classList.remove('hidden');
		
		if (this.embedError) {
			this.fallbackMessage.classList.remove('hidden');
		} else {
			this.fallbackMessage.classList.add('hidden');
		}
	}

	handleSpotifyError() {
		this.embedError = true;
		this.fallbackMessage.classList.remove('hidden');
		console.log('Spotify embed error detected. Showing fallback message.');
	}

	togglePlayPause() {
		if (this.embedError) {
			window.open(this.playlistLink.href, '_blank');
			return;
		}

		this.isPlaying = !this.isPlaying;
		this.updatePlayPauseButtons();
		this.sendSpotifyCommand(this.isPlaying ? 'play' : 'pause');
	}

	updatePlayPauseButtons() {
		this.playPauseBtn.textContent = this.isPlaying ? '⏸' : '▶';
		document.querySelector('.play-btn').textContent = this.isPlaying ? '⏸' : '⏯';
	}

	previousTrack() {
		if (this.embedError) return;
		this.sendSpotifyCommand('prev');
	}

	nextTrack() {
		if (this.embedError) return;
		this.sendSpotifyCommand('next');
	}

	sendSpotifyCommand(command) {
		const iframe = document.getElementById('spotify-iframe');
		if (iframe && iframe.contentWindow) {
			iframe.contentWindow.postMessage({ 
				command: command 
			}, 'https://open.spotify.com');
		}
	}

	handleMenu() {
		this.playlistContainer.classList.add('hidden');
		this.moodSlider.value = 0;
		this.handleMoodChange();
	}

	sharePlaylist() {
		if (this.embedError) {
			window.open(this.playlistLink.href, '_blank');
			return;
		}
		alert(`Sharing your ${this.currentMood} ${this.moodEmoji.textContent} playlist!`);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const app = new MoodMusicApp();
});