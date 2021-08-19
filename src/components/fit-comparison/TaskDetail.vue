<template>
  <div class="root-wrapper">

    <div class="header">
      <div class="location-info">
        <span>当前位置：</span> <i class="go-back" @click="goList">套合比对</i> <span> > 任务详情</span>
      </div>
      <div class="task-info">
        <span>任务名称：2021S105300011</span>
        <span>检测图斑数：2700</span>
        <span>开始时间：2021-05-30 21:00:00</span>
        <span>结束时间：2021-05-30 22:00:00</span>
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
      <el-table :header-cell-style="{backgroundColor:'#f0f0f0'}"
                :data="tableData" :show-header="true"
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="sub-table" style="background-color: gray">
              <el-table
                :data="props.row.children" :show-header="false"
                style="width: 100%">
                <el-table-column
                  label="步骤"
                  prop="stepInfo">
                </el-table-column>
                <el-table-column
                  label="状态"
                  prop="status">
                  <template slot-scope="scope">
                    {{ gainStatus(scope.row.status) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="日志"
                  prop="logInfo">
                </el-table-column>
                <el-table-column
                  label="耗时"
                  prop="consumeTime">
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="步骤"
          prop="stepInfo">
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status">
          <template slot-scope="scope">
            {{ gainStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="进度与日志"
          prop="progress">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.progress"></el-progress>
          </template>
        </el-table-column>
        <el-table-column
          label="耗时"
          prop="consumeTime">
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button
              size="mini" style=""
              @click="handleDetail(scope.$index, scope.row)">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskDetail",
  data() {
    return {
      tableData: [{
        stepInfo: "接受解压",
        status: 1,
        progress: 100,
        consumeTime: "1min"
      }, {
        stepInfo: "质量检查",
        status: 1,
        progress: 100,
        consumeTime: "30min"
      }, {
        stepInfo: "套合对比",
        status: 2,
        progress: 90,
        consumeTime: "100min",
        children: [{
          stepInfo: "与土地利用现状数据套合比对",
          status: 1,
          logInfo: "共300个要素进行套合比对，其中300个要素天河比对通过",
          consumeTime: "10min"
        }, {
          stepInfo: "与土地利用总体规划数据套合比对",
          status: 1,
          logInfo: "共300个要素进行套合比对，其中300个要素天河比对通过",
          consumeTime: "10min"
        }, {
          stepInfo: "与永久基本农田数据套合比对",
          status: 1,
          logInfo: "共300个要素进行套合比对，其中300个要素天河比对通过",
          consumeTime: "10min"
        }, {
          stepInfo: "与国家自然保护区数据套合比对",
          status: 1,
          logInfo: "共300个要素进行套合比对，其中300个要素天河比对通过",
          consumeTime: "10min"
        }, {
          stepInfo: "与批准农转用数据套合比对",
          status: 1,
          logInfo: "共300个要素进行套合比对，其中300个要素天河比对通过",
          consumeTime: "10min"
        }]
      }, {
        stepInfo: "成果检查",
        status: 0,
        progress: 0,
        consumeTime: ""
      }, {
        stepInfo: "成果输出",
        status: 0,
        progress: 0,
        consumeTime: ""
      }, {
        stepInfo: "数据入库",
        status: 0,
        progress: 0,
        consumeTime: ""
      }],
      stepInfos: [
        { name: "接受解压", value: "接受解压" },
        { name: "质量检查", value: "质量检查" },
        { name: "套合对比", value: "套合对比" },
        { name: "成果检查", value: "成果检查" },
        { name: "成果输出", value: "成果输出" },
        { name: "数据入库", value: "数据入库" }
      ]
    };
  },
  methods: {
    handleDetail(index, row) {
      console.log(index, row);
    },
    handleRestart(cmd) {
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
      this.$router.replace("/fit-comparison");
    },
    handleExpand() {
    },
    handleFold() {
    }
  }
};
</script>

<style scoped>
.root-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
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