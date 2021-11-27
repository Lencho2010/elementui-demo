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
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      requireAuth: true
    }
  },
  ...routeMenu
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

const originPush = VueRouter.prototype.push;

VueRouter.prototype.push = function(location, resolve, reject) {
  if (resolve || reject) {
    return originPush.call(this, location, resolve, reject);
  } else {// 用户只传了第一个参数
    /*
    默认底层： catch()方法代码  throw err : 抛出异常
    吞掉报错原理： 重写catch()方法,把默认底层的 throw err给去掉，就不会抛出异常
    */
    return originPush.call(this, location).catch(err => {
      //  throw err
    });
  }
};

function checkToken(routeTo) {
  /*
  1.检查路由参数中是否携带token，携带token证明是通过认证中心登录成功后转发过来的，
  2.无携带token则判断localStorage中是否包含token，如果存在，则证明已经登录过了
  3.localStorage中无token信息，则用户没有登录，转发至统一认证中心
  4.token应该存储在前端系统vuex中，当另外一个系统退出时，把统一认证中心的token清除，
    当前系统request请求后端认证时，检测到不可用，则同时清除token，跳转到登录页面
  */

  if (routeTo.query["xxl_sso_sessionid"])
    sessionStorage.setItem("token", routeTo.query["xxl_sso_sessionid"]);
  return !!sessionStorage.getItem("token");
}

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    console.log("需要登录权限...");
    if (checkToken(to)) {
      next();
    } else {
      let fromPath = from.fullPath;
      if (from.fullPath === "/") fromPath = to.fullPath;

      const routeToPath = window.location.href.replace(fromPath, to.fullPath);
      console.log("http://localhost:8080/xxl-sso-server/login?redirect_url=" + routeToPath, "@@@");
      window.location.href = "http://localhost:8080/xxl-sso-server/login?redirect_url=" + routeToPath;

      /*next({ path: "/" });*/
      // window.open("http://www.baidu.com", "_blank");
    }
  } else {
    next();
  }
});


//全局后置路由守卫————初始化的时候被调用、每次路由切换之后被调用
router.afterEach((to, from) => {

});

export default router;
