import { tilemapComposition } from "@/compositions/tilemap.composition.js";
import { ISLAND_SPEED } from "@/configs/gameplay.config.js";
import Phaser from "phaser";

export const devroomComposition = {
  preloadLevel(scene) {
    scene.load.image("green-whale-space", "assets/img/whales/green-whale-space.png");
    scene.load.image("indigo-whale-space", "assets/img/whales/indigo-whale-space.png");
    scene.load.image("red-whale-space", "assets/img/whales/red-whale-space.png");
    scene.load.image("cyan-whale-space", "assets/img/whales/cyan-whale-space.png");
    scene.load.image("amber-whale-space", "assets/img/whales/amber-whale-space.png");
    scene.load.tilemapTiledJSON("devroom-tilemap", "assets/levels/tilemaps/devroom.json");
  },

  createLevel(scene) {
    const map = scene.make.tilemap({ key: "devroom-tilemap" });

    this.worldCenter = tilemapComposition.getFromObjectLayer(map, "points_layer", { name: "worldCenter" });
    this.spawnPoint = tilemapComposition.getFromObjectLayer(map, "points_layer", { name: "spawnPoint" });

    this.islandsLayer = tilemapComposition.createObjectLayerWithSprite(scene, map, "islands_layer");
    this.islandsLayer.children.iterate((island) => {
      island.distanceLength = new Phaser.Math.Vector2(island.x - this.worldCenter.x, island.y - this.worldCenter.y).length();
      island.currentAngle = Math.atan2(island.y - this.worldCenter.y, island.x - this.worldCenter.x);
      const maxSpeed = Math.min(ISLAND_SPEED, 2 * island.distanceLength);
      island.angularSpeed = 2 * Math.asin(maxSpeed / (2 * island.distanceLength));
    });

    return [map, this.islandsLayer, this.spawnPoint];
  },

  moveIslands(timeDelta) {
    this.islandsLayer.children.iterate((island) => {
      island.currentAngle += island.angularSpeed * (timeDelta / 1000);
      island.x = this.worldCenter.x + Math.cos(island.currentAngle) * island.distanceLength;
      island.y = this.worldCenter.y + Math.sin(island.currentAngle) * island.distanceLength;
      island.angle = Phaser.Math.RadToDeg(island.currentAngle) - 90;
      island.body.x = island.x - island.body.width / 2;
      island.body.y = island.y - island.body.height / 2;
    });
  },

  checkShipOverlapWithIsland(playerStore, ship) {
    for (const island of this.islandsLayer.getChildren()) {
      const isOverlap = island.body.hitTest(ship.x, ship.y);
      if (isOverlap) {
        if (!playerStore.getLastVisitedIsland) {
          playerStore.setLastVisitedIsland(island.name);
          playerStore.currentColor = island.color;
          playerStore.showMessage("Land on an island?", true);
        }
        return;
      }
    }

    if (!playerStore.getLastVisitedIsland) return;

    playerStore.setLastVisitedIsland(null);
    playerStore.closeMessage();
  },

  getIslandByName(islandName) {
    return this.islandsLayer.getChildren().find((island) => island.name === islandName);
  },
};
