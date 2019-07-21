'use strict';

const mm = require('egg-mock');
const assert = require('power-assert');
const app = mm.app({ baseDir: 'apps/dummy', plugin: 'dummy' });
let request;

describe('test/service.test.js', () => {
  let ctx;
  
  before(done => {
    app.ready(done);
  });
  after(() => app.close());

  beforeEach(() => {
    request = app.httpRequest();
    ctx = app.mockContext();
  });

  describe('utils.base', () => {
    it('checkExists', () => {
      assert.ok(ctx.baseUtils.checkExists);
      assert.deepEqual(ctx.baseUtils.checkExists({}, 'test'), undefined);
      try {
        ctx.baseUtils.checkExists(undefined, 'test');
      } catch (e) {
        assert.notStrictEqual(e, { status: 400, code: 'TEST_NOT_FOUND', message: 'TEST不存在' });
      };
    });
  });
});
