import { defineStore } from "pinia";
import * as Config from "@/configs/gameplay.config.js";

export const usePlayer = defineStore("player", {
  state: () => ({
    currentLevel: "BlueWhale",
    abilities: [],
    journal: [
      {
        title: "The first entry on the green whale",
        text: "This is just a small story about four friends. Somewhere around here is the story of the first one. <i>Use the A, W, and D keys to move</i>",
        color: "green",
        number: 1,
        isActive: false,
      },
      {
        title: "The last entry on the green whale",
        text: "More than anything in the world, <span class='text-green-darken-4 font-weight-bold'>Grinny</span> loved to jump. And she did it better than anyone. <i>Press the 1 key to activate the long jump ability</i>",
        color: "green",
        number: 2,
        isActive: false,
      },
      {
        title: "The first entry on the indigo whale",
        text: "One day, <span class='text-green-darken-4 font-weight-bold'>Grinny</span> decided to visit a friend, but her friend lived very high up. However, <span class='text-green-darken-4 font-weight-bold'>Grinny</span> wasn't afraid, because she could jump far.",
        color: "indigo",
        number: 3,
        isActive: false,
      },
      {
        title: "The last entry on the green whale",
        text: "This friend was <span class='text-indigo-darken-4 font-weight-bold'>Indy</span>. They say he didn’t burn in fire. <i>Press the 2 key to activate fire resistance</i>",
        color: "indigo",
        number: 4,
        isActive: false,
      },
      {
        title: "The first entry on the red whale",
        text: "<span class='text-green-darken-4 font-weight-bold'>Grinny</span> and <span class='text-indigo-darken-4 font-weight-bold'>Indy</span> were walking down the street. But a fire blocked their path. <span class='text-red-darken-4 font-weight-bold'>Indy</span> went ahead to call for help, because he wasn’t afraid of fire.",
        color: "red",
        number: 5,
        isActive: false,
      },
      {
        title: "The last entry on the red whale",
        text: "When the fire died down, they saw <span class='text-red-darken-4 font-weight-bold'>Reddy</span>. He was a great debater. Some say he could even argue against gravity. <i>Press the 3 key to disable gravity</i>",
        color: "red",
        number: 6,
        isActive: false,
      },
      {
        title: "The first entry on the cyan whale",
        text: "One day, <span class='text-green-darken-4 font-weight-bold'>Grinny</span>, <span class='text-indigo-darken-4 font-weight-bold'>Indy</span>, and <span class='text-red-darken-4 font-weight-bold'>Reddy</span> fell into a well. They started arguing about how to get out. <span class='text-red-darken-4 font-weight-bold'>Reddy</span> won the argument, because he could even out-argue gravity.",
        color: "cyan",
        number: 7,
        isActive: false,
      },
      {
        title: "The last entry on the cyan whale",
        text: "At the top, <span class='text-cyan-darken-4 font-weight-bold'>Cyan</span> was waiting for them. He was never late anywhere, because time could always wait for him. <i>Press the 4 key to stop time</i>",
        color: "cyan",
        number: 8,
        isActive: false,
      },
      {
        title: "The first entry on the amber whale",
        text: "And so, the four friends: <span class='text-green-darken-4 font-weight-bold'>Grinny</span>, <span class='text-indigo-darken-4 font-weight-bold'>Indy</span>, <span class='text-red-darken-4 font-weight-bold'>Reddy</span>, and <span class='text-cyan-darken-4 font-weight-bold'>Cyan</span> set off on their greatest adventure, where each could showcase their talents.",
        color: "amber",
        number: 9,
        isActive: false,
      },
      {
        title: "The last entry on the amber whale",
        text: "The friends overcame all obstacles by supporting each other, and each was able to showcase their talent. They entrusted their stories to the space whales, in case one day a passing traveler wants to listen to them.",
        color: "amber",
        number: 10,
        isActive: false,
      },
    ],
    alert: {
      isShow: false,
      isShowAction: false,
      text: "New record was added in journal",
    },
    currentColor: "amber",
    lastVisitedIsland: "green",
    jumpAbility: {
      name: "jump",
      isActive: false,
      key: "1",
      icon: "move_up",
      color: "green",
      params: {
        jumpMultiplicator: Config.PLAYER_JUMP_MULTIPLICATOR,
        fallMultiplicator: Config.PLAYER_FALL_MULTIPLICATOR,
      },
    },
    gravityAbility: { name: "gravity", isActive: false, key: "3", icon: "arrow_upward", color: "red" },
    fireAbility: { name: "fire", isActive: false, key: "2", icon: "local_fire_department", color: "indigo" },
    freezeAbility: { name: "freeze", isActive: false, key: "4", icon: "pause_circle", color: "cyan" },
  }),
  getters: {
    currentAbility(state) {
      return state.abilities.find((ability) => ability.isActive);
    },
    getLastVisitedIsland(state) {
      return state.lastVisitedIsland;
    },
    activeRecords(state) {
      return state.journal.filter((record) => record.isActive);
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
