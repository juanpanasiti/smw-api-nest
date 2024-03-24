import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { HandleAuthErrors } from 'src/common/error-handlers';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (!req?.user) HandleAuthErrors.userNotFoundInRequest();

  return req.user;
});
