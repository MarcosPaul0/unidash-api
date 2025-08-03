import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@/domain/entities/user';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as User;
  },
);
