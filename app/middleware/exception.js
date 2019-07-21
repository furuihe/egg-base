'use strict';

module.exports = () => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (e) {
      ctx.logger.error(e);
      if ([ 200, 204, 400, 401, 403, 404, 500 ].includes(e.status)) {
        ctx.status = e.status !== 404 ? e.status : 200;
        ctx.body = e;
      } else {
        ctx.status = 500;
        ctx.body = { status: 500, code: 'SYSTE_BUSY', message: '系统繁忙' };
      }
    }
  };
};
