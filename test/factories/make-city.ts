import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaCityMapper } from '@/infra/database/prisma/mappers/prisma-city-mapper';
import { City, CityProps } from '@/domain/entities/city';

export function makeCity(
  override: Partial<CityProps> = {},
  id?: UniqueEntityId,
) {
  const city = City.create(
    {
      name: faker.location.city(),
      stateId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return city;
}

@Injectable()
export class CityFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCity(data: Partial<CityProps> = {}): Promise<City> {
    const city = makeCity(data);

    await this.prisma.city.create({
      data: PrismaCityMapper.toPrisma(city),
    });

    return city;
  }
}
