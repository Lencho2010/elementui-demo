<template>
  <div id="unzip-wrapper2">
    <el-drawer ref="dialog"
               :visible.sync="centerDialogVisible"
               direction="btt"
               :with-header="false"
               :size="pageSize">
      <div class="root-wrapper">
        <div class="header">
          <div class="left">
            <span class="title">{{ title }}</span>
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
    </el-drawer>
  </div>
</template>

<script>
import unzipData from "../../../test/unzipData";
import { listUnzipData } from "@/api/contrast/taskInfo";
import layExcel from "lay-excel";

export default {
  name: "UnzipDetail2",
  mounted() {
    this.originData = unzipData();
    this.filterInfo.options = this.columns
      .filter(item => item.filter)
      .map(item => ({
        value: item.prop,
        label: item.label
      }));
    this.filterInfo.modelVal = this.filterInfo.options[0].label;
    this.filterInfo.curValue = this.filterInfo.options[0].value;
    this.getList();
  },
  data() {
    return {
      title: "原始数据",
      columns: [
        { prop: "index", label: "序号", width: 80, align: "center", filter: false },
        { prop: "dataName", label: "数据名称", width: 170, align: "center", filter: true },
        { prop: "countyCode", label: "区县代码", width: 170, align: "center", filter: true },
        { prop: "countyName", label: "区县名称", width: 170, align: "center", filter: true },
        { prop: "cityCode", label: "地市代码", width: 170, align: "center", filter: true },
        { prop: "cityName", label: "地市名称", width: 170, align: "center", filter: true },
        { prop: "provinceCode", label: "省级代码", width: 170, align: "center", filter: true },
        { prop: "provinceName", label: "省级名称", width: 170, align: "center", filter: true },
        { prop: "dataPath", label: "路径", width: "auto", align: "left", filter: false }
      ],
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
      pageSize: 370
    };
  },
  methods: {
    showDialog(taskName) {
      listUnzipData(taskName).then(({ data }) => {
        this.isExpand = false;
        this.centerDialogVisible = true;
        this.originData = data;
        this.getList();
      })
        .catch(err => this.$message.error(err));
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
      }, `${this.title}.xlsx`, "xlsx");
    }
  },
  computed: {},
  watch: {
    isExpand(newVal, oldVal) {
      this.tableHeight = newVal ? (this.$refs.dialog.$el.clientHeight - 70) : 300;
      this.pageSize = newVal ? "100%" : 370;
      // this.pageSize = this.tableHeight + 70;
    }
  }
};
</script>

<style lang="less">

#unzip-wrapper2 {
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

        .title {
          font-size: 22px;
          font-weight: bold;
          margin-left: 10px;
        }

        .search-wrap {
          width: 250px;
          /*i{
            width: 34px;
            height: 34px;
          }*/
        }

        /*.search-input {
          .el-input__inner {
            height: 34px;
          }
        }*/

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
