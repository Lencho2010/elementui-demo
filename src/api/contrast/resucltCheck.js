import request from "../../util/request";

export function listResultCheck(taskName){
  let url = `/jctbResultCheckDetail/list/${taskName}`;
  return request.get(url);
}