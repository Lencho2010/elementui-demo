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
