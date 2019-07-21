'use strict';

module.exports = app => {
  // 自定义Controller
  return class extends app.Controller {

    // 返回模型
    get models() {
      return this.ctx.model.models;
    }
    get baseUtils() {
      return this.ctx.service.utils.base;
    }

    success(data) {
      return this.ctx.success(data);
    }

    // 校验ctx.query参数
    validateQuery(rules, type) {
      return this.ctx.validateQuery(rules, type);
    }

    // 校验ctx.request.body参数
    validateBody(rules) {
      return this.ctx.validateBody(rules);
    }

    // 校验url中参数
    validateParams(rules) {
      return this.ctx.validateParams(rules);
    }

    // 处理并返回分页参数
    getPageParams() {
      return this.ctx.getPageParams();
    }

    // 生成并管理数据库会话
    async transaction(func) {
      return this.ctx.transaction(func);
    }

    // 返回查询列表结果，查询结果带total
    async returnListWithCount(promise) {
      return this.ctx.returnListWithCount(promise);
    }

    // 返回查询列表结果，数据数量作为total
    async returnListWithLength(promise) {
      return this.ctx.returnListWithLength(promise);
    }

    // 返回查询列表结果，两个参数，一个为数据，一个为total
    async returnList(promise, totalPromise) {
      return this.ctx.returnList(promise, totalPromise);
    }

    // 返回sql语句查询结果
    async returnListByQuery(promise) {
      return this.ctx.returnListByQuery(promise);
    }

    // 返回创建数据结果
    async returnCreate(promise, options) {
      return this.ctx.returnCreate(promise, options);
    }

    // 返回批量创建结果
    async returnBulkCreate(promise) {
      return this.ctx.returnBulkCreate(promise);
    }

    // 返回更新操作结果
    async returnUpdate(promise, options) {
      return this.ctx.returnUpdate(promise, options);
    }

    // 返回查询详情
    async returnDetail(promise) {
      return this.ctx.returnDetail(promise);
    }

    // 返回删除操作结果
    async returnDelete(promise) {
      return this.ctx.returnDelete(promise);
    }
  };
};
