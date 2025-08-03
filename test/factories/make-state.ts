import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { State, StateProps } from '@/domain/entities/state';
import { PrismaStateMapper } from '@/infra/database/prisma/mappers/prisma-state-mapper';

export function makeState(
  override: Partial<StateProps> = {},
  id?: UniqueEntityId,
) {
  const state = State.create(
    {
      name: faker.location.state(),
      ...override,
    },
    id,
  );

  return state;
}

@Injectable()
export class StateFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaState(data: Partial<StateProps> = {}): Promise<State> {
    const state = makeState(data);

    await this.prisma.state.create({
      data: PrismaStateMapper.toPrisma(state),
    });

    return state;
  }
}
