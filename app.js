'use strict';

module.exports = app => {
  // =================
  //      中间件
  // =================
  const mws = app.config.coreMiddleware;

  // 取消notfound，后面会使用exception替代其功能
  mws.splice(mws.findIndex(d => d === 'notfound'), 1);

  // 加入基本插件
  mws.unshift.apply(mws, [ 'logRunningTime', 'exception' ]);

  // =================
  //    Controller
  // =================
  const CustomerController = require('./lib/controller.js')(app);
  app.Controller = CustomerController;
};
