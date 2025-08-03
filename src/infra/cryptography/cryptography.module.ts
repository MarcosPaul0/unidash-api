import { Module } from '@nestjs/common';

import { JwtEncrypter } from './jwt-encrypter';
import { BcryptHasher } from './bcrypt-hasher';
import { Hasher } from '@/domain/application/cryptography/hasher';
import { TokenEncrypter } from '@/domain/application/cryptography/token-encrypter';

@Module({
  providers: [
    { provide: TokenEncrypter, useClass: JwtEncrypter },
    { provide: Hasher, useClass: BcryptHasher },
  ],
  exports: [TokenEncrypter, Hasher],
})
export class CryptographyModule {}
