class MoodMusicApp {
	constructor() {
		this.currentMood = 'happy';
		this.isPlaying = false;
		this.currentTrackIndex = 0;
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
		document.querySelector('.back-btn').addEventListener('click', () => this.handleBack());
		document.querySelector('.forward-btn').addEventListener('click', () => this.handleForward());
		document.querySelector('.play-btn').addEventListener('click', () => this.togglePlayPause());

		// Share button
		this.shareBtn.addEventListener('click', () => this.sharePlaylist());
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

		// Update active label
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

		const playlistFrame = document.getElementById('playlist-frame');
		playlistFrame.innerHTML = `
			<iframe 
				src="${playlists[mood]}" 
				width="100%" 
				height="300" 
				frameborder="0" 
				allowtransparency="true" 
				allow="encrypted-media">
			</iframe>
		`;

		this.playlistContainer.classList.remove('hidden');
	}

	togglePlayPause() {
		this.isPlaying = !this.isPlaying;
		this.playPauseBtn.textContent = this.isPlaying ? '⏸' : '▶';
		document.querySelector('.play-btn').textContent = this.isPlaying ? '⏸' : '⏯';
		
		// Here you would typically control the Spotify playback
		if (this.isPlaying) {
			// Start playback
		} else {
			// Pause playback
		}
	}

	previousTrack() {
		// Implement previous track functionality
		console.log('Previous track');
	}

	nextTrack() {
		// Implement next track functionality
		console.log('Next track');
	}

	handleMenu() {
		this.playlistContainer.classList.add('hidden');
		this.moodSlider.value = 0;
		this.handleMoodChange();
	}

	handleBack() {
		if (!this.playlistContainer.classList.contains('hidden')) {
			this.playlistContainer.classList.add('hidden');
		}
	}

	handleForward() {
		this.playlistContainer.classList.remove('hidden');
	}

	sharePlaylist() {
		alert(`Sharing your ${this.currentMood} ${this.moodEmoji.textContent} playlist!`);
	}
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	const app = new MoodMusicApp();
});