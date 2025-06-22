import { defineStore } from "pinia";
import * as Config from "@/configs/gameplay.config.js";

export const usePlayer = defineStore("player", {
  state: () => ({
    currentLevel: "BlueWhale",
    abilities: [],
    journal: [
      {
        title: "Green Whale title #1",
        text: "Green Whale story text #1...",
        color: "green",
        number: 1,
        isActive: false,
      },
      {
        title: "Green Whale title #2",
        text: "Green Whale story text #2...  <span class='text-green-darken-4 font-weight-bold'>Name</span>",
        color: "green",
        number: 2,
        isActive: false,
      },
      {
        title: "Indigo Whale title #1",
        text: "Indigo Whale story text #1... <span class='text-green-darken-4 font-weight-bold'>Name</span>",
        color: "indigo",
        number: 3,
        isActive: false,
      },
      {
        title: "Indigo Whale title #2",
        text: "Indigo Whale story text #2... <span class='text-red-darken-4 font-weight-bold'>Name</span>",
        color: "indigo",
        number: 4,
        isActive: false,
      },
      {
        title: "Red Whale title #1",
        text: "Red Whale story text #1...<span class='text-green-darken-4 font-weight-bold'>Name</span><span class='text-red-darken-4 font-weight-bold'>Name</span>",
        color: "red",
        number: 5,
        isActive: false,
      },
      {
        title: "Red Whale title #2",
        text: "Red Whale story text #2... <span class='text-indigo-darken-4 font-weight-bold'>Name</span>",
        color: "red",
        number: 6,
        isActive: false,
      },
      {
        title: "Cyan Whale title #1",
        text: "Cyan Whale story text #1...<span class='text-green-darken-4 font-weight-bold'>Name</span><span class='text-indigo-darken-4 font-weight-bold'>Name</span><span class='text-red-darken-4 font-weight-bold'>Name</span>",
        color: "cyan",
        number: 7,
        isActive: false,
      },
      {
        title: "Cyan Whale title #2",
        text: "Cyan Whale story text #2...<span class='text-cyan-darken-4 font-weight-bold'>Name</span>",
        color: "cyan",
        number: 8,
        isActive: false,
      },
      {
        title: "Amber Whale title #1",
        text: "Amber Whale story text #1...<span class='text-green-darken-4 font-weight-bold'>Name</span><span class='text-indigo-darken-4 font-weight-bold'>Name</span><span class='text-red-darken-4 font-weight-bold'>Name</span><span class='text-cyan-darken-4 font-weight-bold'>Name</span>",
        color: "amber",
        number: 9,
        isActive: false,
      },
      {
        title: "Amber Whale title #2",
        text: "Amber Whale story text #2...<span class='text-amber-darken-4 font-weight-bold'>Name</span>",
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
    gravityAbility: { name: "gravity", isActive: false, key: "3", icon: "arrow_upward", color: "indigo" },
    fireAbility: { name: "fire", isActive: false, key: "2", icon: "local_fire_department", color: "red" },
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
