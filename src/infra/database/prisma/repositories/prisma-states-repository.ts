import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaStateMapper } from '../mappers/prisma-state-mapper';
import { StatesRepository } from '@/domain/application/repositories/states-repository';
import { State } from '@/domain/entities/state';

@Injectable()
export class PrismaStatesRepository implements StatesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<State[]> {
    const states = await this.prisma.state.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    if (!states) {
      return [];
    }

    return states.map((state) => PrismaStateMapper.toDomain(state));
  }
}
