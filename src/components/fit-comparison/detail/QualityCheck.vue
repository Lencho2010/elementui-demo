<template>
  <div id="quality-check">
    <el-dialog ref="dialog"
               :visible.sync="centerDialogVisible"
               width="100%"
               top="0">
      <div class="root-wrapper">
        <div class="header">
          <div class="left">
            <el-tabs style="margin-left: 20px" v-model="activeName" @tab-click="handleTabChange">
              <el-tab-pane label="质检总览" name="overview"></el-tab-pane>
              <el-tab-pane label="质检明细" name="detail"></el-tab-pane>
              <el-tab-pane label="质检不通过图斑" name="fail"></el-tab-pane>
            </el-tabs>
            <div class="search-wrap fl" style="margin-left: 50px">
              <el-input
                class="search-input"
                v-model="searchText"
                placeholder="请输入"
                @keyup.enter.native="getList"></el-input>
              <i @click="getList"></i>
            </div>
            <el-select v-model="filterInfo.modelVal" placeholder="请选择" @change="selectChange">
              <el-option
                v-for="item in filterInfo.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="right">
            <el-button icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
            <el-button icon="el-icon-sort" size="small" @click="isExpand=false" v-show="isExpand">折叠</el-button>
            <el-button icon="el-icon-sort" size="small" @click="isExpand=true" v-show="!isExpand">展开</el-button>
            <i class="close" @click="centerDialogVisible=false"></i>
          </div>
        </div>
        <div class="body">
          <el-table
            :data="tableData" :height="tableHeight"
            :header-cell-style="{backgroundColor:'#f0f0f0',color:'#333',fontWeight:'bold',fontSize:'18px'}"
            border style="width: 100%">
            <el-table-column v-for="item of columns"
                             :align="item.align"
                             :prop="item.prop"
                             :label="item.label"
                             :width="item.width">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import layExcel from "lay-excel";
import qualityCheck from "../../../test/qualityCheck";
import { listCheckData } from "@/api/contrast/checkInfo";

