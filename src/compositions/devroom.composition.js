import { tilemapComposition } from "@/compositions/tilemap.composition.js";
import { ISLAND_SPEED } from "@/configs/gameplay.config.js";
import Phaser from "phaser";

export const devroomComposition = {
  preloadLevel(scene) {
    scene.load.image("island-grass-big", "assets/levels/tiles/island-grass-big.png");
    scene.load.image("island-ground-big", "assets/levels/tiles/island-ground-big.png");
    scene.load.tilemapTiledJSON("devroom-tilemap", "assets/levels/tilemaps/devroom.json");
  },

  createLevel(scene) {
    const map = scene.make.tilemap({ key: "devroom-tilemap" });

    this.worldCenter = tilemapComposition.getFromObjectLayer(map, "points_layer", "worldCenter");
    this.spawnPoint = tilemapComposition.getFromObjectLayer(map, "points_layer", "spawnPoint");

    this.islandsLayer = tilemapComposition.createObjectLayer(scene, map, "islands_layer");
    this.islandsLayer.children.iterate(island => {
      island.distanceLength = new Phaser.Math.Vector2(island.x - this.worldCenter.x, island.y - this.worldCenter.y).length();
      island.currentAngle = Math.atan2(island.y - this.worldCenter.y, island.x - this.worldCenter.x);
      const maxSpeed = Math.min(ISLAND_SPEED, 2 * island.distanceLength);
      island.angularSpeed = 2 * Math.asin(maxSpeed / (2 * island.distanceLength));
    });

    return [map, this.islandsLayer, this.spawnPoint];
  },

  moveIslands(timeDelta) {
    this.islandsLayer.children.iterate(island => {
      island.currentAngle += island.angularSpeed * (timeDelta / 1000);
      island.x = this.worldCenter.x + Math.cos(island.currentAngle) * island.distanceLength;
      island.y = this.worldCenter.y + Math.sin(island.currentAngle) * island.distanceLength;
      island.body.updateFromGameObject();
    });
  },

  checkShipOverlapWithIsland(playerStore, ship) {
    for(const island of this.islandsLayer.getChildren()) {
      const isOverlap = island.body.hitTest(ship.x, ship.y);
      if(isOverlap) {
        if(!playerStore.getLastVisitedIsland) {
          playerStore.setLastVisitedIsland(island.name);
          playerStore.showMessage('Land on an island?', true);
        }
        return;
      }
    }

    if(!playerStore.getLastVisitedIsland)
      return;

    playerStore.setLastVisitedIsland(null);
    playerStore.closeMessage();
  },

  getIslandByName(islandName) {
    return this.islandsLayer.getChildren().find(island => island.name === islandName);
  }
};