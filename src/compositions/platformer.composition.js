import { tilemapComposition } from "@/compositions/tilemap.composition.js";
import * as Config from "@/configs/gameplay.config.js";
import * as Phaser from "phaser";

export const platformerComposition = {
  preloadLevel(scene) {
    scene.load.image("chip", "assets/img/chip.jpg");
    scene.load.image("fire", "assets/levels/tiles/fire.png");
    scene.load.spritesheet("platform_tiles", "assets/levels/tiles/platforms/platform_tiles.png", { frameWidth: 100, frameHeight: 100 });
    scene.load.tilemapTiledJSON("platformer-tilemap", "assets/levels/tilemaps/platforms1.json");
    scene.load.image("mountBack", "assets/img/background/mount-back.png");
    scene.load.image("mountFront", "assets/img/background/red-whale-platformer.png");
  },

  createLevel(scene) {
    const map = scene.make.tilemap({ key: "platformer-tilemap" });

    const spawnPoint = tilemapComposition.getFromObjectLayer(map, "points_layer", { name: "spawnPoint" });

    const backgroundFar = scene.add.image(spawnPoint.x, spawnPoint.y, "mountBack").setScrollFactor(0);
    const backgroundNear = scene.add.image(spawnPoint.x, spawnPoint.y, "mountFront").setScrollFactor(0);

    const platformsLayer = tilemapComposition.createTileLayer(map, "platform_tiles", "platform_layer", [2]);
    const chipsLayer = tilemapComposition.createObjectLayer(scene, map, "chips_layer");
    const fireLayer = tilemapComposition.createObjectLayer(scene, map, "fire_layer");
    this.movingPlatform = tilemapComposition.createObjectLayer(scene, map, "moving_platform");
    this.movingPlatform.getChildren().forEach((platform) => {
      const start = tilemapComposition.getFromObjectLayer(map, "moving_platform_points", { movingPlatformOwner: platform.name, pointType: "start" });
      const end = tilemapComposition.getFromObjectLayer(map, "moving_platform_points", { movingPlatformOwner: platform.name, pointType: "end" });
      platform.start = start;
      platform.end = end;
      platform.targetPoint = end;
      platform.velocity = new Phaser.Math.Vector2();
    });

    return [platformsLayer, chipsLayer, fireLayer, this.movingPlatform, spawnPoint, backgroundNear, backgroundFar];
  },

  moveParallaxImages(camera, backgroundNear, backgroundFar, scene) {
    backgroundFar.setPosition(200, scene.scale.height / 1.2);
    backgroundNear.setPosition(200, scene.scale.height / 1.2);
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
};