export default {
  name: "QualityCheck",
  mounted() {
    //this.handleTabChange();
  },
  data() {
    return {
      columns: [],
      columnInfo: {
        overview: [
          { prop: "index", label: "序号", width: 80, align: "center", filter: false },
          { prop: "taskName", label: "批次", width: 170, align: "center", filter: true },
          { prop: "countyCode", label: "区县代码", width: 170, align: "center", filter: true },
          { prop: "countyName", label: "区县名称", width: 170, align: "center", filter: true },
          { prop: "cityCode", label: "地市代码", width: 170, align: "center", filter: true },
          { prop: "cityName", label: "地市名称", width: 170, align: "center", filter: true },
          { prop: "provinceCode", label: "省级代码", width: 170, align: "center", filter: true },
          { prop: "provinceName", label: "省级名称", width: 170, align: "center", filter: true },
          { prop: "status", label: "状态", width: 170, align: "center", filter: true },
          { prop: "info", label: "信息", width: "auto", align: "left", filter: true }
        ],
        detail: [
          { prop: "index", label: "序号", width: 80, align: "center", filter: false },
          { prop: "taskName", label: "批次", width: 170, align: "center", filter: true },
          { prop: "countyCode", label: "区县代码", width: 120, align: "center", filter: true },
          { prop: "countyName", label: "区县名称", width: 120, align: "center", filter: true },
          { prop: "cityCode", label: "地市代码", width: 120, align: "center", filter: true },
          { prop: "cityName", label: "地市名称", width: 120, align: "center", filter: true },
          { prop: "provinceCode", label: "省级代码", width: 120, align: "center", filter: true },
          { prop: "provinceName", label: "省级名称", width: 120, align: "center", filter: true },
          { prop: "ruleCode", label: "规则代码", width: 120, align: "center", filter: true },
          { prop: "ruleName", label: "规则", width: 170, align: "center", filter: true },
          { prop: "checkResult", label: "质检结果", width: 170, align: "center", filter: true },
          { prop: "checkInfo", label: "质检信息", width: 170, align: "center", filter: true },
          { prop: "finalResult", label: "结果信息", width: "auto", align: "left", filter: true }
        ],
        fail: [
          { prop: "index", label: "序号", width: 80, align: "center", filter: false },
          { prop: "taskName", label: "批次", width: 170, align: "center", filter: true },
          { prop: "countyCode", label: "区县代码", width: 150, align: "center", filter: true },
          { prop: "countyName", label: "区县名称", width: 150, align: "center", filter: true },
          { prop: "cityCode", label: "地市代码", width: 150, align: "center", filter: true },
          { prop: "cityName", label: "地市名称", width: 150, align: "center", filter: true },
          { prop: "provinceCode", label: "省级代码", width: 150, align: "center", filter: true },
          { prop: "provinceName", label: "省级名称", width: 150, align: "center", filter: true },
          { prop: "ruleCode", label: "规则代码", width: 150, align: "center", filter: true },
          { prop: "ruleName", label: "规则", width: 170, align: "center", filter: true },
          { prop: "tbbh", label: "图斑编号", width: 170, align: "center", filter: true },
          { prop: "finalResult", label: "结果信息", width: "auto", align: "left", filter: true }
        ]
      },
      originData: [],
      tableData: [],
      centerDialogVisible: false,
      searchText: "",
      filterInfo: {
        options: [],
        modelVal: "",
        curValue: ""
      },
      isExpand: false,
      tableHeight: 300,
      activeName: "overview",
      taskName: "",
      cacheData: { "overview": [], "detail": [], "fail": [] }
    };
  },
  methods: {
    showDialog(taskName) {
      this.taskName = taskName;
      this.isExpand = false;
      this.centerDialogVisible = true;
      this.handleTabChange();
    },
    handleTabChange(tab, event) {
      this.searchText = "";
      this.columns = this.columnInfo[this.activeName];
      this.filterInfo.options = this.columns
        .filter(item => item.filter)
        .map(item => ({
          value: item.prop,
          label: item.label
        }));
      this.filterInfo.modelVal = this.filterInfo.options[0].label;
      this.filterInfo.curValue = this.filterInfo.options[0].value;

      /*this.originData = qualityCheck()[this.activeName];
      this.getList();*/
      let activeData = this.cacheData[this.activeName];
      if (activeData.length > 0) {
        this.originData = activeData;
        this.getList();
      } else
        listCheckData(this.activeName, this.taskName).then(({ data }) => {
          console.log("request...");
          this.cacheData[this.activeName] = data;
          this.originData = data;
          this.getList();
        });
    },
    selectChange(val) {
      this.filterInfo.curValue = val;
      this.getList();
    },
    isEmpty(obj) {
      return typeof obj == "undefined" || obj == null || obj === "";
    },
    getList() {
      const key = this.filterInfo.curValue;
      const word = this.searchText.trim();
      if (this.isEmpty(word)) this.tableData = this.originData;
      else this.tableData = this.originData.filter(item => item[key].search(word) > -1);
    },
    handleExport() {
      if (this.tableData.length === 0) {
        this.$message.warning("没有要导出的数据！");
        return;
      }
      const resData = this.tableData.map(item => item);
      const resCol = {};
      this.columns.forEach(item => resCol[item.prop] = item.label);
      resData.unshift(resCol);
      const fields = this.columns.map(item => item.prop);
      const data = layExcel.filterExportData(resData, fields);
      // 3. 执行导出函数，系统会弹出弹框
      layExcel.exportExcel({
        sheet1: data
      }, `${this.activeName}.xlsx`, "xlsx");
    }
  },
  computed: {},
  watch: {
    isExpand(newVal, oldVal) {
      this.tableHeight = newVal ? (this.$refs.dialog.$el.clientHeight - 140) : 300;
    }
  }
};
</script>

<style lang="less">

#quality-check {
  .el-dialog {
    position: absolute;
    bottom: 0;
    margin-bottom: 0;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 5px;
  }

  .root-wrapper {
    display: flex;
    flex-direction: column;

    .header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        display: flex;
        align-items: center;

        .search-wrap {
          width: 250px;
        }

        .el-select {
          margin-left: 30px;
        }
      }

      .right {
        display: flex;
        align-items: center;

        .close {
          margin: 0 10px 0 20px;
          cursor: pointer;
          width: 20px;
          height: 20px;
          background: url("../../../assets/images/close_grey.png") center no-repeat;
          background-size: 16px 16px;
        }
      }
    }

    .body {
      flex: 1;

      .expand {
        height: calc(100% - 70px);
      }

      .fold {
        height: 300px;
      }
    }
  }
}

</style>