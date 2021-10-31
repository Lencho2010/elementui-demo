<template>
  <div class="root-wrapper">
    <div class="header">
      <div class="location-info">
        <span>当前位置：</span>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px">
          <el-breadcrumb-item :to="{ name: 'jctb-task' }">套合比对</el-breadcrumb-item>
          <el-breadcrumb-item>任务详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="task-info">
        <span>任务名称：{{ taskInfo.taskName }}</span>
        <span>检测图斑数：{{ taskInfo.tbCount }}</span>
        <span>开始时间：{{ taskInfo.startTime }}</span>
        <span>结束时间：{{ taskInfo.endTime }}</span>
      </div>

      <div style="display: flex; align-items: center; height: 70px;">
        <el-button class="btn-normal" @click="handleExpand">展开节点</el-button>
        <el-button class="btn-normal" @click="handleFold">折叠节点</el-button>
        <!-- <el-button class="btn-normal" @click="">重启</el-button>-->
        <el-dropdown style="margin-left: 10px;"
                     :style="{display:this.taskInfo.status==-1?'block':'none'}"
                     @command="handleRestart">
          <el-button class="btn-normal" @click="">重启</el-button>
          <el-dropdown-menu slot="dropdown">
            <span style="margin: 1px">请选择从哪一步开始执行</span>
            <el-dropdown-item v-for="item of stepInfos" :command="item.value">{{ item.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div ref="wrapper" class="table-wrapper">
      <el-table ref="table" :height="tableHeight"
                v-loading="isLoading"
                :header-cell-style="{backgroundColor:'#f0f0f0',color:'#333',fontWeight:'bold',fontSize:'18px'}"
                :data="tableData" :show-header="true"
                @current-change="handleCurrentChange"
                @expand-change="handleExpandChange"
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="sub-table" style="background-color: gray">
              <el-table
                  :data="props.row.children" :show-header="false"
                  style="width: 100%">
                <el-table-column width="280"
                                 label="步骤"
                                 prop="stepInfo">
                </el-table-column>
                <el-table-column width="120"
                                 label="状态"
                                 prop="status">
                  <template slot-scope="scope">
                    {{ gainStatus(scope.row.status) }}
                  </template>
                </el-table-column>
                <el-table-column width="700"
                                 label="日志"
                                 prop="log">
                </el-table-column>
                <el-table-column
                    label="耗时" align="center"
                    prop="consumeTime">
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="步骤" width="280"
            prop="stepName">
        </el-table-column>
        <el-table-column
            label="状态" width="120"
            prop="status">
          <template slot-scope="scope">
            {{ gainStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column width="700"
                         label="进度与日志"
                         prop="progress">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.progress"></el-progress>
          </template>
        </el-table-column>
        <el-table-column
            label="耗时" align="center"
            prop="consumeTime">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="[1005,1006].indexOf(scope.row.stepCode)<0"
                       size="mini" style=""
                       @click="handleDetail(scope.$index, scope.row)">查看
            </el-button>
            <el-button v-if="scope.row.stepCode===1004"
                       size="mini" style=""
                       @click="handleMarkException(scope.$index, scope.row)">标识例外
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <unzip-detail ref="unzip"></unzip-detail>
    <quality-check ref="quality"></quality-check>
    <fit-detail ref="fit"></fit-detail>
    <result-check ref="check"></result-check>
    <mark-exception ref="mark"></mark-exception>
  </div>
</template>

<script>
let erd = require("element-resize-detector")();
import {findOne} from "@/api/contrast/jctbTask.js";
import {listTaskInfo} from "@/api/contrast/taskInfo.js";
import date2str from "../../util/date2str";
import taskDetail from "../../test/taskDetail";
import UnzipDetail from "./detail/UnzipDetail";
import QualityCheck from "./detail/QualityCheck";
import FitDetail from "./detail/FitDetail";
import ResultCheck from "./detail/ResultCheck";
import MarkException from "./detail/MarkException";

export default {
  name: "TaskDetail",
  props: ["taskName"],
  components: {UnzipDetail, QualityCheck, FitDetail, ResultCheck, MarkException},
  mounted() {
    console.log("taskDetail init...");
    this.$nextTick(() => {
      if (this.$parent) {
        this.$parent.showDetail = true;
      }
    })
    this.isLoading = true;
    this.gainData(this.taskName);
    // this.intervalList();
    this.$nextTick(() => {
      let timer;
      let that = this;
      let lisDom = document.getElementById("app");
      erd.listenTo(lisDom, function (element) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          that.tableHeight = lisDom.clientHeight - 237;
          console.log(that.tableHeight);
        }, 500);
      });
    });
  },
  beforeDestroy() {
    if (this.$parent) {
      this.$parent.showDetail = false;
    }
    clearInterval(this.intervalItem);
  },
  data() {
    return {
      tableData: [],
      stepInfos: [
        {name: "接收解压", value: "接收解压"},
        {name: "质量检查", value: "质量检查"},
        {name: "套合对比", value: "套合对比"},
        {name: "成果检查", value: "成果检查"},
        {name: "成果输出", value: "成果输出"},
        {name: "数据入库", value: "数据入库"}
      ],
      currentRow: null,
      taskInfo: {
        status: 2,
        taskName: "",
        tbCount: 0,
        startTime: "-",
        endTime: "-",
        detailInfo: []
      },
      isLoading: false,
      tableHeight: "100%",
      intervalItem: 0,
      interval: 5000
    };
  },
  methods: {
    async gainData(tName) {
      //this.isLoading = true;
      const {data} = await findOne(tName);
      const {id, taskName, startTime, endTime, tbCount, status} = data;
      Object.assign(this.taskInfo, data);

      let {data: retData} = await listTaskInfo(taskName);
      this.tableData = retData.sort((x, y) => x.stepCode - y.stepCode);
      this.isLoading = false;
    },
    intervalList() {
      let that = this;
      this.intervalItem = setInterval(function () {
        that.gainData(that.taskName);
      }, that.interval);
    },
    handleDetail(index, row) {
      console.log(row);
      const taskName = row.taskName;
      switch (row.stepCode) {
        case 1001:
          this.$refs.unzip.showDialog(taskName);
          break;
        case 1002:
          this.$refs.quality.showDialog(taskName);
          break;
        case 1003:
          this.$refs.fit.showDialog(taskName);
          break;
        case 1004:
          this.$refs.check.showDialog(taskName);
          break;
      }
    },
    handleMarkException(index, row) {
      this.$refs.mark.showDialog(row.taskName);
    },
    handleRestart(cmd) {
      if (!this.currentRow) return;
      console.log("handleRestart....", cmd);
    },
    gainStatus(status) {
      let ret = "";
      switch (status) {
        case 0:
          ret = "待执行";
          break;
        case 1:
          ret = "执行成功";
          break;
        case -1:
          ret = "执行失败";
          break;
        case 2:
          ret = "执行中";
          break;
        case 3:
          ret = "暂停";
          break;
        default:
          ret = "待执行";
          break;
      }
      return ret;
    },
    goList() {
      this.$router.push({name: "contrast-comparison"});
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleExpand() {
      this.tableData.forEach(row => this.$refs.table.toggleRowExpansion(row, true));
      /*if (!this.currentRow) return;
      this.$refs.table.toggleRowExpansion(this.currentRow, true);*/
    },
    handleFold() {
      this.tableData.forEach(row => this.$refs.table.toggleRowExpansion(row, false));
      /*if (!this.currentRow) return;
      this.$refs.table.toggleRowExpansion(this.currentRow, false);*/
    },
    handleExpandChange(row, allRows) {
      if (allRows.length > 0 && allRows[allRows.length - 1] == row) {
        console.log("expand......");
        // row.children.splice(0, row.children.length);

      } else {
        console.log("fold......");
      }
    }
  }
};
</script>

<style scoped>
.root-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  /*padding: 10px;*/
  min-width: 1350px;
}

.location-info {
  display: flex;
  font-size: 16px;
  height: 30px;
  line-height: 30px;
  /*justify-content: center;*/
  align-items: center;
}

.task-info {
  display: flex;
  font-size: 18px;
  height: 30px;
  line-height: 30px;
}

.task-info > span + span {
  margin-left: 100px
}

.btn-normal {
  height: 40px;
  color: #467cd4;
  border: 1px solid #467cd4;
}

.go-back {
  color: #467cd4;
  cursor: pointer;
}

.table-wrapper {
  border: 1px solid #f0f0f0;
  margin-bottom: 5px;
  flex: 1;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>