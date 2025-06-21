import Phaser from "phaser";
import * as Config from "@/configs/gameplay.config.js";

export const playerComposition = {
  preloadPlayerAnimation(scene) {
    scene.load.atlas("player_wait", "assets/animation/wait.png", "assets/animation/wait.json");
    scene.load.atlas("player_move", "assets/animation/move.png", "assets/animation/move.json");
    scene.load.atlas("player_jump", "assets/animation/jump.png", "assets/animation/jump.json");
  },

  preparePlayerAnimation(scene) {
    scene.anims.create({
      key: "player_wait",
      frames: scene.anims.generateFrameNames("player_wait", { start: 1, end: 8 }),
      frameRate: 2,
      repeat: -1,
    });
    scene.anims.create({
      key: "player_move",
      frames: scene.anims.generateFrameNames("player_move", { start: 1, end: 8 }),
      frameRate: 12,
      repeat: -1,
    });
    scene.anims.create({
      key: "player_jump",
      frames: scene.anims.generateFrameNames("player_jump", { start: 1, end: 8 }),
      frameRate: 16,
      repeat: 1,
    });
  },

  createPlayer(scene, x, y, displayWidth, displayHeight, bodyWidth, bodyHeight, speed) {
    const player = scene.physics.add
      .sprite(x, y, "player_wait", "1")
      .setBodySize(bodyWidth, bodyHeight)
      .setDisplaySize(displayWidth, displayHeight)
      .setOrigin(0.5, 1)
      .play("player_wait")
      .refreshBody();
    player.speed = speed;
    player.depth = 100;
    player.canMove = true;
    player.jumpMultiplicator = Config.PLAYER_JUMP_MULTIPLICATOR;
    player.fallMultiplicator = Config.PLAYER_FALL_MULTIPLICATOR;
    return player;
  },

  configureCameraFollow(scene, player, deadzoneWidth, deadzoneHeight) {
    scene.cameras.main.startFollow(player);
    scene.cameras.main.setDeadzone(deadzoneWidth, deadzoneHeight);
  },

  switchChip(player, playerStore, userInput, fireCollider) {
    let abilityName = null;
    if (Phaser.Input.Keyboard.JustDown(userInput.activateJumpChip)) {
      abilityName = "jump";
    } else if (Phaser.Input.Keyboard.JustDown(userInput.activateFireChip)) {
      abilityName = "fire";
    } else if (Phaser.Input.Keyboard.JustDown(userInput.activateGravityChip)) {
      abilityName = "gravity";
    } else if (Phaser.Input.Keyboard.JustDown(userInput.activateFreezeChip)) {
      abilityName = "freeze";
    }

    if (abilityName == null) return;

    playerStore.abilities.forEach((ability) => (ability.isActive = !ability.isActive && abilityName === ability.name));

    if (playerStore.jumpAbility.isActive) {
      playerStore.jumpAbility.params.jumpMultiplicator = Config.PLAYER_JUMP_MULTIPLICATOR_WITH_CHIP;
      playerStore.jumpAbility.params.fallMultiplicator = Config.PLAYER_FALL_MULTIPLICATOR_WITH_CHIP;
    } else {
      playerStore.jumpAbility.params.jumpMultiplicator = Config.PLAYER_JUMP_MULTIPLICATOR;
      playerStore.jumpAbility.params.fallMultiplicator = Config.PLAYER_FALL_MULTIPLICATOR;
    }

    if (playerStore.gravityAbility.isActive) {
      player.body.allowGravity = false;
    } else {
      player.body.allowGravity = true;
    }

    if (playerStore.freezeAbility.isActive) {
      console.log("activate freeze chip");
    } else {
      console.log("deactivate freeze chip");
    }

    if (playerStore.fireAbility.isActive) {
      fireCollider.active = false;
    } else {
      fireCollider.active = true;
    }
  },

  onChipOverlap(player, chip, playerStore) {
    chip.destroy();
    if (chip.name == "JumpChip") playerStore.addJumpAbility();
    else if (chip.name == "FireChip") playerStore.addFireAbility();
    else if (chip.name == "FreezeChip") playerStore.addFreezeAbility();
    else if (chip.name == "GravityChip") playerStore.addGravityAbility();
    playerStore.journal[chip.recordNumber - 1].isActive = true;
    playerStore.showMessage("New record in journal");
  },

  onFireCollision(scene, player, playerStore) {
    if (playerStore.fireAbility.isActive) return;

    if (player.canMove) {
      player.canMove = false;
      scene.time.delayedCall(Config.BOUNCE_FROM_FIRE_DURATION_IN_MILLIS, () => (player.canMove = true));
    }
    player.body.velocity.x = (player.body.blocked.left - player.body.blocked.right) * Config.BOUNCE_FROM_FIRE;
  },

  movePlayerOnTopDown(player, userInput) {
    player.body.velocity.x = userInput.right.isDown - userInput.left.isDown;
    player.body.velocity.y = userInput.down.isDown - userInput.up.isDown;
    if (player.body.velocity.y !== 0 && player.body.velocity.x !== 0) {
      player.body.velocity.x *= 0.707106; //sin 45 degree
      player.body.velocity.y *= 0.707106; //cos 45 degree
    }
    player.body.velocity.scale(player.speed);

    if (player.body.velocity.equals(Phaser.Math.Vector2.ZERO)) player.anims.play("player_wait", true);
    else player.anims.play("player_move", true);

    if (player.body.velocity.x !== 0) player.setFlipX(userInput.left.isDown);
  },

  onMovingPlatformCollision(player, platform) {
    if (player.body.blocked.down) player.currentPlatform = platform;
  },

  onMemoryChipCollision(player, memoryChip, playerStore) {
    playerStore.journal[memoryChip.recordNumber - 1].isActive = true;
    memoryChip.destroy();
    playerStore.showMessage("New record in journal");
  },

  movePlayerOnPlatformers(player, playerStore, userInput) {
    if (!player.canMove) return;

    if (userInput.up.isDown && player.body.blocked.down && !playerStore.gravityAbility.isActive) {
      player.body.velocity.y = -player.speed * playerStore.jumpAbility.params.jumpMultiplicator;
    } else if (playerStore.gravityAbility.isActive) {
      player.body.velocity.y = Config.ANTI_GRAVITY;
    }

    player.body.velocity.x = (userInput.right.isDown - userInput.left.isDown) * player.speed * !playerStore.gravityAbility.isActive;

    if (player.currentPlatform) {
      player.body.x += player.currentPlatform.velocity.x;
      player.body.y += player.currentPlatform.velocity.y;
      player.currentPlatform = null;
    }

    if (player.body.velocity.equals(Phaser.Math.Vector2.ZERO)) {
      player.anims.play("player_wait", true);
    } else if (player.body.blocked.down && player.body.velocity.y === 0) {
      player.anims.play("player_move", true);
    } else {
      player.anims.play("player_jump", true);
      player.body.velocity.x *= playerStore.jumpAbility.params.fallMultiplicator;
    }

    if (player.body.velocity.x !== 0) player.setFlipX(userInput.left.isDown);
  },

  createUserInput(scene) {
    return scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      activateJumpChip: Phaser.Input.Keyboard.KeyCodes.ONE,
      activateGravityChip: Phaser.Input.Keyboard.KeyCodes.TWO,
      activateFireChip: Phaser.Input.Keyboard.KeyCodes.THREE,
      activateFreezeChip: Phaser.Input.Keyboard.KeyCodes.FOUR,
    });
  },
};
