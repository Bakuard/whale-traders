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
      if (!this.abilities.find((ability) => ability === this.jumpAbility)) this.abilities.push(this.jumpAbility);
    },
    addFireAbility() {
      if (!this.abilities.find((ability) => ability === this.fireAbility)) this.abilities.push(this.fireAbility);
    },
    addGravityAbility() {
      if (!this.abilities.find((ability) => ability === this.gravityAbility)) this.abilities.push(this.gravityAbility);
    },
    addFreezeAbility() {
      if (!this.abilities.find((ability) => ability === this.freezeAbility)) this.abilities.push(this.freezeAbility);
    },
    deactivateAllAbilities() {
      this.abilities.forEach((ability) => (ability.isActive = false));
    },
  },
});
