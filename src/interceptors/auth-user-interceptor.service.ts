import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import type { CitizenEntity } from '../modules/citizen/citizen.entity';
import type { UserEntity } from '../modules/user/user.entity';
import { ContextProvider } from '../providers/context.provider';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const user = <UserEntity | CitizenEntity>request.user;
    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
