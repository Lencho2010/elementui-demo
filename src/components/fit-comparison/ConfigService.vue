<template>
  <el-dialog id="config-service"
             title="服务程序配置信息"
             :visible.sync="centerDialogVisible"
             width="600px"
             top="300px"
             left>
    <div
      style="display: flex; flex-direction: column; align-items: center; height: 130px; justify-content: space-around">
      <div>
        <span style="font-size: 16px">扫描路径：</span>
        <el-select v-model="scanPath.value" placeholder="" style="width: 400px">
          <el-option
            v-for="item in scanPath.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="display: flex; margin-top: 20px; align-items: center">
        <span style="font-size: 16px">扫描周期：</span>
        <!--        <el-input style="width: 210px"
                          v-model="inputNum"
                          placeholder="请输入"></el-input>-->
        <el-input-number style="width: 210px"
                         v-model="inputNum"
                         controls-position="right"
                         @change="handleChange"
                         :min="1" :max="999"></el-input-number>
        <span style="width: 20px"></span>
        <el-select v-model="timeUnit.value" placeholder="" style="width: 170px">
          <el-option
            v-for="item in timeUnit.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" :loading="isLoading" @click="handleOk">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>

import {
  gainScanPaths,
  gainScanPath,
  updateScanPath,
  gainScanInterval,
  updateScanInterval,
  updateScanPathAndInterval
} from "@/api/fit/sysPara.js";

export default {
  name: "ConfigService",
  mounted() {
    this.init();
  },
  data() {
    return {
      centerDialogVisible: false,
      timeUnit: {
        value: "min",
        options: [
          //{ value: "day", label: "天" },
          //{ value: "hour", label: "小时" },
          { value: "min", label: "分钟" }
        ]
      },
      inputNum: 8,
      scanPath: {
        value: "",
        options: [
          /*{ value: "http://www.github.com", label: "http://www.github.com" },
          { value: "http://www.baidu.com", label: "http://www.baidu.com" },
          { value: "http://www.google.com", label: "http://www.google.com" }*/
        ]
      },
      isLoading: false
    };
  },
  methods: {
    async init() {
      const { data } = await gainScanPaths();
      const paths = JSON.parse(data);
      paths.forEach((item, index) => this.scanPath.options.push({ value: item, label: item }));

      const { data: scanPath } = await gainScanPath();
      this.scanPath.value = scanPath;

      const { data: scanInterval } = await gainScanInterval();
      this.inputNum = scanInterval;
    },
    handleChange(value) {
      console.log(value);
    },
    showDialog() {
      this.centerDialogVisible = true;
    },
    async handleOk() {
      this.isLoading = true;
      const { data: ret1 } = await updateScanPath(this.scanPath.value);
      const { data: ret2 } = await updateScanInterval(this.inputNum);
      this.isLoading = false;
      if (ret1 && ret2) {
        this.centerDialogVisible = false;
        this.$message.success("保存配置成功！");
      } else {
        this.isLoading = false;
        this.$message.error("保存配置失败！");
      }
    }
  }
};

</script>

<style>
#config-service .el-dialog__header {
  border-bottom: 1px solid #cccccc;
}

#config-service .el-dialog__footer {
  text-align: center;
}
</style>