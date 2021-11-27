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

// 获取质检汇总信息
export function pageCheckResultTotal(page, rows, entity) {
  let url = `/jctbQualityCheckOverview/list/${page}/${rows}`;
  return request.post(url, entity);
}

export function exportCheckResultTotal(entity) {
  let url = `/jctbQualityCheckOverview/export`;
  return request.post(url, entity, {
    responseType: "blob"
  });
  /*return request({
    method: "post",
    url,
    reponseType: "blob",
    data: entity
  });*/
}

export function exportCheckDetail(entity) {
  let url = `/jctbQualityCheckDetail/export`;
  return request.post(url, entity, {
    responseType: "blob"
  });
}

export function exportCheckFail(entity) {
  let url = `/jctbQualityCheckFail/export`;
  return request.post(url, entity, {
    responseType: "blob"
  });
}

// 获取质检详情信息
export function listCheckDetail(taskName) {
  let url = `/jctbQualityCheckDetail/list/${taskName}`;
  return request.get(url);
}

export function pageCheckDetail(page, rows, entity) {
  let url = `/jctbQualityCheckDetail/list/${page}/${rows}`;
  return request.post(url, entity);
}

// 获取质检不通过信息
export function listCheckFail(taskName) {
  let url = `/jctbQualityCheckFail/list/${taskName}`;
  return request.get(url);
}

export function pageCheckFail(page, rows, entity) {
  let url = `/jctbQualityCheckFail/list/${page}/${rows}`;
  return request.post(url, entity);
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

export function pageCheckData(tag, page, rows, entity) {
  switch (tag) {
    case "overview":
      return pageCheckResultTotal(page, rows, entity);
    case "detail":
      return pageCheckDetail(page, rows, entity);
    case "fail":
      return pageCheckFail(page, rows, entity);
  }
}

export function exportCheckData(tag, entity) {
  switch (tag) {
    case "overview":
      return exportCheckResultTotal(entity);
    case "detail":
      return exportCheckDetail(entity);
    case "fail":
      return exportCheckFail(entity);
  }
}
