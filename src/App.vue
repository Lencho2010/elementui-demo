<template>
  <div id="app">
    <!--<div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </div>-->
    <nav-bar></nav-bar>
    <router-view />
  </div>
</template>

<script>
import "@/assets/css/normalize.css";
import "@/assets/css/reset.css";
import "@/assets/css/public.css";
import "@/assets/css/common.css";
import NavBar from "./components/NavBar";

export default {
  components: { NavBar },
  data() {
    return {};
  }
};
</script>

<style lang="less">
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
}

</style>
