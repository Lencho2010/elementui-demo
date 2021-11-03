import request from "@/util/request";

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

let statisticTypeObj = {};
request.get("/reportType/list").then(({ data }) => {
  data.forEach(item => {
    statisticTypeObj[item.type] = item.name;
  });
});

export function gainStatisticType(staType) {
  return statisticTypeObj[staType];
}

export function addReport(report) {
  let url = "/reportTask";
  return request.post(url, report);
}

export function reportList(page, rows, name, chargePerson) {
  let url = `/reportTask/list/${page}/${rows}`;
  return request.get(url, {
    params: {
      name,
      chargePerson
    }
  });
}

export function chargePersonList() {
  let url = "/reportTask/listChargePerson";
  return request.get(url);
}

export function templateDataList(type) {
  let url = `/reportTemplate/list`;
  if (type)
    url += `/${type}`;
  return request.get(url);
}

let templateList = [];
templateDataList().then(({ data }) => {
  data.forEach(item => {
    templateList.push(item);
  });
});

export function transferTemplate(templateStr) {
  const templates = templateStr.split(",").sort();
  const retArr = templates.map(t => {
    const findItem = templateList.find(m => m.code === t);
    return findItem ? findItem.name : t;
  });
  return retArr.join(",");
}

export function taskNameList(dateRange) {
  return new Promise(resolve => {
    resolve({
      code: 200,
      message: "成功",
      data: [
        "2021S104300011", "2021S104300012", "2021S104300013", "2021S104300014", "2021S104300015", "2021S104300016"
      ]
    });
  });
}

export function gainJctbTask2({ fromDate, toDate, taskName, statusArr }) {
  return new Promise(resolve => {
    const tableData = [
      {
        taskName: "2021S104300019",
        code: "2021S104300019",
        pushTime: "2021-10-27 08:50:08",
        receiveTime: "2021-10-27 08:50:08",
        finishTime: "-",
        tbCount: 150,
        status: 0
      }, {
        taskName: "2021S104300018",
        code: "2021S104300018",
        pushTime: "2021-10-27 08:50:08",
        receiveTime: "2021-10-27 08:50:08",
        finishTime: "2021-10-27 08:50:08",
        tbCount: 150,
        status: 1
      }, {
        taskName: "2021S104300017",
        code: "2021S104300017",
        pushTime: "2021-10-27 08:50:08",
        receiveTime: "2021-10-27 08:50:08",
        finishTime: "2021-10-27 08:50:08",
        tbCount: 150,
        status: 3
      }, {
        taskName: "2021S104300016",
        code: "2021S104300016",
        pushTime: "2021-10-27 08:50:08",
        receiveTime: "2021-10-27 08:50:08",
        finishTime: "2021-10-27 08:50:08",
        tbCount: 150,
        status: 4
      }, {
        taskName: "2021S104300015",
        code: "2021S104300015",
        pushTime: "2021-10-27 08:50:08",
        receiveTime: "2021-10-27 08:50:08",
        finishTime: "2021-10-27 08:50:08",
        tbCount: 150,
        status: 1
      }, {
        taskName: "2021S104300014",
        code: "2021S104300014",
        pushTime: "2021-10-27 08:50:08",
        receiveTime: "2021-10-27 08:50:08",
        finishTime: "2021-10-27 08:50:08",
        tbCount: 150,
        status: 1
      }, {
        taskName: "2021S104300013",
        code: "2021S104300013",
        pushTime: "2021-10-27 08:50:08",
        receiveTime: "2021-10-27 08:50:08",
        finishTime: "-",
        tbCount: 150,
        status: 0
      }
    ];
    resolve({ code: 200, message: "", data: tableData });
  });
}

export function gainJctbTask({ fromDate, toDate, taskName, statusArr }) {
  let url = `/jctbTask/listByFilter`;
  return request.get(url, {
    params: {
      fromDate,
      toDate,
      taskName,
      status: statusArr.join(",")
    }
  });
}

export function processExportTask(record) {
  let url = `/reportTask/processExportTask`;
  console.log(record, "@@@");
  return request.put(url, record);
}

