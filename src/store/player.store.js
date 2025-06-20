import { defineStore } from "pinia";
import * as Config from "@/configs/gameplay.config.js";
import { PLAYER_CURRENT_HEALTH } from "@/configs/gameplay.config.js";

export const usePlayer = defineStore("player", {
  state: () => ({
    currentHealth: PLAYER_CURRENT_HEALTH,
    currentLevel: "BlueWhale",
    abilities: [],
    journal: [
      {
        title: "Blue Whale story",
        text: "Blue Whale story text...",
        id: 0,
      },
      {
        title: "Blue Whale story",
        text: "Blue Whale story text...",
        id: 1,
      },
      {
        title: "Blue Whale story",
        text: "Blue Whale story text...",
        id: 2,
      },
    ],
    alert: {
      isShow: false,
      isShowAction: false,
      text: "New record was added in journal",
    },
    currentColor: "cyan",
    lastVisitedIsland: null,
    jumpAbility: {
      name: "jump",
      isActive: false,
      key: "1",
      icon: "move_up",
      params: {
        jumpMultiplicator: Config.PLAYER_JUMP_MULTIPLICATOR,
        fallMultiplicator: Config.PLAYER_FALL_MULTIPLICATOR,
      },
    },
    fireAbility: { name: "fire", isActive: false, key: "2", icon: "local_fire_department" },
    freezeAbility: { name: "freeze", isActive: false, key: "4", icon: "pause_circle" },
    gravityAbility: { name: "gravity", isActive: false, key: "3", icon: "arrow_upward" },
  }),
  getters: {
    currentAbility(state) {
      return state.abilities.find((ability) => ability.isActive);
    },
    getLastVisitedIsland(state) {
      return state.lastVisitedIsland;
    },
  },
  actions: {
    increase(value, maxHealth) {
      this.currentHealth = Math.min(maxHealth, this.currentHealth + value);
    },
    decrease(value) {
      this.currentHealth = Math.max(0, this.currentHealth - value);
    },
    closeMessage() {
      this.alert.isShow = false;
      this.alert.isShowAction = false;
    },
    showMessage(message, isShowAction = false) {
      this.alert.isShow = true;
      this.alert.isShowAction = isShowAction;
      this.alert.text = message;
    },
    setLastVisitedIsland(islandName) {
      this.lastVisitedIsland = islandName;
    },
    addJumpAbility() {
      this.abilities.push(this.jumpAbility);
    },
    addFireAbility() {
      this.abilities.push(this.fireAbility);
    },
    addGravityAbility() {
      this.abilities.push(this.gravityAbility);
    },
    addFreezeAbility() {
      this.abilities.push(this.freezeAbility);
    },
    deactivateAllAbilities() {
      this.switchAbility(null);
    },
    switchAbility(player, abilityName) {
      this.abilities.forEach((ability) => (ability.isActive = !ability.isActive && abilityName === ability.name));

      if (this.jumpAbility.isActive) {
        this.jumpAbility.params.jumpMultiplicator = Config.PLAYER_JUMP_MULTIPLICATOR_WITH_CHIP;
        this.jumpAbility.params.fallMultiplicator = Config.PLAYER_FALL_MULTIPLICATOR_WITH_CHIP;
      } else {
        this.jumpAbility.params.jumpMultiplicator = Config.PLAYER_JUMP_MULTIPLICATOR;
        this.jumpAbility.params.fallMultiplicator = Config.PLAYER_FALL_MULTIPLICATOR;
      }

      if (this.gravityAbility.isActive) {
        player.body.allowGravity = false;
        console.log("activate gravity chip");
      } else {
        player.body.allowGravity = true;
        console.log("deactivate gravity chip");
      }

      if (this.freezeAbility.isActive) {
        console.log("activate freeze chip");
      } else {
        console.log("deactivate freeze chip");
      }

      if (this.fireAbility.isActive) {
        console.log("activate fire chip");
      } else {
        console.log("deactivate fire chip");
      }
    },
  },
});
