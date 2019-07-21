'use strict';

const mm = require('egg-mock');
const assert = require('power-assert');

describe('test/extend.test.js', () => {
  let app;
  let ctx;
  
  before(() => {
    app = mm.app({ baseDir: 'apps/dummy', plugin: 'dummy' });
    return app.ready();
  });
  after(() => app.close());

  beforeEach(() => {
    ctx = app.mockContext();
  });

  describe('getter', () => {
    it('baseUtils', () => {
      assert.equal(ctx.baseUtils, ctx.service.utils.base);
    });
    
    it('success', () => {
      ctx.success({})
      assert.notStrictEqual(ctx.body, { status: 200, data: {} });
    });
  });
  
  describe('validate', () => {
    it('allowNull', async () => {
      mm(ctx.request, 'body', { nullValue: null });
      assert.doesNotThrow(async () => {
        await ctx.validateBody({
          nullValue: { type: 'string', allowNull: true },
        });
      });
      try{
        await ctx.validateBody({
          nullValue: { type: 'string' },
        });
      } catch (e) {
        assert.equal(e.message, '参数nullValue不满足要求')
      }
    })
  });

  describe('sequelize', () => {
  });
});
