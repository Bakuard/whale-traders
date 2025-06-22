import * as Phaser from "phaser";
import { sceneComposition } from "@/compositions/scene.composition.js";
import { backgroundComposition } from "@/compositions/background.composition.js";
import { devroomComposition } from "@/compositions/devroom.composition.js";
import { shipComposition } from "@/compositions/ship.composition.js";
import * as Config from "@/configs/gameplay.config.js";

export class DevroomScene extends Phaser.Scene {
  constructor(playerStore) {
    super("DevroomScene");
    this.playerStore = playerStore;
  }

  preload() {
    sceneComposition.preload(this);
    shipComposition.preloadShipAnimation(this);
    backgroundComposition.preloadBackgroundImage(this, "assets/img/background/star_sky.png");
    devroomComposition.preloadLevel(this);
  }

  create() {
    this.background = backgroundComposition.createBackgroundImage(this, this.cameras.main.width, this.cameras.main.height);
    const [map, islandsLayer, spawnPoint] = devroomComposition.createLevel(this);

    const currentIsland = devroomComposition.getIslandByName(this.playerStore.getLastVisitedIsland);
    const shipStartX = currentIsland ? currentIsland.x : spawnPoint.x;
    const shipStartY = currentIsland ? currentIsland.y : spawnPoint.y;

    this.ship = shipComposition.createShip(
      this,
      shipStartX,
      shipStartY,
      Config.SHIP_DISPLAY_WIDTH,
      Config.SHIP_DISPLAY_HEIGHT,
      Config.SHIP_TOPDOWN_BODY_WIDTH,
      Config.SHIP_TOPDOWN_BODY_HEIGHT,
      Config.SHIP_SPEED,
      Config.SHIP_ROTATION_SPEED
    );
    shipComposition.configureCameraFollow(this, this.ship);

    this.events.on('postupdate', () => devroomComposition.checkShipOverlapWithIsland(this.playerStore, this.ship));
  }

  update(time, delta) {
    backgroundComposition.moveBackground(this.cameras.main, this.background);
    shipComposition.updateShipAim(this, this.ship);
    shipComposition.movePlayerOnTopDownWithMouse(this.ship);
    devroomComposition.moveIslands(delta);
  }
}
