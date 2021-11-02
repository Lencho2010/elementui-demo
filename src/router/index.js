import Vue from "vue";
import VueRouter from "vue-router";
import contrastAnalysis from "@/router/contrastAnalysis";
import Query from "./query";
import home from "./home";

Vue.use(VueRouter);

const routeMenu = [
  contrastAnalysis,
  // FitComparison,
  home,
  Query
];

const routes = [
  {
    path: "/",
    redirect: "/contrast-analysis/jctb-task"
  },
  /*{
    path: "/task-detail",
    name: "task-detail",
    component: () => import("../components/contrast-comparison/TaskDetail.vue")
  },*/
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  ...routeMenu
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
