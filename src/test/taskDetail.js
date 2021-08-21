export default function() {
  return [{
    key:"接收解压",
    stepInfo: "接收解压",
    status: 1,
    progress: 100,
    consumeTime: "1min",
    children: [{
      stepInfo: "数据解压",
      status: 1,
      logInfo: "数据解压完成",
      consumeTime: "10min"
    }]
  }, {
    key:"质量检查",
    stepInfo: "质量检查",
    status: 1,
    progress: 100,
    consumeTime: "30min",
    children: [{
      stepInfo: "数据完整性检查",
      status: 1,
      logInfo: "数据单元与数据总体推送JSON内容一致，要素个数一致。",
      consumeTime: "10min"
    },{
      stepInfo: "数据有效性检查",
      status: 1,
      logInfo: "数据文件正常打开",
      consumeTime: "10min"
    },{
      stepInfo: "数学基础检查",
      status: 1,
      logInfo: "采用2000国家大地坐标系（经纬度坐标）",
      consumeTime: "10min"
    },{
      stepInfo: "属性结构检查",
      status: 1,
      logInfo: "共检查30个字段，图层属性字段的数量符合要求，其中29个属性字段名称、类型、长度符合要求，1个字段类型不符合要求。",
      consumeTime: "10min"
    },{
      stepInfo: "代码一致性检查",
      status: 1,
      logInfo: "共检查5个字段，其中5个字段值是代码的字段取值符合要求。",
      consumeTime: "10min"
    },{
      stepInfo: "编号唯一性检查",
      status: 1,
      logInfo: "共检查300个监测编号，其中290个监测编号字段取值唯一，10个监测编号字段值存在重复。",
      consumeTime: "10min"
    },{
      stepInfo: "字段必填性检查",
      status: 1,
      logInfo: "共检查20个必填字段，其中20个必填字段符合要求。",
      consumeTime: "10min"
    },{
      stepInfo: "面层内拓扑关系",
      status: 1,
      logInfo: "共检查300个要素，其中300个要素无自相交，300个要素全部闭合。",
      consumeTime: "10min"
    },{
      stepInfo: "数据自重叠检查",
      status: 1,
      logInfo: "共检查300个要素，其中300个要素无重叠。",
      consumeTime: "10min"
    },{
      stepInfo: "数据间重叠检查",
      status: 1,
      logInfo: "共检查300个要素，其中300个要素与历史批次下发数据不重叠。",
      consumeTime: "10min"
    }]
  }, {
    key:"套合对比",
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
    key:"成果检查",
    stepInfo: "成果检查",
    status: 0,
    progress: 0,
    consumeTime: "",
    children: [{
      stepInfo: "要素个数一致性检查",
      status: 1,
      logInfo: "比对结果中要素个数与质检通过要素个数一致。",
      consumeTime: "10min"
    },{
      stepInfo: "图件数量检查",
      status: 1,
      logInfo: "图件数量与图斑数量一致。",
      consumeTime: "10min"
    },{
      stepInfo: "面积字段值检查",
      status: 1,
      logInfo: "面积字段值大于等于0，各类套合面积之和大于0。",
      consumeTime: "10min"
    },{
      stepInfo: "监测面积与现状数据套合关系",
      status: 1,
      logInfo: "监测面积与现状套合农用地、建设用地面积、未利用地面积逻辑关系通过。",
      consumeTime: "10min"
    },{
      stepInfo: "监测面积与规划数据套合关系",
      status: 1,
      logInfo: "监测面积与规划数据套合面积逻辑关系通过。",
      consumeTime: "10min"
    },{
      stepInfo: "农用地与耕地面积关系",
      status: 1,
      logInfo: "农用地面积大于等于耕地面积。",
      consumeTime: "10min"
    },{
      stepInfo: "监测面积与基本农田面积关系",
      status: 1,
      logInfo: "监测面积大于等于基本农田面积。",
      consumeTime: "10min"
    },{
      stepInfo: "耕地面积检查",
      status: 1,
      logInfo: "占耕地面积小于套上耕地面积与套不上耕地面积之和。",
      consumeTime: "10min"
    }]
  }, {
    key:"成果输出",
    stepInfo: "成果输出",
    status: 0,
    progress: 0,
    consumeTime: "",
    children: [{
      stepInfo: "套合成果总体描述信息",
      status: 1,
      logInfo: "套合成果总体描述文件输出完成。",
      consumeTime: "10min"
    },{
      stepInfo: "套合结果",
      status: 1,
      logInfo: "套合结果输出完成。",
      consumeTime: "10min"
    },{
      stepInfo: "套合图件成果",
      status: 1,
      logInfo: "套合图件成果输出完成。",
      consumeTime: "10min"
    },{
      stepInfo: "质检结果",
      status: 1,
      logInfo: "质检结果输出完成。",
      consumeTime: "10min"
    },{
      stepInfo: "统计分析成果",
      status: 1,
      logInfo: "统计和分析报告编制完成。",
      consumeTime: "10min"
    }]
  }, {
    key:"数据入库",
    stepInfo: "数据入库",
    status: 0,
    progress: 0,
    consumeTime: "",
    children: [{
      stepInfo: "150502-科尔沁区",
      status: 1,
      logInfo: "[2021-06-21 10:01:33] \\\\172.16.67.66\\…\\150502.mdb YGJCTB开始入库...",
      consumeTime: "10min"
    },{
      stepInfo: "150502-科尔沁区",
      status: 1,
      logInfo: "[2021-06-21 10:01:33] \\\\172.16.67.66\\…\\150502.mdb YGJCTB入库完成。",
      consumeTime: "10min"
    }]
  }];
}