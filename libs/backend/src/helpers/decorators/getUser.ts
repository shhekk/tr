// export function GetUser(): ParameterDecorator {
//   return function (target, propertyKey, parameterIndex) {};
// }

import { BadRequestException, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data, context) => {
  const request = context.switchToHttp().getRequest();
  if (!request['user']) throw new BadRequestException();
  return request['user']; // added in auth middleware
});
