import Vue from "vue";
import VueRouter from "vue-router";
import FitComparison from "./fit-comparison";
import Home from "./home";
import Query from "./query";
import home from "./home";

Vue.use(VueRouter);

const routeMenu = [
  FitComparison,
  home,
  Query
];

const routes = [
  {
    path: "/",
    redirect: "/fit-comparison"
  },
  /*{
    path: "/task-detail",
    name: "task-detail",
    component: () => import("../components/fit-comparison/TaskDetail.vue")
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
