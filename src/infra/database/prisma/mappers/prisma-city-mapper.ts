import { Prisma, City as PrismaCity } from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { City } from '@/domain/entities/city';

export class PrismaCityMapper {
  static toDomain(raw: PrismaCity): City {
    return City.create(
      {
        name: raw.name,
        stateId: new UniqueEntityId(raw.stateId),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(city: City): Prisma.CityUncheckedCreateInput {
    return {
      id: city.id.toString(),
      name: city.name,
      stateId: city.stateId.toString(),
    };
  }
}
