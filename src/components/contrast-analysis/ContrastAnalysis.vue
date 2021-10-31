<template>
  <el-container id="contrast-analysis" style="background-color: #f2f2f2">
    <el-aside style="background-color: #ffffff;width: 270px">
      <el-menu
        :default-active="activeMenuItem"
        class="el-menu-vertical-demo"
        active-text-color="#1890ff"
        style="font-size: 26px"
        router="true"
        @select="handleSelect">
        <el-menu-item index="jctb-task" route="/contrast-analysis/jctb-task">
          <i class="el-icon-menu"></i>
          <span slot="title">套合比对任务</span>
        </el-menu-item>
        <el-menu-item index="statistic-report" route="/contrast-analysis/statistic-report">
          <i class="el-icon-setting"></i>
          <span slot="title">统计报告报表</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <div style="padding: 15px;height: 100%;width: 100%">
        <!--        <div style="background-color: #1f3349;height: 100%"></div>-->
        <router-view></router-view>
      </div>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "ContrastAnalysis",
  data() {
    return {
      activeMenuItem: "jctb-task"
    };
  },
  mounted() {
    this.activeMenuItem = this.$route.name;
  },
  methods: {
    handleSelect(key) {
      this.activeMenuItem = key;
    }
  }
};
</script>

<style lang="less" scoped>
#contrast-analysis {
  .el-menu-item {
    font-size: 22px;

    span {
      margin-left: 10px;
    }
  }

  .el-menu .is-active {
    border-right: #1890ff 5px solid;
    background-color: #e6f7ff;
  }
}

</style>