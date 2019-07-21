'use strict';

const day = require('dayjs');

module.exports = options => {
  return function* (next) {
    const beginTime = day();
    yield next;
    const info = options.format ? options.format(day().diff(beginTime)) : `运行时长：${day().diff(beginTime)}ms`;
    this.logger.info(info);
  };
};
