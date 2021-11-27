<template>
  <div id="quality-check2">
    <el-drawer ref="dialog"
               :visible.sync="centerDialogVisible"
               direction="btt"
               :size="pageSize"
               :with-header="false">
      <div class="root-wrapper">
        <div class="header">
          <div class="left">
            <el-tabs style="margin-left: 20px" v-model="activeName" @tab-click="handleTabChange">
              <el-tab-pane v-for="item in tabDatas" :label=item.label :name=item.name></el-tab-pane>
              <!--              <el-tab-pane label="质检明细" name="detail"></el-tab-pane>-->
              <!--              <el-tab-pane label="质检不通过图斑" name="fail"></el-tab-pane>-->
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
        <div class="body" style="margin-bottom: 5px">
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
        <el-pagination
          style="margin: 0 auto"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.currentPage"
          :page-sizes="pageInfo.pageSizes"
          :page-size="pageInfo.pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="pageInfo.totalCount">
        </el-pagination>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { pageCheckData, exportCheckDataNew } from "@/api/contrast/checkInfo";

export default {
  name: "QualityCheck2",
  mounted() {
    //this.handleTabChange();
  },
  data() {
    return {
      columns: [],
      columnInfo: {
        overview: [
          { prop: "index", label: "序号", width: 80, align: "center", filter: false },
          { prop: "taskName", label: "批次", width: 170, align: "center", filter: false },
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
          { prop: "taskName", label: "批次", width: 170, align: "center", filter: false },
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
          { prop: "taskName", label: "批次", width: 170, align: "center", filter: false },
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
      pageSize: 400,
      activeName: "overview",
      taskName: "",
      pageInfo: {
        currentPage: 1,
        totalCount: 0,
        pageSizes: [5, 10, 20, 50],
        pageSize: 5
      },
      tabDatas: [
        {
          label: "质检总览",
          name: "overview"
        },
        {
          label: "质检明细",
          name: "detail"
        },
        {
          label: "质检不通过图斑",
          name: "fail"
        }
      ]
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
      this.getList();
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
      const page = this.pageInfo.currentPage;
      const rows = this.pageInfo.pageSize;
      const searchEntity = { taskName: this.taskName };
      if (!!word) searchEntity[key] = word;
      pageCheckData(this.activeName, page, rows, searchEntity).then(({ data }) => {
        const { list, total } = data;
        this.pageInfo.totalCount = total;
        this.tableData = list.map((item, index) => ({ ...item, index: (page - 1) * rows + 1 + index }));
      });
    },
    handleExport() {
      if (this.tableData.length === 0) {
        this.$message.warning("没有要导出的数据！");
        return;
      }

      const key = this.filterInfo.curValue;
      const word = this.searchText.trim();
      const searchEntity = { taskName: this.taskName };
      if (!!word) searchEntity[key] = word;
      const fileName = this.tabDatas.find(t => t.name === this.activeName).label + ".xls";
      exportCheckDataNew(this.activeName, searchEntity, fileName);
    },
    gainStatus(status) {
      let ret = "";
      switch (status) {
        case -1:
          ret = "不通过";
          break;
        case 1:
          ret = "通过";
          break;
        case 0:
        default:
          ret = "";
          break;
      }
      return ret;
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      const { currentPage: curPage, pageSize } = this.pageInfo;
      console.log("curPage:pageSize----->", curPage, pageSize);
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      const { currentPage: curPage, pageSize } = this.pageInfo;
      console.log("curPage:pageSize----->", curPage, pageSize);
      this.getList();
    }
  },
  computed: {},
  watch: {
    isExpand(newVal, oldVal) {
      this.$nextTick(() => {
        this.tableHeight = newVal ? (this.$refs.dialog.$el.clientHeight - 100) : 300;
      });
      this.pageSize = newVal ? "100%" : 400;
      this.pageInfo.pageSize = newVal ? 20 : 5;
      this.getList();
    }
  }
};
</script>

<style lang="less">

#quality-check2 {
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
