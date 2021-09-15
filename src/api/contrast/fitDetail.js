import request from "../../util/request";

// 获取套合比对详情信息
export function listFitResult(taskName) {
  let url = `/fitResult/listByCode/${taskName}`;
  return request.get(url);
}