import request from "@/util/request";

/*export function fitList(page, rows, taskName, status) {
  let url = `/zipFileInfo/listByStatus/${page}/${rows}`;
  return request.get(url, {
    params: {
      status,
      taskName
    }
  });
}

export function del(id) {
  let url = `/zipFileInfo/delete/${id}`;
  return request.delete(url);
}

export function updateStatus(id, status) {
  let url = `/zipFileInfo/updateStatus`;
  return request.put(url, {
    id, status
  });
}

export function findOne(taskName) {
  let url = `/zipFileInfo/select/${taskName}`;
  return request.get(url);
}*/

export function taskList(page, rows, taskName, status) {
  let url = `/jctbTask/list/${page}/${rows}`;
  return request.get(url, {
    params: {
      status,
      taskName
    }
  });
}

export function del(taskName) {
  let url = `/jctbTask/${taskName}`;
  return request.delete(url);
}

export function updateStatus(taskName, status) {
  let url = `/jctbTask/updateStatus`;
  return request.put(url, {
    taskName, status
  });
}

export function findOne(taskName) {
  let url = `/jctbTask/${taskName}`;
  return request.get(url);
}
