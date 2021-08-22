<template>
  <div class="container">
    <div id="fit-comparison" v-if="!showDetail">
      <div class="header">
        <div class="left">
          <el-radio-group @change="statusChange" v-model="menus.selectStatus">
            <el-radio-button v-for="item in menus.statusList" :key="item.value"
                             :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
          <div class="search-wrap fl" style="margin-left: 50px">
            <el-input
              class="search-input radius"
              v-model="searchText"
              placeholder="请输入"
              @keyup.enter.native="getList"></el-input>
            <i @click="getList"></i>
          </div>

          <el-switch style="margin-left: 20px"
                     v-model="autoRefresh"
                     inactive-text="自动"
          >
          </el-switch>
        </div>

        <div class="right" style="display: flex;">
          <div style="width: 250px; margin-right: 10px;">
            <el-input placeholder="请输入任务包地址" v-model="searchText" class="input-with-select search-input"></el-input>
          </div>
          <el-button class="btn-normal">手动创建</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :cell-style="cellStyle"
                  :data="tableData"
                  v-loading="isLoading"
                  :highlight-current-row="true"
                  :header-cell-style="{backgroundColor:'#f0f0f0',color:'#333',fontWeight:'bold',fontSize:'18px'}"
                  style="width: 100%">
          <el-table-column
            label="序号" width="80"
            prop="index">
          </el-table-column>
          <el-table-column
            label="任务名称"
            prop="taskName">
            <template slot-scope="scope">
              <span class="task-name">{{ scope.row.taskName }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100"
                           label="状态"
                           prop="status">
            <template slot-scope="scope">
              {{ gainStatus(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column align="center"
                           label="进度"
                           prop="num">
            <template slot-scope="scope">
              <el-progress :percentage="scope.row.num"></el-progress>
            </template>
          </el-table-column>
          <el-table-column
            label="开始时间"
            prop="startTime">
          </el-table-column>
          <el-table-column
            label="结束时间" el-progress
            prop="endTime">
          </el-table-column>
          <el-table-column
            label="创建者" width="100"
            prop="creator">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button :class="[{'hidden-column':scope.row.status===0}]"
                         size="mini"
                         @click="handleDetail(scope.$index, scope.row)">详情
              </el-button>
              <el-button :class="[{'hidden-column':scope.row.status===1}]"
                         size="mini"
                         @click="handleEdit(scope.$index, scope.row)">{{ gainButtonText(scope.row.status) }}
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <p>
          <span>服务程序：</span>
          <el-button class="btn-normal" @click="handlePause">暂停</el-button>
          <el-button class="btn-normal" @click="handleConfig">设置</el-button>
        </p>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.currentPage"
          :page-sizes="pageInfo.pageSizes"
          :page-size="pageInfo.pageSize"
          layout="total,  prev, pager, next, sizes, jumper"
          :total="pageInfo.totalCount">
        </el-pagination>
      </div>
      <config-service ref="conf"></config-service>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import ConfigService from "./ConfigService";
import date2str from "../../util/date2str";

export default {
  name: "FitComparison",
  components: { ConfigService },
  mounted() {
    // this.statusChange(this.menus.selectStatus);
    // this.createTaskInfos();
    this.showDetail = false;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2500);
    this.intervalList();
  },
  beforeDestroy() {
    this.cancel();
  },
  data() {
    return {
      tableData: [],
      originData: [],
      searchText: "",
      menus: {
        selectStatus: "all",
        statusList: [
          { value: "all", list: [-1, 0, 1, 2, 3], label: "全部任务" },
          { value: "0", list: [0], label: "待执行" },
          { value: "2", list: [2], label: "执行中" },
          { value: "1", list: [1], label: "执行成功" },
          { value: "-1", list: [-1], label: "执行失败" }
        ]
      },
      pageInfo: {
        currentPage: 1,
        totalCount: 0,
        pageSizes: [5, 10, 13],
        pageSize: 10
      },
      intervalItem: 0,
      interval: 3000,
      autoRefresh: true,
      showDetail: false,
      isLoading: false
    };
  },
  methods: {
    handleDetail(index, row) {
      // this.showDetail = true;
      // this.$router.push({ name: "task-detail" }); //"/fit-comparison/task-detail"
      this.$router.push({ path: `/fit-comparison/task-detail/${row.taskName}` }); //"/fit-comparison/task-detail"
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm(`确定要删除${row.taskName}这个任务吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deleteTask(row);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    deleteTask({ taskName }) {
      const index = this.originData.findIndex(item => item.taskName === taskName);
      this.originData.splice(index, 1);
      this.getList();
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
    },
    gainButtonText(status) {
      let ret = "";
      switch (status) {
        case 3:
          ret = "启动";
          break;
        case -1:
          ret = "重启";
          break;
        case 2:
          ret = "暂停";
          break;
        default:
          ret = "启动";
          break;
      }
      return ret;
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      const { currentPage: curPage, pageSize } = this.pageInfo;
      console.log("curPage:pageSize----->", curPage, pageSize);
      this.createTaskInfos();
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      const { currentPage: curPage, pageSize } = this.pageInfo;
      console.log("curPage:pageSize----->", curPage, pageSize);
      this.createTaskInfos();
    },
    handleConfig() {
      this.$refs.conf.showDialog();
    },
    handlePause() {

    },
    isEmpty(obj) {
      return typeof obj == "undefined" || obj == null || obj === "";
    },
    statusChange(value) {
      const { list } = this.menus.statusList.find(item => item.value === value);
      this.tableData = this.originData.filter(item => {
        const keyword = this.searchText.trim();
        if (keyword === "")
          return list.indexOf(item.status) > -1;
        else
          return list.indexOf(item.status) > -1 && item.taskName.search(keyword) > -1;
      });
    },
    getList() {
      this.statusChange(this.menus.selectStatus);
    },
    handleRandomProgress() {
      return Math.floor((Math.random() * 100));
    },
    handleRandomStatus() {
      return Math.floor((Math.random() * 4) - 1);
    },
    gainTaskStartTime() {
      const randomNum = Math.floor((Math.random() * 10) + 1);
      const now = new Date;
      now.setHours((now.getHours() - randomNum));
      now.setMinutes((now.getMinutes() - randomNum));
      now.setSeconds((now.getSeconds() - randomNum));
      return now;
    },
    createTaskInfo(index) {
      let status = this.handleRandomStatus();

      let num = 0;
      if (status === 0) num = 0;
      else if (status === 1) num = 100;
      else num = this.handleRandomProgress();

      let startTime = "-", endTime = "-";
      if ([1, -1].indexOf(status) > -1) {
        startTime = date2str(this.gainTaskStartTime(), "yyyy-MM-dd hh:mm:ss");
        endTime = date2str(new Date(), "yyyy-MM-dd hh:mm:ss");
      } else if ([2, 3].indexOf(status) > -1) {
        startTime = date2str(this.gainTaskStartTime(), "yyyy-MM-dd hh:mm:ss");
      }

      return {
        index,
        taskName: "2021S10530001" + index,
        status,//0-待执行；1-执行成功；-1-执行失败；2-暂停
        startTime,
        endTime,
        creator: "admin",
        num
      };
    },
    async createTaskInfos() {
      const startIndex = (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1;
      const count = this.pageInfo.pageSize;

      /*const dataList = [];
      for (let i = startIndex; i < startIndex + count; i++) {
        const task = this.createTaskInfo(i);
        dataList.push(task);
      }
      this.pageInfo.totalCount = 360;
      this.originData = dataList;
      this.getList();*/

      const countUrl = window.g.url_checkResultTotalCount;
      const { data: resCount } = await this.$http.get(countUrl);
      const { data: totalCount } = resCount;
      this.pageInfo.totalCount = totalCount;
      const listUrl = window.g.url_checkResultTotalList;
      const { data: result } = await this.$http.get(`${listUrl}/${startIndex}/${count}`);
      const { code, message, data } = result;
      if (code >= 200 && code < 300) {
        this.originData = data;
        this.getList();
      } else {
        this.$message.error(message);
      }
    },
    intervalList() {
      let that = this;
      this.intervalItem = setInterval(function() {
        // that.getList();
        if (that.autoRefresh)
          that.createTaskInfos();
      }, that.interval);
    },
    cancel() {
      clearInterval(this.intervalItem);
    }
  }
};
</script>

<style scoped>
.container {
  /*height: 100%;*/
  flex: 1;
  min-width: 1360px;
  padding: 0 10px;
}

#fit-comparison {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0
}

.footer {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0
}

.table-wrapper {
  border: 1px solid #f0f0f0;
  flex: 1;
}

.hidden-column {
  opacity: 0;
}

.red {
  color: red;
}

.task-name {
  color: #00b6ff;
  border-bottom: 1px solid #00b6ff;
}

.btn-normal {
  color: #409eff;
  border: #409eff 1px solid
}

</style>