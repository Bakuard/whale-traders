import * as Phaser from "phaser";
import { sceneComposition } from "@/compositions/scene.composition.js";
import { playerComposition } from "@/compositions/player.composition.js";
import { platformerComposition } from "@/compositions/platformer.composition.js";
import * as Config from "@/configs/gameplay.config.js";
import { backgroundComposition } from "@/compositions/background.composition.js";
import { MOVING_WHALES } from "@/configs/gameplay.config.js";

export class PlatformerScene extends Phaser.Scene {
  constructor(playerStore) {
    super("MainScene");
    this.playerStore = playerStore;
  }

  preload() {
    sceneComposition.preload(this);
    platformerComposition.preloadLevel(this, this.playerStore.currentColor, `assets/levels/tilemaps/${this.playerStore.lastVisitedIsland}.json`);
    platformerComposition.preloadSkyWhales(this, MOVING_WHALES[this.playerStore.currentColor]);
    playerComposition.preloadPlayerAnimation(this);
    backgroundComposition.preloadBackgroundImage(this, "assets/img/background/sky3.png");
  }

  create() {
    this.background = backgroundComposition.createBackgroundImage(this, this.cameras.main.width, this.cameras.main.height);
    this.skyWhales = platformerComposition.createSkyWhales(this, MOVING_WHALES[this.playerStore.currentColor]);
    platformerComposition.crateAnimations(this);
    const [platformsLayer, chipsLayer, fireLayer, movingPlatform, memoryChipLayer, spawnPoint, surface] = platformerComposition.createLevel(this);

    this.camera = this.cameras.main;
    this.surface = surface;

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
    this.physics.add.collider(this.player, memoryChipLayer, (player, memoryChip) => playerComposition.onMemoryChipCollision(player, memoryChip, this.playerStore));
  }

  update(time, delta) {
    playerComposition.movePlayerOnPlatformers(this.player, this.playerStore, this.userInput);
    platformerComposition.moveParallaxImages(this.camera, this.surface, this);
    platformerComposition.moveSkyWhales(this, this.skyWhales, delta);
    playerComposition.switchChip(this.player, this.playerStore, this.userInput, this.fireCollider);
    platformerComposition.movePlatforms(delta, this.playerStore);
    platformerComposition.refreshFireAnimation(this.playerStore);
  }
}
