import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Preview from "../pages/Preview.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/preview",
    component: Preview,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
