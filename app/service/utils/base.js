'use strict';

module.exports = app => {

  class Util extends app.Service {

    // 检查是否存在
    checkExists(obj, typeId, message) {
      const types = {
      };
      if (!obj) {
        throw { status: 400, code: typeId.toUpperCase() + '_NOT_FOUND', message: message || `${types[typeId] || typeId.toUpperCase()}不存在` };
      }
    }
  }

  return Util;
};
