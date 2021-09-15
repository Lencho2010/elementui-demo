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
                  :data="originData"
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
                           prop="progress">
            <template slot-scope="scope">
              <el-progress :percentage="scope.row.progress"></el-progress>
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
              <!--<el-button :class="[{'hidden-column':scope.row.status===1}]"
                         size="mini"
                         @click="handleEdit(scope.$index, scope.row)">{{ gainButtonText(scope.row.status) }}
              </el-button>-->
              <el-popover
                placement="top"
                width="170"
                v-model="scope.row.visible">
                <p>确定要执行此操作吗？</p>
                <p></p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">确定</el-button>
                </div>
                <el-button :class="[{'hidden-column':scope.row.status===1}]" size="mini" slot="reference">
                  {{ gainButtonText(scope.row.status) }}
                </el-button>
              </el-popover>
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
          <el-button class="btn-normal" :loading="isConfigLoading" @click="handlePause">{{ isPause ? "启动" : "暂停" }}
          </el-button>
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
import { taskList, del, updateStatus } from "@/api/contrast/jctbTask";
import { gainServiceStatus, updateServiceStatus } from "@/api/contrast/sysPara.js";

export default {
  name: "JctbTask",
  components: { ConfigService },
  mounted() {
    this.showDetail = false;
    this.isLoading = true;
    this.getList();
    this.intervalList();
    this.init();
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
      isPause: true,
      autoRefresh: false,
      showDetail: false,
      isLoading: false,
      isConfigLoading: false,
      visible: false
    };
  },
  methods: {
    init() {
      gainServiceStatus().then(({ data }) => {
        this.isPause = data === "0";
      });
    },
    handleDetail(index, row) {
      // this.showDetail = true;
      // this.$router.push({ name: "task-detail" }); //"/contrast-comparison/task-detail"
      this.$router.push({ path: `/jctb-task/task-detail/${row.taskName}` }); //"/contrast-comparison/task-detail"
    },
    gainTargetStatus(status) {
      switch (status) {
        case -1:
        case 3:
        case 0:
          return 2;
        case 2:
          return 3;
      }
    },
    handleEdit(index, row) {
      row.visible = false;
      const { taskName, status } = row;
      const targetStatus = this.gainTargetStatus(status);
      updateStatus(taskName, targetStatus).then(({ data }) => {
        row.status = targetStatus;
        if (data) this.$message.success("操作成功");
      });
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm(`确定要删除${row.taskName}这个任务吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        del(row.taskName).then(({ data }) => {
          if (data) this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }).catch(err => {
          this.$message.error(err);
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
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
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      const { currentPage: curPage, pageSize } = this.pageInfo;
      console.log("curPage:pageSize----->", curPage, pageSize);
      this.getList();
    },
    handleConfig() {
      this.$refs.conf.showDialog();
    },
    handlePause() {
      this.isConfigLoading = true;
      this.isPause = !this.isPause;
      updateServiceStatus(this.isPause ? 0 : 1).then(({ data }) => {
        this.isConfigLoading = false;
        if (data) {
          this.$message.success(`服务已${this.isPause ? "暂停" : "启动"}`);
        }
      }).catch(err => {
        this.isConfigLoading = false;
        this.isPause = !this.isPause;
        this.$message.error(`服务${!this.isPause ? "暂停" : "启动"}失败`);
      });
    },
    statusChange(value) {
      this.getList();
    },
    getList() {
      const page = this.pageInfo.currentPage;
      const rows = this.pageInfo.pageSize;
      const taskName = this.searchText;
      const { list: status } = this.menus.statusList.find(item => item.value === this.menus.selectStatus);

      taskList(page, rows, taskName, status.join(",")).then(({ data }) => {
        const { list, total } = data;
        this.pageInfo.totalCount = total;
        this.originData = list;
        this.isLoading = false;
      }).catch(err => {
        this.isLoading = false;
        this.$message.error(err);
      });
    },
    intervalList() {
      let that = this;
      this.intervalItem = setInterval(function() {
        if (that.autoRefresh)
          that.getList();
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