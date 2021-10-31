<template>
  <el-container id="export-record-detail">
    <el-main>
      <div class="main-wrapper">
        <div class="label-info">基本信息</div>
        <div class="grid-info">
          <span>名称：</span>
          <span class="left-align">{{ name }}</span>

          <span>责任人：</span>
          <span class="left-align">{{ chargePerson }}</span>

          <span>描述：</span>
          <span class="left-align">{{ desc }}</span>
        </div>
        <div class="label-info">统计信息</div>
        <div class="grid-info">
          <span>统计类型：</span>
          <span class="left-align">{{  chooseStatistic }}</span>

          <span>统计日期：</span>
          <span class="left-align">{{ dateRange }}</span>

          <span>统计批次：</span>
          <span class="left-align">{{ chooseTaskNames }}</span>
        </div>
        <div class="label-info">导出文档</div>
        <div class="doc-info">
          <p>{{ exportDocs }}</p>
        </div>
        <div class="label-info">导出路径</div>
        <div class="doc-info">
          <p>{{ exportPath }}</p>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: "ExportRecordDetail",
  data() {
    return {
      name: "统计报告报表导出-202110271056",
      chargePerson: "admin",
      desc: "这是一条描述信息",
      dateRange: "2021-10-01 ～ 2021-10-07",
      chooseStatistic: "week",
      chooseTaskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
      checkedDocs: ["关于2021年卫片执法下发数据情况的报告", "附1", "附2", "附3"],
      exportDocs:"关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
      exportPath:"\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
    };
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

      .left-align{
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