<template>
  <div class="root-wrapper">

    <div class="header">
      <div class="location-info">
        <span>当前位置：</span> <i class="go-back" @click="goList">套合比对</i> <span> > 任务详情</span>
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
        <el-dropdown style="margin-left: 10px" @command="handleRestart">
          <el-button class="btn-normal" @click="">重启</el-button>
          <el-dropdown-menu slot="dropdown">
            <span style="margin: 1px">请选择从哪一步开始执行</span>
            <el-dropdown-item v-for="item of stepInfos" :command="item.value">{{ item.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table ref="table"
                v-loading="isLoading"
                :header-cell-style="{backgroundColor:'#f0f0f0',color:'#333',fontWeight:'bold',fontSize:'18px'}"
                :data="tableData" :show-header="true"
                highlight-current-row
                @current-change="handleCurrentChange"
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
                                 prop="logInfo">
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
          prop="stepInfo">
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
            <el-button
              size="mini" style=""
              @click="handleDetail(scope.$index, scope.row)">查看
            </el-button>
            <el-button v-if="scope.row.stepInfo==='成果检查'"
                       size="mini" style=""
                       @click="handleDetail(scope.$index, scope.row)">标识例外
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import date2str from "../../util/date2str";
import taskDetail from "../../test/taskDetail";

export default {
  name: "TaskDetail",
  props: ["taskName"],
  mounted() {
    if (this.$parent) {
      this.$parent.showDetail = true;
    }
    this.gainData(this.taskName);
  },
  beforeDestroy() {
    if (this.$parent) {
      this.$parent.showDetail = false;
    }
  },
  data() {
    return {
      tableData: [],
      stepInfos: [
        { name: "接受解压", value: "接受解压" },
        { name: "质量检查", value: "质量检查" },
        { name: "套合对比", value: "套合对比" },
        { name: "成果检查", value: "成果检查" },
        { name: "成果输出", value: "成果输出" },
        { name: "数据入库", value: "数据入库" }
      ],
      currentRow: null,
      taskInfo: {
        taskName: "",
        tbCount: 0,
        startTime: "-",
        endTime: "-",
        detailInfo: []
      },
      isLoading: false
    };
  },
  methods: {
    gainData(tName) {
      this.isLoading = true;
      setTimeout(() => {
        this.taskInfo.taskName = tName;
        this.taskInfo.tbCount = Math.floor((Math.random() * 100) + 3000);
        this.taskInfo.startTime = date2str(this.gainTaskStartTime(), "yyyy-MM-dd hh:mm:ss");
        this.taskInfo.endTime = date2str(new Date(), "yyyy-MM-dd hh:mm:ss");

        this.tableData = taskDetail();
        this.isLoading = false;
      }, 2000);
    },
    handleDetail(index, row) {
      console.log(index, row);
    },
    handleRestart(cmd) {
      if (!this.currentRow) return;
      console.log("handleRestart....", cmd);
    },
    gainStatus(status) {
      console.log("status:", status);
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
      this.$router.push({ name: "fit-comparison" });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleExpand() {
      if (!this.currentRow) return;
      this.$refs.table.toggleRowExpansion(this.currentRow, true);
    },
    handleFold() {
      if (!this.currentRow) return;
      this.$refs.table.toggleRowExpansion(this.currentRow, false);
    },
    gainTaskStartTime() {
      const randomNum = Math.floor((Math.random() * 10) + 1);
      const now = new Date;
      now.setHours((now.getHours() - randomNum));
      now.setMinutes((now.getMinutes() - randomNum));
      now.setSeconds((now.getSeconds() - randomNum));
      return now;
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