export const backgroundComposition = {
  preloadBackgroundImage(scene, textureUrl) {
    scene.load.image("background_star_sky", textureUrl);
  },

  createBackgroundImage(scene, width, height) {
    return scene.add.tileSprite(0, 0, width, height, "background_star_sky")
      .setOrigin(0, 0)
      .setScrollFactor(0);
  },

  moveBackground(camera, background) {
    background.tilePositionX = camera.scrollX;
    background.tilePositionY = camera.scrollY;
  }
};