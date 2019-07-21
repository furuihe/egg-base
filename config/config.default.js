'use strict';

module.exports = () => {
  const config = {};

  // ==============
  // middleware配置
  // ==============
  config.logRunningTime = {
    format(time) {
      return `运行时长：${time}毫秒`;
    },
  };

  return config;
};
