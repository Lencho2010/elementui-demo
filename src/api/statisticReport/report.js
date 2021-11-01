import request from "@/util/request";
// status: 0-未执行; 1-已完成; 2-执行中; -1-执行失败
const mockData = [
  {
    index: 1,
    id: "12987122",
    name: "统计报告报表导出-202110271056",
    chargePerson: "admin",
    desc: "描述...",
    statisticType: "week",
    status: 1,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 2,
    id: "12987123",
    name: "统计报告报表导出-202110271057",
    chargePerson: "admin1",
    desc: "描述...",
    statisticType: "month",
    status: 2,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 3,
    id: "12987125",
    name: "统计报告报表导出-202110271058",
    chargePerson: "admin2",
    desc: "描述...",
    statisticType: "week",
    status: 0,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 4,
    id: "12987126",
    name: "统计报告报表导出-202110271059",
    chargePerson: "admin3",
    desc: "描述...",
    statisticType: "month",
    status: 1,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 5,
    id: "12987127",
    name: "统计报告报表导出-202110271060",
    chargePerson: "admin4",
    desc: "描述...",
    statisticType: "week",
    status: -1,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 6,
    id: "12987128",
    name: "统计报告报表导出-202110271061",
    chargePerson: "admin1",
    desc: "描述...",
    statisticType: "week",
    status: 1,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 7,
    id: "12987129",
    name: "统计报告报表导出-202110271062",
    chargePerson: "admin2",
    desc: "描述...",
    statisticType: "week",
    status: 2,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 8,
    id: "12987130",
    name: "统计报告报表导出-202110271063",
    chargePerson: "admin",
    desc: "描述...",
    statisticType: "week",
    status: 2,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 9,
    id: "12987131",
    name: "统计报告报表导出-202110271064",
    chargePerson: "admin3",
    desc: "描述...",
    statisticType: "week",
    status: -1,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 10,
    id: "12987132",
    name: "统计报告报表导出-202110271065",
    chargePerson: "admin4",
    desc: "描述...",
    statisticType: "week",
    status: 0,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 11,
    id: "12987133",
    name: "统计报告报表导出-202110271066",
    chargePerson: "admin",
    desc: "描述...",
    statisticType: "week",
    status: 0,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }, {
    index: 12,
    id: "12987134",
    name: "统计报告报表导出-202110271067",
    chargePerson: "admin1",
    desc: "描述...",
    statisticType: "week",
    status: 1,
    statisticTime: "2021-10-01 ～  2021-10-07",
    exportTime: "2021-10-27  08:50:08",
    taskNames: "2021S104300010，2021S104300011，2021S104300012，2021S104300013，2021S104300014，2021S104300015，2021S104300016",
    exportDocs: "关于2021年卫片执法下发数据情况的报告，附1，附2，附3，表1，表2，表3，表4，表5",
    exportPath: "\\\\共享文件\\统计报告报表\\统计报告报表导出-202110271056.zip"
  }
];

export function gainStatus(status) {
  let ret = "";
  switch (status) {
    case 0:
      ret = "未执行";
      break;
    case 1:
      ret = "已完成";
      break;
    case -1:
      ret = "失败";
      break;
    case 2:
      ret = "进行中";
      break;
    default:
      ret = "未执行";
      break;
  }
  return ret;
}

export function gainStatisticType(staType){
  let ret = "";
  switch (staType) {
    case "week":
      ret = "周报";
      break;
    case "month":
      ret = "月报";
      break;
    case "year":
      ret = "年报";
      break;
    default:
      ret = "周报";
      break;
  }
  return ret;
}

export function addReport(report) {
  mockData.unshift(report);
  console.log(mockData.length, "@@@@");
  return new Promise(resolve => {
    resolve({
      code: 200,
      message: "成功",
      data: {
        ...report
      }
    });
  });
}

export function reportList(page, rows, reportName, chargePerson) {
  /*let url = `/report/list/${page}/${rows}`;
  return request.get(url, {
    params: {
      status,
      taskName
    }
  });*/

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: "成功",
        data: {
          total: 247,
          list: mockData
            .filter(
              data =>
                (chargePerson ? data.chargePerson === chargePerson : true) &&
                (reportName ? data.name.indexOf(reportName) !== -1 : true)
            )
            .slice(0, rows)
            .map((data, index) => ({
              ...data, index: (page - 1) * rows + index + 1
            }))
        }
      });
    }, 500);
  });
}

export function chargePersonList() {
  return new Promise(resolve => {
    resolve({
      code: 200,
      message: "成功",
      data: [
        {
          value: "admin",
          label: "admin"
        }, {
          value: "admin1",
          label: "admin1"
        }, {
          value: "admin2",
          label: "admin2"
        }, {
          value: "admin3",
          label: "admin3"
        }, {
          value: "admin4",
          label: "admin4"
        }
      ]
    });
  });
}

export function templateDataList() {
  return new Promise(resolve => {
    resolve({
      code: 200,
      message: "成功",
      data: [
        { index: 1, name: "关于2021年卫片执法下发数据情况的..." },
        { index: 2, name: "附1-2021年卫片图斑下发数据覆盖情况..." },
        { index: 3, name: "附2-2021年接收卫片图斑质检结果及..." },
        { index: 4, name: "附3-大图斑明细统计表" },
        { index: 5, name: "表1-总体统计详表" },
        { index: 6, name: "表2-大图斑100亩以上详表" },
        { index: 7, name: "表3-大图斑50亩以上详表" },
        { index: 8, name: "表4-疑似违法面积100亩以上详表" },
        { index: 9, name: "表5-疑似违法面积50亩以上详表" },
        { index: 10, name: "表6-XXXXXXX" }
      ]
    });
  });
}
