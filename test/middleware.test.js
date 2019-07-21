'use strict';

const fs = require('fs');
const mm = require('egg-mock');
const assert = require('power-assert');

describe('test/extend.test.js', () => {
  let app;
  let ctx;
  let request;
  
  before(() => {
    app = mm.app({ baseDir: 'apps/dummy', plugin: 'dummy' });
    return app.ready();
  });
  after(() => app.close());

  beforeEach(() => {
    request = app.httpRequest();
    ctx = app.mockContext();
  });

  describe('log-running-time', () => {
    it('should work', () => {
      return request
        .get('/')
        .expect(200)
        .then(() => {
          assert.ok(/运行时长/.test(fs.readFileSync(`${app.baseDir}/logs/dummy/dummy-web.log`,'utf-8')));
          return;
        });
    });
  });
  
  describe('exception', () => {
    it('should ok', () => {
      return app.httpRequest()
        .get('/exception?status=200')
        .expect(200)
        .expect({ status: 200, data: {} });
    });
    it('should 400', () => {
      return app.httpRequest()
        .get('/exception?status=400')
        .expect(400)
        .expect({ status: 400, code: 'NOT_UNIQUE', message: '数据重复' });
    });
    it('should 500', () => {
      return app.httpRequest()
        .get('/exception?status=500')
        .expect(500)
        .expect({ status: 500 });
    });
    it('other should 500', () => {
      return app.httpRequest()
        .get('/exception?status=other')
        .expect(500)
        .expect({ status: 500, code: 'SYSTE_BUSY', message: '系统繁忙' });
    });
  });
});
