class MoodMusicApp {
	constructor() {
		this.currentMood = 'happy';
		this.isPlaying = false;
		this.currentTrackIndex = 0;
		this.spotifyPlayer = null;
		this.initializeElements();
		this.initializeEventListeners();
	}

	initializeElements() {
		this.moodEmoji = document.getElementById('mood-emoji');
		this.moodName = document.getElementById('mood-name');
		this.moodSlider = document.getElementById('mood-slider');
		this.playlistContainer = document.getElementById('playlist-container');
		this.playPauseBtn = document.getElementById('play-pause');
		this.prevTrackBtn = document.getElementById('prev-track');
		this.nextTrackBtn = document.getElementById('next-track');
		this.shareBtn = document.getElementById('share-btn');
		this.moodLabels = document.querySelectorAll('.mood-labels span');
		this.playlistFrame = document.getElementById('playlist-frame');
	}

	initializeEventListeners() {
		// Mood slider control
		this.moodSlider.addEventListener('input', () => this.handleMoodChange());

		// Playback controls
		this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
		this.prevTrackBtn.addEventListener('click', () => this.previousTrack());
		this.nextTrackBtn.addEventListener('click', () => this.nextTrack());

		// iPod controls
		document.querySelector('.menu-btn').addEventListener('click', () => this.handleMenu());
		document.querySelector('.back-btn').addEventListener('click', () => this.previousTrack());
		document.querySelector('.forward-btn').addEventListener('click', () => this.nextTrack());
		document.querySelector('.play-btn').addEventListener('click', () => this.togglePlayPause());

		// Share button
		this.shareBtn.addEventListener('click', () => this.sharePlaylist());

		// Listen for Spotify iframe messages
		window.addEventListener('message', (event) => {
			if (event.origin !== 'https://open.spotify.com') return;
			
			try {
				const data = JSON.parse(event.data);
				if (data.type === 'ready') {
					this.spotifyPlayer = event.source;
				}
			} catch (e) {
				console.error('Error parsing Spotify message:', e);
			}
		});
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
			happy: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0",
			energetic: "https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP",
			relaxed: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp",
			nostalgic: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4o1oenSJRJd",
			romantic: "https://open.spotify.com/embed/playlist/37i9dQZF1DWXb9I5xoXLjp",
			meditation: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZqd5JICZI0u",
			sad: "https://open.spotify.com/embed/playlist/37i9dQZF1DX7qK8ma5wgG1"
		};

		this.playlistFrame.innerHTML = `
			<iframe 
				src="${playlists[mood]}" 
				width="100%" 
				height="300" 
				frameborder="0" 
				allowtransparency="true" 
				allow="encrypted-media"
				id="spotify-iframe">
			</iframe>
		`;

		this.playlistContainer.classList.remove('hidden');
		this.isPlaying = false;
		this.updatePlayPauseButtons();
	}

	togglePlayPause() {
		this.isPlaying = !this.isPlaying;
		this.updatePlayPauseButtons();
		this.sendSpotifyCommand(this.isPlaying ? 'play' : 'pause');
	}

	updatePlayPauseButtons() {
		this.playPauseBtn.textContent = this.isPlaying ? '⏸' : '▶';
		document.querySelector('.play-btn').textContent = this.isPlaying ? '⏸' : '⏯';
	}

	previousTrack() {
		this.sendSpotifyCommand('prev');
	}

	nextTrack() {
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
		alert(`Sharing your ${this.currentMood} ${this.moodEmoji.textContent} playlist!`);
	}
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	const app = new MoodMusicApp();
});