import koa from 'koa';
import Router from '@koa/router';
import { RegisterRoutes } from './_routes_tsoa';

export const router: Router = new Router();

router.use(async (ctx: koa.Context, next: koa.Next) => {
  try {
    await next();
  } catch (err) {
    console.log('err:', err);
    ctx.response.status = err.status || 500;
    ctx.body = err.message;
  }
});
RegisterRoutes(router);
