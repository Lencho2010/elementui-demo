<template>
  <div id="nav-bar">
    <ul class="nav-bar-wrapper">
      <li class="nav-bar-item"
          v-for="(item,index) of menuList"
          :key="item.key"
          :class="{active:activeIndex===index}"
          @click="toggleMenu(item,index)">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      menuList: [{
        key: 1001,
        name: "首页",
        route: "/home"
      }, {
        key: 1002,
        name: "浏览查询",
        route: "/query"
      }, {
        key: 1003,
        name: "套合比对",
        route: "/contrast-analysis/jctb-task"
      }],
      activeIndex: 0
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    init() {
      /*let path = this.$route.path;
      console.log(path.split('/'), this.menuList);
      this.activeIndex = this.menuList.findIndex(item => path.indexOf(item.route) > -1);*/

      let path = this.$route.path.split("/")[1];
      this.activeIndex = this.menuList.findIndex(item => item.route.indexOf(path) > -1);
    },
    toggleMenu(item, index) {
      this.activeIndex = index;
      this.$router.push(item.route);
    }
  }
};
</script>

<style scoped>

#nav-bar {
  width: 100%;
  /*height: 70px;*/
  height: 0;
  background-image: url("../assets/images/layout/head_bg.png");
  background-size: 100% 100%;
  font-size: 14px;
}

.nav-bar-wrapper {
  display: flex;
  justify-content: center;
}

.nav-bar-item {
  font-size: 24px;
  color: whitesmoke;
  line-height: 70px;
  display: inline-block;
  margin: 0 10px;
  cursor: pointer;
}

ul li {
  color: #fff;
  font-size: 16px;
  width: 120px;
  height: 70px;
  text-align: center;
  line-height: 70px;
  padding: 0 10px;
}

ul li.active {
  background-color: #0387cf;
}

ul li:hover {
  background-color: #0387cf;
  cursor: pointer;
}
</style>
