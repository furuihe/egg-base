'use strict';

module.exports = {
  get baseUtils() {
    return this.service.utils.base;
  },

  // 200返回正确结果
  success(data) {
    this.body = {
      status: 200,
      data,
    };
  },

  // 校验ctx.query参数
  validateQuery(rules, type) {
    // 参数校验
    const typeRulesMap = {
      list: {
        limit: { type: 'intString', required: false, max: 500 },
        offset: { type: 'id', required: false },
        page: { type: 'id', required: false },
        pagesize: { type: 'intString', required: false, max: 500 },
        next: { type: 'id', required: false },
      },
      detail: {
        id: 'id',
      },
      update: {
        id: 'id',
      },
      delete: {
        id: 'id',
      },
    };
    const errors = this.app.validator.validate(Object.assign({}, typeRulesMap[type], rules), this.query);
    if (errors) {
      throw { status: 400, code: 'QUERY_PARAM_INVALID', message: `参数${errors[0].field}不满足要求` };
    }
    return rules;
  },

  // 校验ctx.request.body参数
  validateBody(rules) {
    const tmpRules = {};
    for (const [ k, v ] of Object.entries(rules)) {
      if (v.allowNull && this.request.body[k] === null) continue;
      tmpRules[k] = v;
    }
    const errors = this.app.validator.validate(tmpRules, this.request.body);
    if (errors) {
      throw { status: 400, code: 'BODY_PARAM_INVALID', message: `参数${errors[0].field}不满足要求` };
    }
    return rules;
  },

  // 校验url中参数
  validateParams(rules) {
    const errors = this.app.validator.validate(rules, this.request.params);
    if (errors) {
      throw { status: 400, code: 'BODY_PARAM_INVALID', message: `参数${errors[0].field}不满足要求` };
    }
    return rules;
  },

  // 处理并返回分页参数
  getPageParams() {
    let offset;
    let limit;
    if (this.query.offset) {
      offset = parseInt(this.query.offset);
      limit = parseInt(this.query.limit) || this.app.config.listLimit;
    } else if (this.query.page) {
      limit = parseInt(this.query.pagesize) || this.app.config.listLimit;
      offset = (parseInt(this.query.page) - 1) * limit;
    } else {
      limit = this.query.limit || this.app.config.listLimit;
    }
    return { offset, limit };
  },

  // 生成并管理数据库会话
  async transaction(func) {
    const t = await this.model.transaction();

    try {
      await func(t);
      await t.commit();
    } catch (e) {
      await t.rollback();
      if (e.status && e.code && e.message) throw e;
      else this.logger.error(e);
      switch (e.name) {
        case 'SequelizeUniqueConstraintError': {
          throw { status: 400, code: 'NOT_UNIQUE', message: '数据重复', fields: Object.keys(e.fields) };
        }
        default:
          throw { status: 500 };
      }
    }
  },

  // 返回查询列表结果，查询结果带total
  async returnListWithCount(promise) {
    try {
      const { count: total, rows: data } = await promise;
      this.status = 200;
      this.body = { status: data.length ? 200 : 404, total, data };
    } catch (e) {
      console.log(e);
      if (e.status && e.code && e.message) throw e;
      switch (e.name) {
        default:
          throw { status: 500 };
      }
    }
  },

  // 返回查询列表结果，数据数量作为total
  async returnListWithLength(promise) {
    try {
      const { rows: data } = await promise;
      this.status = 200;
      this.body = { status: data.length ? 200 : 404, total: data.length, data };
    } catch (e) {
      console.log(e);
      if (e.status && e.code && e.message) throw e;
      switch (e.name) {
        default:
          throw { status: 500 };
      }
    }
  },

  // 返回查询列表结果，两个参数，一个为数据，一个为total
  async returnList(promise, totalPromise) {
    try {
      const result = await promise;
      let data;
      let total;
      if (totalPromise) {
        data = result;
        total = await totalPromise;
      } else {
        data = result.data;
        total = result.total;
      }
      this.status = 200;
      this.body = { status: data.length ? 200 : 404, total, data };
    } catch (e) {
      console.log(e);
      if (e.status && e.code && e.message) throw e;
      switch (e.name) {
        default:
          throw { status: 500 };
      }
    }
  },

  // 返回sql语句查询结果
  async returnListByQuery(promise) {
    try {
      const result = await promise;
      const data = result[0];
      this.status = 200;
      this.body = { status: data.length ? 200 : 404, data };
    } catch (e) {
      console.log(e);
      if (e.status && e.code && e.message) throw e;
      switch (e.name) {
        default:
          throw { status: 500 };
      }
    }
  },

  // 返回创建数据结果
  async returnCreate(promise, options) {
    try {
      const result = await promise;
      this.status = 200;
      this.body = { status: 200, data: result };
      return result;
    } catch (e) {
      console.log(e);
      if (e.status && e.code && e.message) throw e;
      if (options && options.errCb) {
        await options.errCb(e, dbErrCb);
      } else {
        dbErrCb(e);
      }
    }
  },

  // 返回批量创建结果
  async returnBulkCreate(promise) {
    try {
      const result = await promise;
      this.status = 200;
      this.body = { status: 200, total: result.length };
      return result;
    } catch (e) {
      console.log(e);
      if (e.status && e.code && e.message) throw e;
      switch (e.name) {
        case 'SequelizeUniqueConstraintError': {
          throw { status: 400, code: 'NOT_UNIQUE', message: '数据重复', fields: Object.keys(e.fields) };
        }
        default:
          throw { status: 500 };
      }
    }
  },

  // 返回更新操作结果
  async returnUpdate(promise, options) {
    try {
      const result = await promise;
      this.status = 200;
      this.body = { status: 200, data: result };
      return result;
    } catch (e) {
      // 已经进行了错误处理
      if (e.status && e.code && e.message) throw e;
      if (options && options.errCb) {
        await options.errCb(e, dbErrCb);
      } else {
        dbErrCb(e);
      }
    }
  },

  // 返回查询详情
  async returnDetail(promise) {
    try {
      const result = await promise;
      if (result) {
        this.body = { status: 200, data: result };
      } else {
        this.body = { status: 404 };
      }
      this.status = 200;
      return result;
    } catch (e) {
      // 已经进行了错误处理
      if (e.status && e.code && e.message) throw e;
      // 数据库错误
      switch (e.name) {
        default:
          this.logger.error(e);
          throw { status: 500 };
      }
    }
  },

  // 返回删除操作结果
  async returnDelete(promise) {
    try {
      const result = await promise;
      this.status = 204;
      this.body = { status: 204 };
      return result;
    } catch (e) {
      // 已经进行了错误处理
      if (e.status && e.code && e.message) throw e;
      // 数据库错误
      switch (e.name) {
        default:
          this.logger.error(e);
          throw { status: 500 };
      }
    }
  },
};

function dbErrCb(e) {
  switch (e.name) {
    case 'SequelizeUniqueConstraintError': {
      throw { status: 400, code: 'NOT_UNIQUE', message: '数据重复', fields: Object.keys(e.fields) };
    }
    default:
      throw { status: 500 };
  }
}
