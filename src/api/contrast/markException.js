import request from "@/util/request";

export function listMarkException(taskName) {
    let url = `/jctbMarkException/list/${taskName}`;
    return request.get(url);
}

export function batchUpdate(records) {
    return request.put("/jctbMarkException/batch", records);
}