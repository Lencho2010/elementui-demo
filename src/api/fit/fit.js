import request from "@/util/request";
import id from "element-ui/src/locale/lang/id";

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