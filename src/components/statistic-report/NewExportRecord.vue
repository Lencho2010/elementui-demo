<template>
  <el-container id="new-export-record">
    <el-main>
      <div class="main-wrapper">
        <div class="label-info">基本信息</div>
        <div class="grid-info">
          <span><i class="must-flag">*</i>名称：</span>
          <el-input size="small" v-model="name"></el-input>

          <span><i class="must-flag">*</i>责任人：</span>
          <el-input size="small" v-model="chargePerson"></el-input>

          <span>描述：</span>
          <el-input size="small" v-model="desc"></el-input>
        </div>
        <div class="label-info">统计信息</div>
        <div class="grid-info">
          <span><i class="must-flag">*</i>统计类型：</span>
          <!--          <el-input size="small"></el-input>-->
          <el-select v-model="chooseStatistic" @change="handleStatisticChange" placeholder="请选择">
            <el-option
              v-for="item in statisticOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <span><i class="must-flag">*</i>统计日期：</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>

          <span><i class="must-flag">*</i>统计批次：</span>
          <el-select
            size="small"
            v-model="chooseTaskNames"
            multiple
            filterable
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in taskNameArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="label-info">导出文档</div>
        <div class="doc-info">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkDocsAll" @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedDocs" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in docOptions" :label="city" :key="city">{{ city }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </el-main>
    <el-footer style="text-align: center">
      <el-button size="small" @click="handleNewAndExport">创建并导出</el-button>
      <el-button size="small" @click="handleNew">创建</el-button>
      <el-button size="small" @click="handleReset">重置</el-button>
    </el-footer>
  </el-container>
</template>

<script>

export default {
  name: "NewExportRecord",
  data() {
    return {
      name: "",
      chargePerson: "admin",
      desc: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dateRange: "",
      statisticOptions: [
        { value: "week", label: "周报" },
        { value: "month", label: "月报" },
        { value: "year", label: "年报" }
      ],
      chooseStatistic: "week",
      taskNameArr: [
        { value: "2021S104300011", label: "2021S104300011" },
        { value: "2021S104300012", label: "2021S104300012" },
        { value: "2021S104300013", label: "2021S104300013" },
        { value: "2021S104300014", label: "2021S104300014" },
        { value: "2021S104300015", label: "2021S104300015" }
      ],
      chooseTaskNames: [],

      checkDocsAll: false,
      checkedDocs: ["关于2021年卫片执法下发数据情况的报告", "附1", "附2", "附3"],
      docOptions: ["关于2021年卫片执法下发数据情况的报告", "附1", "附2", "附3", "表1", "表2", "表3", "表4", "表5", "表6", "表7", "表8", "表9"],
      isIndeterminate: true
    };
  },
  methods: {
    handleNewAndExport() {
      this.$emit("returnList");
    },
    handleNew() {
      this.$emit("returnList");
    },
    handleReset() {
      this.name = "";
      this.chargePerson = "admin";
      this.desc = "";
      this.dateRange = "";
      this.chooseTaskNames = [];
      this.isIndeterminate = false;
      this.checkedDocs = [];
      this.chooseStatistic = "week";
      console.log(this.dateRange, "@@@@@");
    },
    handleStatisticChange(val) {
      console.log(val, "@@@@@");
    },
    handleCheckAllChange(val) {
      this.checkedDocs = val ? this.docOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkDocsAll = checkedCount === this.docOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.docOptions.length;
    }
  }
};
</script>

<style lang="less" scoped>
#new-export-record {
  .main-wrapper {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-row-gap: 30px;
    padding: 10px 50px;

    .label-info {
      font-size: 18px;
      font-weight: bold;
      width: 150px;
      text-align: center;
    }

    .grid-info {
      width: 400px;
      display: grid;
      grid-template-columns: 100px 450px;
      grid-row-gap: 15px;
      grid-column-gap: 20px;

      span {
        line-height: 32px;
        text-align: right;

        .must-flag {
          color: red;
          margin-right: 5px
        }
      }
    }

    .doc-info {
      .el-checkbox-group {
        .el-checkbox {
          margin-bottom: 15px;
        }
      }
    }
  }

}
</style>