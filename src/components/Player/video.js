import shaka from 'shaka-player';

const setupShakaPlayer = (videoEl) => {
  const player = new shaka.Player();

  // Attach the player to the video element
  player.attach(videoEl);

  videoEl.autoplay = true;
  return player;
};

const shakaLoader = async (url, videoEl) => {
  try {
    const player = setupShakaPlayer(videoEl);
    await player.load(url);
  } catch (error) {
    throw error;
  }
};

const shakaUnloader = async (player) => {
  // Cleanup or additional unloading logic if needed
  player.destroy();
};

export { shakaLoader, shakaUnloader };
