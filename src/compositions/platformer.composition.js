import { tilemapComposition } from "@/compositions/tilemap.composition.js";

export const platformerComposition = {
  preloadLevel(scene) {
    scene.load.image("platform_tiles", "assets/levels/tiles/platforms/platform_tiles.png");
    scene.load.image("chip", "assets/img/chip.jpg");
    scene.load.tilemapTiledJSON("platformer-tilemap", "assets/levels/tilemaps/platforms1.json");
    scene.load.image("mountBack", "assets/img/background/mount-back.png");
    scene.load.image("mountFront", "assets/img/background/mount-front.png");
  },

  createLevel(scene) {
    const map = scene.make.tilemap({ key: "platformer-tilemap" });

    const spawnPoint = tilemapComposition.getFromObjectLayer(map, "points_layer", "spawnPoint");

    const backgroundFar = scene.add.image(spawnPoint.x, spawnPoint.y, "mountBack").setScrollFactor(0);
    const backgroundNear = scene.add.image(spawnPoint.x, spawnPoint.y, "mountFront").setScrollFactor(0);

    const platformsLayer = tilemapComposition.createTileLayer(map, "platform_tiles", "platform_layer", [2]);
    const chipsLayer = tilemapComposition.createObjectLayer(scene, map, "chips_layer");

    return [platformsLayer, chipsLayer, spawnPoint, backgroundNear, backgroundFar];
  },

  moveParallaxImages(camera, backgroundNear, backgroundFar, scene) {
    backgroundFar.setPosition(200, scene.scale.height / 1.2);
    backgroundNear.setPosition(200, scene.scale.height / 1.2);
  },
};
