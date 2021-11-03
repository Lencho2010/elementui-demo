<template>
  <el-container id="statistic-report" style="height: 100%; border: 1px solid #eee;">
    <el-container style="background: #fff">
      <el-header style="font-size: 16px;font-weight: bold; background: #e2e2e2">
        <span style="border-left: 7px solid #02a7f0; height: 25px; padding-left: 10px">{{ title }}</span>
        <i v-show="title !== exportOptions.list" @click="returnList" class="el-icon-close"
           style="float: right; margin-top: 25px; cursor: pointer;"></i>
      </el-header>
      <el-container v-show="title === exportOptions.list">
        <el-header style="font-size: 16px; background: white;height: 100px">
          <div>
            <button class="btn-add-export" @click="handleAddExport">+ 新增导出</button>
            <div style="display: flex; justify-content: space-between">
            <span>
              <el-button size="mini" icon="el-icon-arrow-down" @click="handleExpand">展开所有</el-button>
              <el-button size="mini" icon="el-icon-arrow-right" @click="handleFold">折叠所有</el-button>
            </span>
              <div class="demo-input-suffix">
                名称：
                <el-input
                  style="width: 150px; margin-right: 10px"
                  size="small"
                  placeholder="请输入"
                  v-model="taskNameInput">
                </el-input>
                责任人：
                <el-select v-model="chargePerson" clearable placeholder="请选择" size="small">
                  <el-option
                    v-for="item in chargePersons"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div>
                <el-button size="mini" @click="handleQuery" type="primary">查询</el-button>
                <el-button size="mini" @click="handleReset">重置</el-button>
              </div>
            </div>
          </div>
        </el-header>
        <el-main ref="main-container">
          <el-table ref="table"
                    v-loading="isLoading"
                    :data="tableData"
                    :height="tableHeight"
                    :header-cell-style="{
            'font-size':'17px',
            'font-weight':'bold',
            'background-color':'#f2f2f2',
            'color':'#000000'
          }"
                    style="width: 100%;">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="统计时间：">
                    <span>{{ props.row.statisticTime }}</span>
                  </el-form-item>
                  <el-form-item label="统计批次：">
                    <span>{{ props.row.taskNames }}</span>
                  </el-form-item>
                  <el-form-item label="导出文档：">
                    <span>{{ props.row.exportDocs }}</span>
                  </el-form-item>
                  <el-form-item label="导出路径：">
                    <span>{{ props.row.exportPath }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              width="80px"
              label="序号"
              prop="index">
            </el-table-column>
            <el-table-column
              label="名称" min-width="150"
              prop="name">
            </el-table-column>
            <el-table-column
              label="责任人"
              prop="chargePerson">
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template slot-scope="scope">
                <div style="display: flex; align-items: center; align-content: center">
                  <div style="width: 6px; height: 6px; border-radius: 3px; margin-right: 5px"
                       :style="{background: gainStatusColor(scope.row.status)}"
                  ></div>
                  <span>{{ gainStatus(scope.row.status) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="导出时间"
              prop="exportTime">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleExport(scope.$index, scope.row)">导出
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDetail(scope.$index, scope.row)">详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination style="text-align: center"
                         background
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="pageInfo.currentPage"
                         :page-sizes="pageInfo.pageSizes"
                         :page-size="pageInfo.pageSize"
                         layout="total,  prev, pager, next, sizes, jumper"
                         :total="pageInfo.totalCount">
          </el-pagination>
        </el-footer>
      </el-container>
      <el-container v-if="title === exportOptions.add">
        <new-export-record @returnList="returnList"></new-export-record>
      </el-container>
      <el-container v-show="title === exportOptions.detail">
        <export-record-detail ref="detail" @returnList="returnList"></export-record-detail>
      </el-container>
    </el-container>
    <el-aside width="300px" style="background-color: #ffffff;margin-left: 15px">
      <el-header style="font-size: 16px;font-weight: bold; background: #e2e2e2">
        <span style="border-left: 7px solid #02a7f0; height: 25px; padding-left: 10px">模板</span>
      </el-header>
      <ul style="padding: 5px; margin-top: 10px">
        <li style="font-size: 14px; height: 36px; display: flex; align-items: center"
            v-for="item in templateData" :key="item.index">
          <div
            style="color: #ffffff; line-height: 22px;width: 22px; height: 22px; background: #3e8fff; border-radius: 50%;margin-right: 5px; vertical-align: center; text-align: center;">
            {{ item.index }}
          </div>
          <span>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </el-aside>
  </el-container>
</template>

<script>
import NewExportRecord from "@/components/statistic-report/NewExportRecord";
import ExportRecordDetail from "@/components/statistic-report/ExportRecordDetail";
import {
  gainStatus,
  reportList,
  chargePersonList,
  templateDataList,
  transferTemplate,
  processExportTask
} from "@/api/statisticReport/report.js";

let erd = require("element-resize-detector")();

export default {
  name: "StatisticReport",
  components: { NewExportRecord, ExportRecordDetail },
  mounted() {
    this.isLoading = true;
    this.title = this.exportOptions.list;
    chargePersonList().then(({ data }) => {
      this.chargePersons = data.map(item => ({ value: item, label: item }));
    });
    templateDataList("week").then(({ data }) => {
      this.templateData = data.map((item, i) => ({
        index: i + 1,
        name: item.name
      }));
    });
    this.getList();
    this.$nextTick(() => {
      let timer;
      erd.listenTo(this.$refs["main-container"].$el, ele => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.tableHeight = ele.clientHeight - 50;
        }, 500);
      });
    });
  },
  data() {
    return {
      isLoading: false,
      tableData: [],
      templateData: [],
      tableHeight: 500,
      taskNameInput: "",
      pageInfo: {
        currentPage: 1,
        totalCount: 268,
        pageSizes: [5, 10, 13],
        pageSize: 10
      },
      chargePersons: [],
      chargePerson: "",
      title: "",
      exportOptions: {
        list: "导出记录",
        add: "新增导出",
        detail: "详情"
      }
    };
  },
  methods: {
    handleExport(index, row) {
      processExportTask(row).then(({ data }) => {
        this.handleQuery();
      });
    },
    handleDetail(index, row) {
      console.log(index, row);
      this.$refs.detail.initData(row);
      this.title = this.exportOptions.detail;
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getList();
    },
    handleExpand() {
      this.tableData.forEach(row => this.$refs.table.toggleRowExpansion(row, true));
    },
    handleFold() {
      this.tableData.forEach(row => this.$refs.table.toggleRowExpansion(row, false));
    },
    handleQuery() {
      this.getList();
    },
    handleReset() {
      this.taskNameInput = "";
      this.chargePerson = "";
      this.pageInfo.currentPage = 1;
      this.pageInfo.pageSize = 10;
      this.getList();
    },
    handleAddExport() {
      this.title = this.exportOptions.add;
    },
    returnList() {
      this.title = this.exportOptions.list;
      this.getList();
    },
    getList() {
      const page = this.pageInfo.currentPage;
      const rows = this.pageInfo.pageSize;
      const reportName = this.taskNameInput;
      const chargePerson = this.chargePerson;
      reportList(page, rows, reportName, chargePerson).then(({ data }) => {
        const { list, total } = data;
        this.pageInfo.totalCount = total;
        this.tableData = list.map((item, index) => ({
          ...item,
          index: (page - 1) * rows + index + 1,
          statisticTime: `${item.fromDate} ～ ${item.toDate} `,
          exportTime: item.exportTime ? item.exportTime : "-",
          exportDocs: transferTemplate(item.exportDocs)
        }));

        this.isLoading = false;
      }).catch(err => {
        this.isLoading = false;
        this.$message.error(err);
      });
    },
    gainStatus(status) {
      return gainStatus(status);
    },
    gainStatusColor(status) {
      let ret = "";
      switch (status) {
        case 0:
          ret = "#bfbfbf";
          break;
        case 1:
          ret = "#0bac5b";
          break;
        case -1:
          ret = "red";
          break;
        case 2:
          ret = "#0e77d1";
          break;
        default:
          ret = "#bfbfbf";
          break;
      }
      return ret;
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property !== "status") return;
      let ret = "";
      switch (row.status) {
        case 0:
          ret = "color:#999";
          break;
        case 1:
          ret = "color:#5dc88d";
          break;
        case -1:
          ret = "color:#fe6464";
          break;
        case 2:
          ret = "color:#00b4ff";
          break;
        case 3:
          ret = "color:#000";
          break;
        default:
          ret = "";
          break;
      }
      return ret;
    }
  }
};
</script>

<style lang="less">
#statistic-report {
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .btn-add-export {
    width: 100%;
    margin-top: 5px;
    text-align: center;
    border: 2px #3e8fff dashed;
    border-radius: 10px;
    height: 40px;
    line-height: 40px;
    color: #3e8fff;
  }

  .btn-add-export :hover {
    background: #0e5ec2 !important;
  }

  .el-aside {
    color: #333;
  }

  .demo-table-expand {
    font-size: 0;
    background: #e2e2e2;
    padding: 0 10px;
    border-radius: 10px;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
}
</style>