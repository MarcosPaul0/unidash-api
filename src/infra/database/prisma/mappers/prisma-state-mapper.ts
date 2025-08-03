import { Prisma, State as PrismaState } from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { State } from '@/domain/entities/state';

export class PrismaStateMapper {
  static toDomain(raw: PrismaState): State {
    return State.create(
      {
        name: raw.name,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(city: State): Prisma.StateUncheckedCreateInput {
    return {
      id: city.id.toString(),
      name: city.name,
    };
  }
}
