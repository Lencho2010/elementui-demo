<template>
  <el-container id="export-record-detail">
    <el-main>
      <div class="main-wrapper">
        <div class="label-info">基本信息</div>
        <div class="grid-info">
          <span>名称：</span>
          <span class="left-align">{{ detail.name }}</span>

          <span>责任人：</span>
          <span class="left-align">{{ detail.chargePerson }}</span>

          <span>描述：</span>
          <span class="left-align">{{ detail.desc }}</span>
        </div>
        <div class="label-info">统计信息</div>
        <div class="grid-info">
          <span>统计类型：</span>
          <span class="left-align">{{ gainStatisticType(detail.statisticType) }}</span>

          <span>统计日期：</span>
          <span class="left-align">{{ detail.statisticTime }}</span>

          <span>统计批次：</span>
          <span class="left-align">{{ detail.taskNames }}</span>
        </div>
        <div class="label-info">导出文档</div>
        <div class="doc-info">
          <p>{{ detail.exportDocs }}</p>
        </div>
        <div class="label-info">导出路径</div>
        <div class="doc-info">
          <p>{{ detail.exportPath }}</p>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { gainStatisticType } from "@/api/statisticReport/report";

export default {
  name: "ExportRecordDetail",
  data() {
    return {
      detail: {}
    };
  },
  methods: {
    initData(detail) {
      this.detail = detail;
    },
    gainStatisticType(staType) {
      return gainStatisticType(staType);
    }
  }
};
</script>

<style lang="less" scoped>
#export-record-detail {
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
      grid-template-columns: 100px 1fr;
      grid-row-gap: 15px;
      grid-column-gap: 20px;

      span {
        line-height: 32px;
        text-align: right;
      }

      .left-align {
        text-align: left;
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