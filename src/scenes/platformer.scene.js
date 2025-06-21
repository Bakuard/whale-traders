import * as Phaser from "phaser";
import { sceneComposition } from "@/compositions/scene.composition.js";
import { playerComposition } from "@/compositions/player.composition.js";
import { platformerComposition } from "@/compositions/platformer.composition.js";
import * as Config from "@/configs/gameplay.config.js";

export class PlatformerScene extends Phaser.Scene {
  constructor(playerStore) {
    super("MainScene");
    this.playerStore = playerStore;
  }

  preload() {
    sceneComposition.preload(this);
    platformerComposition.preloadLevel(this);
    playerComposition.preloadPlayerAnimation(this);
  }

  create() {
    const [platformsLayer, chipsLayer, fireLayer, movingPlatform, spawnPoint, backgroundNear, backgroundFar] = platformerComposition.createLevel(this);

    this.camera = this.cameras.main;
    this.backgroundNear = backgroundNear;
    this.backgroundFar = backgroundFar;

    this.userInput = playerComposition.createUserInput(this);
    playerComposition.preparePlayerAnimation(this);
    this.player = playerComposition.createPlayer(
      this,
      spawnPoint.x,
      spawnPoint.y,
      Config.PLAYER_DISPLAY_WIDTH,
      Config.PLAYER_DISPLAY_HEIGHT,
      Config.PLAYER_PLATFORM_BODY_WIDTH,
      Config.PLAYER_PLATFORM_BODY_HEIGHT,
      Config.PLAYER_SPEED
    );

    playerComposition.configureCameraFollow(this, this.player, this.cameras.main.width / 4, this.cameras.main.height / 4);

    this.physics.add.collider(this.player, platformsLayer);
    this.physics.add.collider(this.player, movingPlatform, playerComposition.onMovingPlatformCollision);
    this.physics.add.overlap(this.player, chipsLayer, (player, chip) => {
      playerComposition.onChipOverlap(player, chip, this.playerStore);
    });
    this.fireCollider = this.physics.add.collider(this.player, fireLayer, (player) => {
      playerComposition.onFireCollision(this, player, this.playerStore);
    });
  }

  update(time, delta) {
    playerComposition.movePlayerOnPlatformers(this.player, this.playerStore, this.userInput);
    platformerComposition.moveParallaxImages(this.camera, this.backgroundNear, this.backgroundFar, this);
    playerComposition.switchChip(this.player, this.playerStore, this.userInput, this.fireCollider);
    platformerComposition.movePlatforms(delta, this.playerStore);
  }
}
