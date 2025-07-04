<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import Phaser from "phaser";
import { PlatformerScene } from "@/scenes/platformer.scene";
import Preloader from "@/ui-components/Preloader.component.vue";
import UiAnchor from "@/ui-components/UiAnchor.component.vue";
import UiModal from "@/ui-components/UiModal.component.vue";
import Journal from "@/ui-components/Journal.component.vue";
import AbilitiesSetComponent from "@/ui-components/AbilitiesSet.component.vue";
import { usePlayer } from "@/store/player.store";
import { LEVEL_HEIGHT, LEVEL_WIDTH } from "@/configs/engine.config";
import { router } from "@/router.js";
import { GRAVITY } from "@/configs/gameplay.config";

const gameContainer = ref(null);
const isShowJournal = ref(false);
const playerStore = usePlayer();
const color = playerStore.currentColor;
let game = null;

const backToShip = () => {
  playerStore.deactivateAllAbilities();
  router.push({ path: "/devroom" });
};

onMounted(() => {
  game = new Phaser.Game({
    type: Phaser.AUTO,
    scene: new PlatformerScene(playerStore),
    backgroundColor: "#a09380",
    scale: {
      width: LEVEL_WIDTH,
      height: LEVEL_HEIGHT,
      mode: Phaser.Scale.FIT,
      parent: gameContainer.value,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: GRAVITY },
        debug: false,
      },
    },
  });
});

onBeforeUnmount(() => game?.destroy(true));
</script>

<template>
  <div class="platformer-screen">
    <Preloader />
    <UiAnchor target=".platformer-screen__game-wrapper" anchor="top-left">
      <v-btn prepend-icon="rocket_launch" :color="`${color}-darken-4`" @click="backToShip"> Back to ship </v-btn>
      <AbilitiesSetComponent class="platformer-screen__abilities-wrapper" />
    </UiAnchor>
    <UiAnchor ref="alertContainer" target=".platformer-screen__game-wrapper" anchor="top-right">
      <v-alert v-model="playerStore.alert.isShow" class="platformer-screen__alert" :color="`${color}-darken-3`" closable @close="playerStore.closeMessage">
        <div class="platformer-screen__alert-content">
          <span>{{ playerStore.alert.text }}</span>
        </div>
      </v-alert>
    </UiAnchor>
    <UiModal v-model="isShowJournal" max-width="900px" target=".platformer-screen__game-wrapper">
      <Journal />
    </UiModal>
    <UiAnchor target=".platformer-screen__game-wrapper" anchor="bottom-left">
      <v-btn icon="sim_card" size="x-large" :color="`${color}-darken-4`" @click="isShowJournal = true" />
    </UiAnchor>
    <div ref="gameContainer" class="platformer-screen__game-wrapper"></div>
  </div>
</template>

<style scoped lang="scss">
.platformer-screen {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  &__abilities-wrapper {
    margin-top: 10px;
  }

  &__alert {
    width: 400px;
  }

  &__alert-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
