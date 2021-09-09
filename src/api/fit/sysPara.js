import request from "../../util/request";

export function gainServiceStatus() {
  let url = `/sysPara/serviceStatus`;
  return request.get(url);
}

export function updateServiceStatus(status) {
  let url = `/sysPara/serviceStatus/${status}`;
  return request.put(url);
}

export function gainScanPaths() {
  let url = `/sysPara/scanPaths`;
  return request.get(url);
}

export function gainScanPath() {
  let url = `/sysPara/scanPath`;
  return request.get(url);
}

export function updateScanPath(scanPath) {
  console.log({ scanPath });
  let url = `/sysPara/scanPath`;
  return request({
    url,
    method: "put",
    params: { scanPath }
  });
}

export function updateScanPathAndInterval(scanPath, scanInterval) {
  return request.all([
    updateScanPath(scanPath),
    updateScanInterval(scanInterval)
  ]).then(request.spread(function(ret1, ret2) {
    console.log([ret1, ret2]);
    return [ret1, ret2];
  }));
}

export function gainScanInterval() {
  let url = `/sysPara/scanInterval`;
  return request.get(url);
}

export function updateScanInterval(scanInterval) {
  let url = `/sysPara/scanInterval/${scanInterval}`;
  return request.put(url);
}