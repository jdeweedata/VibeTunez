class MoodMusicApp {
	constructor() {
		this.currentMood = null;
		this.moodEmoji = document.getElementById('mood-emoji');
		this.playlistContainer = document.getElementById('playlist-container');
		this.shareBtn = document.getElementById('share-btn');
		this.wheelCenter = document.querySelector('.wheel-center');
		this.moodOptions = document.querySelectorAll('.mood-options span');
		this.initializeEventListeners();
	}

	initializeEventListeners() {
		// Click wheel controls
		document.querySelector('.menu-btn').addEventListener('click', () => this.handleMenu());
		document.querySelector('.back-btn').addEventListener('click', () => this.handleBack());
		document.querySelector('.forward-btn').addEventListener('click', () => this.handleForward());
		document.querySelector('.play-btn').addEventListener('click', () => this.handlePlay());

		// Mood selection
		this.moodOptions.forEach(option => {
			option.addEventListener('click', () => this.handleMoodSelection(option.dataset.mood));
		});

		// Share button
		this.shareBtn.addEventListener('click', () => this.sharePlaylist());

		// Wheel rotation for mood selection
		let currentRotation = 0;
		this.wheelCenter.addEventListener('mousedown', (e) => {
			const startY = e.clientY;
			const moveHandler = (e) => {
				const deltaY = e.clientY - startY;
				currentRotation += deltaY;
				const index = Math.floor(Math.abs(currentRotation / 90) % this.moodOptions.length);
				this.highlightMoodOption(index);
			};
			
			document.addEventListener('mousemove', moveHandler);
			document.addEventListener('mouseup', () => {
				document.removeEventListener('mousemove', moveHandler);
			}, { once: true });
		});
	}

	highlightMoodOption(index) {
		this.moodOptions.forEach(option => option.classList.remove('active'));
		this.moodOptions[index].classList.add('active');
	}

	handleMenu() {
		this.playlistContainer.classList.add('hidden');
		this.moodEmoji.textContent = '😊';
	}

	handleBack() {
		if (!this.playlistContainer.classList.contains('hidden')) {
			this.playlistContainer.classList.add('hidden');
		}
	}

	handleForward() {
		if (this.currentMood) {
			this.generatePlaylist(this.currentMood);
		}
	}

	handlePlay() {
		if (this.currentMood) {
			this.playlistContainer.classList.remove('hidden');
		}
	}

	handleMoodSelection(mood) {
		this.currentMood = mood;
		this.updateMoodEmoji(mood);
		this.generatePlaylist(mood);
	}

	updateMoodEmoji(mood) {
		const emojis = {
			happy: '😊',
			energetic: '🔥',
			relaxed: '😌',
			sad: '😢'
		};
		this.moodEmoji.textContent = emojis[mood];
	}

	generatePlaylist(mood) {
		const playlists = {
			happy: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0",
			energetic: "https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP",
			relaxed: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp",
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

	sharePlaylist() {
		const moodEmoji = {
			happy: '😊',
			energetic: '🔥',
			relaxed: '😌',
			sad: '😢'
		}[this.currentMood];

		alert(`Sharing your ${this.currentMood} ${moodEmoji} playlist!`);
	}
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	const app = new MoodMusicApp();
});