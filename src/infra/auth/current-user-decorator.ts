import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { SessionUser, User } from '@/domain/entities/user';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user as User;

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      accountActivatedAt: user.accountActivatedAt,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    } as SessionUser;
  },
);
