import { ApiProperty } from '@nestjs/swagger';
import type { CitizenDto } from 'modules/citizen/dto/citizen-dto';

import type { UserDto } from '../../user/dto/user-dto';
import { TokenPayloadDto } from './TokenPayloadDto';

export class LoginPayloadDto {
  user: UserDto | CitizenDto;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  constructor(user: UserDto | CitizenDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
