import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { EnvService } from '../env/env.service';
import { USER_ROLE } from '@/domain/entities/user';
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
  userRole: z.enum(USER_ROLE),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    env: EnvService,
    readonly usersRepository: UsersRepository,
  ) {
    const publicKey = env.get('JWT_PUBLIC_KEY');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserPayload) {
    const userPayload = tokenPayloadSchema.parse(payload);

    const user = await this.usersRepository.findById(userPayload.sub);

    if (!user) {
      throw new NotAllowedError();
    }

    return user;
  }
}
