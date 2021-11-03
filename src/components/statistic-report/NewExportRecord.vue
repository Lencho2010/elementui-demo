<template>
  <el-container id="new-export-record">
    <el-main>
      <div class="main-wrapper">
        <div class="label-info">基本信息</div>
        <div class="grid-info">
          <span><i class="must-flag">*</i>名称：</span>
          <el-input size="small" v-model="name"></el-input>

          <span><i class="must-flag">*</i>责任人：</span>
          <el-input size="small" v-model="chargePerson"></el-input>

          <span>描述：</span>
          <el-input size="small" v-model="desc"></el-input>
        </div>
        <div class="label-info">统计信息</div>
        <div class="grid-info">
          <span><i class="must-flag">*</i>统计类型：</span>
          <el-select v-model="chooseStatistic" @change="handleStatisticChange" placeholder="请选择">
            <el-option
              v-for="item in statisticOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <span><i class="must-flag">*</i>统计日期：</span>
          <div style="border-radius: 2px; border: 1px solid #dcdfe6; padding: 0 15px">
            <span>{{ dateRangeStr }}</span>
          </div>

          <span><i class="must-flag">*</i>统计批次：</span>
          <div>
            <el-select
              style="width: calc(100% - 100px)"
              size="small"
              v-model="chooseTaskNames"
              multiple
              filterable
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in taskNameArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button
              type="primary"
              size="small"
              @click="handleChooseTaskNames"
              style="float: right">选择批次
            </el-button>
          </div>
        </div>
        <div class="label-info">导出文档</div>
        <div class="doc-info">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkDocsAll" @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedDocs" @change="handleCheckedDocsChange">
            <el-checkbox v-for="item in docOptions"
                         :label="item.code"
                         :key="item.code">{{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </el-main>
    <choose-batch @chooseFinished="handleChooseFinished" ref="choose"></choose-batch>
    <el-footer style="text-align: center">
      <el-button size="small" @click="handleNewAndExport">创建并导出</el-button>
      <el-button size="small" @click="handleNew">创建</el-button>
      <el-button size="small" @click="handleReset">重置</el-button>
    </el-footer>
  </el-container>
</template>

<script>

import { addReport, taskNameList, templateDataList } from "@/api/statisticReport/report";
import ChooseBatch from "@/components/statistic-report/ChooseBatch";

const dayjs = require("dayjs");

export default {
  name: "NewExportRecord",
  components: { ChooseBatch },
  mounted() {
    this.handleStatisticChange("week");
  },
  data() {
    return {
      name: "",
      chargePerson: "admin",
      desc: "",
      statisticOptions: [
        { value: "week", label: "周报" },
        { value: "month", label: "月报" },
        { value: "year", label: "年报" }
      ],
      chooseStatistic: "week",
      fromDate: "",
      toDate: "",
      taskNameArr: [],
      chooseTaskNames: [],
      checkDocsAll: false,
      checkedDocs: [],
      docOptions: [],
      isIndeterminate: false
    };
  },
  methods: {
    newReport(status) {
      addReport({
        name: this.name.trim(),
        chargePerson: this.chargePerson,
        desc: this.desc,
        statisticType: this.chooseStatistic,
        status,
        fromDate: this.fromDate,
        toDate: this.toDate,
        taskNames: this.chooseTaskNames.join(","),
        exportDocs: this.checkedDocs.join(","),
        exportPath: `\\\\共享文件\\统计报告报表\\${this.name}.zip`
      }).then(() => {
        this.$emit("returnList");
      });
    },
    handleNewAndExport() {
      if (!this.handleCheckParams()) {
        this.$message.warning("请填写必选项！");
        return;
      }
      this.newReport(2);
    },
    handleNew() {
      if (!this.handleCheckParams()) {
        this.$message.warning("请填写必选项！");
        return;
      }
      this.newReport(0);
    },
    handleReset() {
      this.name = "";
      this.chargePerson = "admin";
      this.desc = "";
      this.fromDate = "";
      this.toDate = "";
      this.chooseTaskNames = [];
      this.isIndeterminate = false;
      this.checkedDocs = [];
      this.chooseStatistic = "week";
    },
    handleCheckParams() {
      if (!this.name.trim()) return false;
      if (!this.chargePerson) return false;
      if (!this.chooseStatistic) return false;
      if (!this.dateRangeStr) return false;
      if (!this.chooseTaskNames) return false;
      return this.checkedDocs;
    },
    handleStatisticChange(val) {
      /*templateDataList(val).then(({ data }) => {
        this.docOptions = data.map(t => {
          const index = t.name.indexOf("-");
          return index > -1 ? t.name.substring(0, index) : t.name;
        });
      });*/
      templateDataList(val).then(({ data }) => {
        this.docOptions = data.map(t => {
          const index = t.name.indexOf("-");
          return {
            name: index > -1 ? t.name.substring(0, index) : t.name,
            code: t.code
          };
        });
      });
    },
    handleCheckAllChange(val) {
      this.checkedDocs = val ? this.docOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedDocsChange(value) {
      let checkedCount = value.length;
      this.checkDocsAll = checkedCount === this.docOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.docOptions.length;
    },
    handleChooseTaskNames() {
      this.$refs.choose.showDialog(this.chooseStatistic);
    },
    handleChooseFinished({ fromDate, toDate, chooseTaskNames }) {
      this.fromDate = fromDate;
      this.toDate = toDate;
      this.taskNameArr = chooseTaskNames.map(item => ({
        value: item,
        label: item
      }));
      this.chooseTaskNames = chooseTaskNames;
    }
  },
  computed: {
    dateRangeStr() {
      if (this.fromDate && this.toDate)
        return `${this.fromDate} ~ ${this.toDate}`;
      return "";
    }
  }
};
</script>

<style lang="less" scoped>
#new-export-record {
  .main-wrapper {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-row-gap: 30px;
    padding: 10px 50px;

    .label-info {
      font-size: 18px;
      font-weight: bold;
      width: 150px;
      text-align: center;
    }

    .grid-info {
      width: 400px;
      display: grid;
      grid-template-columns: 100px 450px;
      grid-row-gap: 15px;
      grid-column-gap: 20px;

      span {
        line-height: 32px;
        text-align: right;

        .must-flag {
          color: red;
          margin-right: 5px
        }
      }
    }

    .doc-info {
      .el-checkbox-group {
        .el-checkbox {
          margin-bottom: 15px;
        }
      }
    }
  }

}
</style>