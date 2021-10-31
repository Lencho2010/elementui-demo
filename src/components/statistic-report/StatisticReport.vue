<template>
  <el-container id="statistic-report" style="height: 100%; border: 1px solid #eee;">
    <el-container style="background: #fff">
      <el-header style="font-size: 16px;font-weight: bold; background: #e2e2e2">
        <span style="border-left: 7px solid #02a7f0; height: 25px; padding-left: 10px">{{ title }}</span>
        <i v-show="title !== exportOptions.list" @click="returnList" class="el-icon-close" style="float: right; margin-top: 25px; cursor: pointer;"></i>
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
                  <div style="background: red; width: 6px; height: 6px; border-radius: 3px; margin-right: 5px"></div>
                  <span>{{ scope.row.status }}</span>
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
      <el-container v-show="title === exportOptions.add">
        <new-export-record @returnList="returnList"></new-export-record>
      </el-container>
      <el-container v-show="title === exportOptions.detail">
        <export-record-detail @returnList="returnList"></export-record-detail>
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

let erd = require("element-resize-detector")();

export default {
  name: "StatisticReport",
  components: { NewExportRecord, ExportRecordDetail },
  mounted() {
    this.title = this.exportOptions.list;
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
      tableData: [
        {
          index: 1,
          id: "12987122",
          name: "统计报告报表导出-202110271056",
          chargePerson: "admin",
          status: "已完成",
          statisticTime: "2021-10-01 ～  2021-10-07",
          exportTime: "2021-10-27  08:50:08",
          taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
          exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
          exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
        }, {
          index: 2,
          id: "12987123",
          name: "统计报告报表导出-202110271057",
          chargePerson: "admin",
          status: "进行中",
          statisticTime: "2021-10-01 ～  2021-10-07",
          exportTime: "2021-10-27  08:50:08",
          taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
          exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
          exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
        }, {
          index: 3,
          id: "12987125",
          name: "统计报告报表导出-202110271058",
          chargePerson: "admin",
          status: "未执行",
          statisticTime: "2021-10-01 ～  2021-10-07",
          exportTime: "2021-10-27  08:50:08",
          taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
          exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
          exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
        }, {
          index: 4,
          id: "12987126",
          name: "统计报告报表导出-202110271059",
          chargePerson: "admin",
          status: "已完成",
          statisticTime: "2021-10-01 ～  2021-10-07",
          exportTime: "2021-10-27  08:50:08",
          taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
          exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
          exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
        }],
      templateData: [
        { index: 1, name: "关于2021年卫片执法下发数据情况的..." },
        { index: 2, name: "附1-2021年卫片图斑下发数据覆盖情况..." },
        { index: 3, name: "附2-2021年接收卫片图斑质检结果及..." },
        { index: 4, name: "附3-大图斑明细统计表" },
        { index: 5, name: "表1-总体统计详表" },
        { index: 6, name: "表2-大图斑100亩以上详表" },
        { index: 7, name: "表3-大图斑50亩以上详表" },
        { index: 8, name: "表4-疑似违法面积100亩以上详表" },
        { index: 9, name: "表5-疑似违法面积50亩以上详表" },
        { index: 10, name: "表6-XXXXXXX" }
      ],
      tableHeight: 500,
      taskNameInput: "",
      pageInfo: {
        currentPage: 1,
        totalCount: 268,
        pageSizes: [5, 10, 13],
        pageSize: 10
      },
      chargePersons: [
        {
          value: "选项1",
          label: "admin"
        }, {
          value: "选项2",
          label: "admin1"
        }, {
          value: "选项3",
          label: "admin2"
        }, {
          value: "选项4",
          label: "admin3"
        }, {
          value: "选项5",
          label: "admin4"
        }],
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
      console.log(index, row);
    },
    handleDetail(index, row) {
      console.log(index, row);
      this.title = this.exportOptions.detail;
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      const { currentPage: curPage, pageSize } = this.pageInfo;
      console.log("curPage:pageSize----->", curPage, pageSize);
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      const { currentPage: curPage, pageSize } = this.pageInfo;
      console.log("curPage:pageSize----->", curPage, pageSize);
    },
    handleExpand() {
      this.tableData.forEach(row => this.$refs.table.toggleRowExpansion(row, true));
    },
    handleFold() {
      this.tableData.forEach(row => this.$refs.table.toggleRowExpansion(row, false));
    },
    handleQuery() {

    },
    handleReset() {
      this.taskNameInput = "";
      this.chargePerson = "";
    },
    handleAddExport() {
      this.title = this.exportOptions.add;
    },
    returnList() {
      this.title = this.exportOptions.list;
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