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
        <el-input style="width: 210px" v-model="inputNum" placeholder="请输入"></el-input>
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
    <el-button type="primary" @click="handleOk">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "ConfigService",
  data() {
    return {
      centerDialogVisible: false,
      timeUnit: {
        value: "hour",
        options: [
          { value: "day", label: "天" },
          { value: "hour", label: "小时" },
          { value: "min", label: "分钟" }
        ]
      },
      inputNum: 8,
      scanPath: {
        value: "",
        options: [
          { value: "http://www.github.com", label: "http://www.github.com" },
          { value: "http://www.baidu.com", label: "http://www.github.com" },
          { value: "http://www.google.com", label: "http://www.github.com" }
        ]
      }
    };
  },
  methods: {
    showDialog() {
      this.centerDialogVisible = true;
    },
    handleOk() {

      this.$message.warning("请输入正确的配置信息...")
      return;

      this.centerDialogVisible = false;
      this.$message.success("保存配置成功！")

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