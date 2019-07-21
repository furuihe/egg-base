'use strict';

const Controller = require('egg').Controller;

module.exports = app => {
  return class extends app.Controller {

    async index() {
      this.success({});
    }

    async exception() {
      switch (this.ctx.query.status) {
        case '200': {
          this.success({});
          break;
        }
        case '400': {
          throw { status: 400, code: 'NOT_UNIQUE', message: '数据重复' };
        }
        case '500': {
          throw { status: 500 };
        }
        case 'other': {
          throw {};
        }
        default: {
          break;
        }
      };
    }
  }
};
