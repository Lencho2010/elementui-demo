import request from "@/util/request";

export function listTaskInfoByCode(taskName) {
  let url = `/taskInfo/list/${taskName}`;
  return request.get(url);
}

export function listSubTaskInfoByCode(taskName) {
  let url = `/subTaskInfo/list/${taskName}`;
  return request.get(url);
}

/*export function listTaskInfo(taskName){
  let url = `/taskInfo/list2/${taskName}`;
  return request.get(url);
}*/

export function listTaskInfo(taskName){
  let url = `/jctbTaskSub/list/${taskName}`;
  return request.get(url);
}

/*export function listUnzipData(taskName){
  let url = `/subFileInfo/list/${taskName}`;
  return request.get(url);
}*/

export function listUnzipData(taskName){
  let url = `/jctbUnzipDetail/list/${taskName}`;
  return request.get(url);
}
