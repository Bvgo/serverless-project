import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(
      cors({
        credentials: true
      })
    )
    .use(httpErrorHandler());
};
