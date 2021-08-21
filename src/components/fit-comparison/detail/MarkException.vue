<template>
  <div id="mark-exception">
    <el-dialog ref="dialog"
               :visible.sync="centerDialogVisible"
               width="100%"
               top="0">
      <div class="root-wrapper">
        <div class="header">
          <div class="left">
            <span class="title">{{ title }}</span>
            <div style="margin-left: 50px">
              <el-checkbox-group @change="handleRootFilterChange" v-model="rootFilter.checkOptions">
                <el-checkbox-button v-for="item in rootFilter.options" :label="item.value" :key="item.key">
                  {{ item.label }}
                </el-checkbox-button>
              </el-checkbox-group>
            </div>
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
            <el-button size="small" @click="handleCancelEdit">取消</el-button>
            <el-button type="primary" @click="handleCommitEdit" size="small" style="margin-right: 20px">确定</el-button>
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
              <template slot-scope="scope">
                <div>
                  <el-select v-if="item.prop==='isMark'" v-model="scope.row.isMark" placeholder="请选择">
                    <el-option
                      v-for="item in markOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input v-else-if="item.prop==='markReason' && scope.row.isMark"
                            v-model="scope.row.markReason"
                            placeholder=""></el-input>
                  <span v-else>
                    {{ scope.row[item.prop] }}
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import markException from "../../../test/markException";
import layExcel from "lay-excel";

export default {
  name: "MarkException",
  mounted() {
    this.originData = markException();
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
      title: "标识例外",
      markOptions: [{
        value: false,
        label: "否"
      }, {
        value: true,
        label: "是"
      }],
      rootFilter: {
        options: [{
          value: "fit",
          label: "套合比对",
          key: "fit"
        }, {
          value: "quality",
          label: "质量检查",
          key: "quality"
        }, {
          value: "result",
          label: "成果检查",
          key: "result"
        }],
        checkOptions: []
      },
      columns: [
        { prop: "index", label: "序号", width: 80, align: "center", filter: false },
        { prop: "batch", label: "批次", width: 170, align: "center", filter: true },
        { prop: "countyCode", label: "区县代码", width: 130, align: "center", filter: true },
        { prop: "countyName", label: "区县名称", width: 150, align: "center", filter: true },
        { prop: "cityCode", label: "地市代码", width: 130, align: "center", filter: true },
        { prop: "cityName", label: "地市名称", width: 150, align: "center", filter: true },
        { prop: "provinceCode", label: "省级代码", width: 130, align: "center", filter: true },
        { prop: "provinceName", label: "省级名称", width: 150, align: "center", filter: true },
        { prop: "jcbh", label: "监测编号", width: 150, align: "center", filter: true },
        { prop: "errorType", label: "错误类型", width: 150, align: "center", filter: true },
        { prop: "errorDesc", label: "错误描述", width: 150, align: "center", filter: true },
        { prop: "isMark", label: "是否例外", width: 100, align: "center", filter: false },
        { prop: "markReason", label: "例外原因", width: 250, align: "center", filter: false }
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
      tableHeight: 300
    };
  },
  methods: {
    showDialog() {
      this.isExpand = false;
      this.centerDialogVisible = true;
    },
    handleRootFilterChange(val) {
      console.log(val);
      console.log(this.rootFilter.checkOptions);
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
    },
    handleCancelEdit() {
      this.$message.success("取消编辑");
    },
    handleCommitEdit() {
      this.$message.success("保存编辑成功");
    }
  },
  computed: {},
  watch: {
    isExpand(newVal, oldVal) {
      this.tableHeight = newVal ? (this.$refs.dialog.$el.clientHeight - 140) : 300;
    }
  }
};
</script>

<style lang="less">

#mark-exception {
  .el-dialog {
    position: absolute;
    bottom: 0;
    margin-bottom: 0;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 5px;
  }

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