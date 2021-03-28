import { createParamDecorator } from '@nestjs/common';

// Decorator function to extract the data
export const AuthUser = createParamDecorator((data, req) =>
  data ? req.authInfo.user[data] : req.authInfo.user,
);
