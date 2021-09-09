import request from "@/util/request";

export function fitList(page, rows, taskName, status) {
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
