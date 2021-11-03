<template>
  <div id="choose-batch">
    <el-dialog
      title="批次选择"
      :visible.sync="centerDialogVisible"
      custom-class="my-dialog"
      width="1100px">
      <el-divider style="margin: 0"></el-divider>
      <div
        style="display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;">
        <span>
          <span>统计日期：</span>
          <el-date-picker
            size="small"
            v-model="dateRange"
            @change="handleDateChange"
            type="daterange"
            align="left"
            :clearable="false"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
        </el-date-picker>
        </span>

        <span>
          <span>批次号：</span>
          <el-input size="small" style="width: 200px; margin-right: 10px" v-model="searchInput"></el-input>
          <span>状态：</span>
          <el-select
            size="small"
            v-model="chooseStatusArr"
            multiple
            clearable
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>

        <span>
          <el-button size="small" type="primary" @click="handleQuery">查询</el-button>
          <el-button size="small" @click="handleReset">重置</el-button>
        </span>
      </div>
      <el-divider class="my-divider"></el-divider>
      <el-table
        ref="table"
        :data="tableData"
        :height="500"
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{
            'font-size':'16px',
            'font-weight':'bold',
            'background-color':'#f2f2f2',
            'color':'#000000'
          }">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="批次名称"
          width="150">
          <template slot-scope="scope">{{ scope.row.taskName }}</template>
        </el-table-column>
        <el-table-column
          prop="code"
          label="编号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="pushTime"
          sortable
          label="推送时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="receiveTime"
          sortable
          label="接收时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="finishTime"
          sortable
          label="完成时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="tbCount"
          label="图斑数量"
          width="100">
        </el-table-column>
        <el-table-column
          label="状态"
          width="120">
          <template slot-scope="scope">
            <div style="display: flex; align-items: center; align-content: center">
              <div style="width: 6px; height: 6px; border-radius: 3px; margin-right: 5px"
                   :style="{background: gainStatusColor(scope.row.status)}"
              ></div>
              <span>{{ gainStatus(scope.row.status) }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--<div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>-->
      <div class="my-tip">
        <i style="color: #108ee9; margin-right: 10px" class="el-icon-info"></i>
        <span>共{{ this.tableData.length }}项，已选择</span>
        <span style="color: #00b6ff"> {{ this.multipleSelection.length }}</span>
        <span>项</span>
        <span style="margin-left: 20px">图斑总量：</span>
        <span style="font-weight: bold">{{ tipInfo }}</span>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { gainJctbTask, gainJctbTask2 } from "@/api/statisticReport/report";

const dayjs = require("dayjs");

export default {
  name: "ChooseBatch",
  data() {
    return {
      centerDialogVisible: false,
      tableData: [],
      multipleSelection: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dateRange: "",
      originDateRange: [],
      statusOptions: [
        {
          value: -1,
          label: "失败"
        }, {
          value: 1,
          label: "正常"
        }, {
          value: 0,
          label: "未完成"
        }, {
          value: 2,
          label: "未完成"
        }, {
          value: 3,
          label: "带异常图斑"
        }, {
          value: 4,
          label: "带例外图斑"
        }
      ],
      chooseStatusArr: [],
      searchInput: ""
    };
  },
  methods: {
    showDialog(type) {
      const end = new Date();
      const start = new Date();
      switch (type) {
        case "week":
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          break;
        case "month":
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          break;
        case "year":
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
          break;
      }
      this.dateRange = [start, end];
      this.originDateRange = [...this.dateRange];
      this.centerDialogVisible = true;
      this.handleReset();
    },
    handleConfirm() {
      this.centerDialogVisible = false;
      this.$emit("chooseFinished",
        {
          fromDate: dayjs(this.dateRange[0]).format("YYYY-MM-DD"),
          toDate: dayjs(this.dateRange[1]).format("YYYY-MM-DD"),
          chooseTaskNames: this.multipleSelection.reduce((prev, cur) => {
            prev.push(cur.taskName);
            return prev;
          }, [])
        });
    },
    handleDateChange(date) {

    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    gainStatus(status) {
      return this.statusOptions.find(t => t.value === status).label;
    },
    gainStatusColor(status) {
      let ret = "";
      switch (status) {
        case 0:
          ret = "#0f78d1";
          break;
        case 1:
          ret = "#00a854";
          break;
        case -1:
          ret = "red";
          break;
        case 2:
          ret = "#0f78d1";
          break;
        case 3:
          ret = "#f04134";
          break;
        case 4:
          ret = "#ffbf00";
          break;
        default:
          ret = "pink";
          break;
      }
      return ret;
    },
    handleQuery() {
      this.getList();
    },
    handleReset() {
      this.dateRange = [...this.originDateRange];
      this.searchInput = "";
      this.chooseStatusArr = [];
      this.getList();
    },
    getList() {
      gainJctbTask({
        fromDate: this.dateRange[0],
        toDate: this.dateRange[1],
        taskName: this.searchInput.trim(),
        statusArr: this.chooseStatusArr
      }).then(({ data }) => {
        this.tableData = data.map(item => ({
          code: item.taskName,
          taskName: item.taskName,
          pushTime: item.startTime,
          receiveTime: item.endTime,
          finishTime: item.endTime,
          tbCount: item.tbCount,
          status: item.status
        }));

        console.log(this.tableData, "@@@");
      });
      /*gainJctbTask2({
        fromDate: this.dateRange[0],
        toDate: this.dateRange[1],
        taskName: this.searchInput.trim(),
        statusArr: this.chooseStatusArr
      }).then(({ data }) => {
        this.tableData = data.map(item => ({
          ...item,
        }));

        console.log(this.tableData, "@@@");
      });*/
    }
  },
  computed: {
    tipInfo() {
      let totalTbCount = this.multipleSelection.reduce((pre, cur) => pre + cur.tbCount, 0);
      return `${totalTbCount}个`;
    }
  }
};
</script>

<style lang="less">
#choose-batch {
  .my-tip {
    height: 40px;
    line-height: 40px;
    background: #e6f7ff;
    border-radius: 5px;
    border: 1px solid #abe0ff;
    padding: 0 10px;
  }

  .my-dialog {
    border-radius: 10px;
  }

  .el-range-editor {
    width: 260px;
  }

  .el_dialog__header {
    border-radius: 10px 10px 10px 10px;
  }

  .el-dialog__body {
    padding: 0 20px;
  }

  .el-divider {
    margin: 0;
    background: #c5c5c5;
  }

  .my-divider {
    background: #e8e8e8;
  }
}
</style>