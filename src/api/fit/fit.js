import request from "@/util/request";

export function fitList(page, rows, status) {
    let url = `/checkResultTotal/selectByStatus2/${page}/${rows}`;
    if (status) url += `/${status}`
    return request({
        url,
        method: 'get'
    })
}