import { createRouter, createWebHashHistory } from "vue-router";

import Platformer from "@/screens/Platformer.screen.vue";
import Devroom from "@/screens/Devroom.screen.vue";

export const routes = [
  {
    path: "/",
    component: Devroom,
  },
  {
    path: "/platformer",
    component: Platformer,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
