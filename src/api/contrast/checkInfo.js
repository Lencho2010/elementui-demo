import request from "../../util/request";
import ca from "element-ui/src/locale/lang/ca";


/*export function listCheckResultTotal(taskName) {
  let url = `/checkResultTotal/listByCode/${taskName}`;
  return request.get(url);
}

export function listCheckDetail(taskName) {
  let url = `/checkResult/listByCode/${taskName}`;
  return request.get(url);
}

export function listCheckFail(taskName) {
  let url = `/checkDetail/listByCode/${taskName}`;
  return request.get(url);
}*/

// 获取质检汇总信息
export function listCheckResultTotal(taskName) {
  let url = `/jctbQualityCheckOverview/list/${taskName}`;
  return request.get(url);
}

// 获取质检详情信息
export function listCheckDetail(taskName) {
  let url = `/jctbQualityCheckDetail/list/${taskName}`;
  return request.get(url);
}

// 获取质检不通过信息
export function listCheckFail(taskName) {
  let url = `/jctbQualityCheckFail/list/${taskName}`;
  return request.get(url);
}

export function listCheckData(tag, taskName) {
  switch (tag) {
    case "overview":
      return listCheckResultTotal(taskName);
    case "detail":
      return listCheckDetail(taskName);
    case "fail":
      return listCheckFail(taskName);
  }
}