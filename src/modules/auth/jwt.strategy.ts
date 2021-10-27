import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { CitizenEntity } from 'modules/citizen/citizen.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { RoleType } from '../../common/constants/role-type';
import { TokenType } from '../../common/constants/token-type';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { CitizenService } from '../citizen/citizen.service';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ApiConfigService,
    public readonly userService: UserService,
    public readonly citizenService: CitizenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.jwtSecret,
    });
  }

  async validate(args: {
    userId: string;
    role: RoleType;
    type: TokenType;
  }): Promise<UserEntity | CitizenEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    const user: UserEntity | CitizenEntity | undefined = await (args.role ===
    RoleType.USER
      ? this.citizenService.findOne({
          id: args.userId,
          role: args.role,
        })
      : this.userService.findOne({
          id: args.userId,
          role: args.role,
        }));

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
