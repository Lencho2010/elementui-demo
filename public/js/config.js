const baseUrl = "/api/webstore";

const clusterUrl = ["172.16.15.243:8067", "172.16.15.243:8068"];
window.g = {
  root: baseUrl,
  activeLogin: false,

  url_checkResultTotalList: baseUrl + "/checkResultTotal/list",
  url_checkResultTotalCount: baseUrl + "/checkResultTotal/count",
  url_checkResultSelectByStatus: baseUrl + "/checkResultTotal/selectByStatus2"
};
