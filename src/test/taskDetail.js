export default function() {
  return [{
    stepInfo: "接受解压",
    status: 1,
    progress: 100,
    consumeTime: "1min"
  }, {
    stepInfo: "质量检查",
    status: 1,
    progress: 100,
    consumeTime: "30min"
  }, {
    stepInfo: "套合对比",
    status: 2,
    progress: 90,
    consumeTime: "100min",
    children: [{
      stepInfo: "与土地利用现状数据套合比对",
      status: 1,
      logInfo: "共300个要素进行套合比对，其中300个要素天河比对通过",
      consumeTime: "10min"
    }, {
      stepInfo: "与土地利用总体规划数据套合比对",
      status: 1,
      logInfo: "共300个要素进行套合比对，其中300个要素天河比对通过",
      consumeTime: "10min"
    }, {
      stepInfo: "与永久基本农田数据套合比对",
      status: 1,
      logInfo: "共300个要素进行套合比对，其中300个要素天河比对通过",
      consumeTime: "10min"
    }, {
      stepInfo: "与国家自然保护区数据套合比对",
      status: 1,
      logInfo: "共300个要素进行套合比对，其中300个要素天河比对通过",
      consumeTime: "10min"
    }, {
      stepInfo: "与批准农转用数据套合比对",
      status: 1,
      logInfo: "共300个要素进行套合比对，其中300个要素天河比对通过",
      consumeTime: "10min"
    }]
  }, {
    stepInfo: "成果检查",
    status: 0,
    progress: 0,
    consumeTime: ""
  }, {
    stepInfo: "成果输出",
    status: 0,
    progress: 0,
    consumeTime: ""
  }, {
    stepInfo: "数据入库",
    status: 0,
    progress: 0,
    consumeTime: ""
  }];
}