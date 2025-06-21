<script setup lang="ts">
import { usePlayer } from "@/store/player.store";

const playerStore = usePlayer();
</script>

<template>
  <v-expansion-panels class="journal" variant="inset">
    <v-expansion-panel v-for="record in playerStore.activeRecords" :key="record.id" :title="record.title" :bg-color="`${record.color}-lighten-3`" :color="`${record.color}-darken-3`">
      <v-expansion-panel-text><p v-html="record.text"></p></v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped lang="scss">
.journal {
  width: 700px;
}
</style>
