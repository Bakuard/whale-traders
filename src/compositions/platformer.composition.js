import { tilemapComposition } from "@/compositions/tilemap.composition.js";
import * as Config from "@/configs/gameplay.config.js";
import * as Phaser from "phaser";

export const platformerComposition = {
  preloadLevel(scene, name, tilemapPath) {
    scene.load.image("chip", "assets/img/chip.png");
    scene.load.atlas("fire", "assets/animation/fire.png", "assets/animation/fire.json");
    scene.load.spritesheet("platform_tiles", "assets/levels/tiles/platforms/platform_tiles.png", { frameWidth: 100, frameHeight: 100 });
    scene.load.tilemapTiledJSON("platformer-tilemap", tilemapPath);
    scene.load.image("memoryChip", "assets/img/memory-chip.png");
    scene.load.image("surface", `assets/img/background/platformer/${name}-whale-platformer.png`);
  },

  preloadSkyWhales(scene, names) {
    for (const name of names) {
      scene.load.image(`${name}-whale-sky`, `assets/img/background/platformer-sky/${name}-whale-sky.png`);
    }
  },

  crateAnimations(scene) {
    this.fireAnimation = scene.anims.create({
      key: "fire",
      frames: scene.anims.generateFrameNames("fire", { start: 1, end: 4 }),
      frameRate: 4,
      repeat: -1,
    });
  },

  createSkyWhales(scene, names) {
    const skyWhales = [];
    for (let i = 0; i < names.length; i++) {
      const whale = scene.add.image(scene.scale.width - 100 * (i + 1), scene.scale.height / 2, `${names[i]}-whale-sky`).setScrollFactor(0);
      skyWhales.push(whale);
    }

    return skyWhales;
  },

  moveSkyWhales(scene, whales, deltaTime) {
    for (let i = 0; i < whales.length; i++) {
      const currentSpeed = (i + 2) * (deltaTime / 1000);
      whales[i].setPosition(whales[i].x - currentSpeed, scene.scale.height / 2 - (i + 4 - whales.length) * 100).setScale((i + 5 - whales.length) * 0.2);
    }
  },

  createLevel(scene) {
    const map = scene.make.tilemap({ key: "platformer-tilemap" });

    const spawnPoint = tilemapComposition.getFromObjectLayer(map, "points_layer", { name: "spawnPoint" });

    const surface = scene.add.image(spawnPoint.x, spawnPoint.y, "surface").setScrollFactor(0);

    const platformsLayer = tilemapComposition.createTileLayer(map, "platform_tiles", "platform_layer", [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const chipsLayer = tilemapComposition.createObjectLayerWithTexture(scene, map, "chips_layer");
    this.fireLayer = tilemapComposition.createObjectLayerWithSprite(scene, map, "fire_layer");
    this.movingPlatform = tilemapComposition.createObjectLayerWithTexture(scene, map, "moving_platform");
    this.movingPlatform.getChildren().forEach((platform) => {
      const start = tilemapComposition.getFromObjectLayer(map, "moving_platform_points", { movingPlatformOwner: platform.name, pointType: "start" });
      const end = tilemapComposition.getFromObjectLayer(map, "moving_platform_points", { movingPlatformOwner: platform.name, pointType: "end" });
      platform.start = start;
      platform.end = end;
      platform.targetPoint = end;
      platform.velocity = new Phaser.Math.Vector2();
    });
    const memoryChipLayer = tilemapComposition.createObjectLayerWithSprite(scene, map, "memory_chip_layer");

    return [platformsLayer, chipsLayer, this.fireLayer, this.movingPlatform, memoryChipLayer, spawnPoint, surface];
  },

  moveParallaxImages(camera, surface, scene) {
    const scrollX = camera.scrollX;
    const scrollY = camera.scrollY;

    surface.setPosition(scene.scale.width / 2 - scrollX * 0.1, scene.scale.height / 1.3 - scrollY * 0.1);
  },

  movePlatforms(deltaTime, playerStore) {
    const currentSpeed = Config.MOVABLE_PLATFORM_SPEED * (deltaTime / 1000);
    for (const platform of this.movingPlatform.getChildren()) {
      if (playerStore.freezeAbility.isActive) {
        platform.velocity.set(0, 0);
        continue;
      }

      const distanceToTarget = Phaser.Math.Distance.Between(platform.x, platform.y, platform.targetPoint.x, platform.targetPoint.y);
      platform.velocity.x = platform.targetPoint.x - platform.x;
      platform.velocity.y = platform.targetPoint.y - platform.y;
      platform.velocity.normalize().scale(Math.min(currentSpeed, distanceToTarget));

      platform.x += platform.velocity.x;
      platform.y += platform.velocity.y;
      platform.body.updateFromGameObject();

      if (distanceToTarget <= currentSpeed) {
        platform.targetPoint = platform.targetPoint === platform.end ? platform.start : platform.end;
      }
    }
  },

  refreshFireAnimation(playerStore) {
    if (playerStore.freezeAbility.isActive) this.fireAnimation.pause();
    else this.fireAnimation.resume();
  },
};
