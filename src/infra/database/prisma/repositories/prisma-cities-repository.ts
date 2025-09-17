import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CitiesRepository,
  FindAllCitiesFilter,
} from '@/domain/application/repositories/cities-repository';
import { PrismaCityMapper } from '../mappers/prisma-city-mapper';
import { City } from '@/domain/entities/city';

@Injectable()
export class PrismaCitiesRepository implements CitiesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: FindAllCitiesFilter): Promise<City[]> {
    const cities = await this.prisma.city.findMany({
      where: {
        name: {
          contains: filters?.name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (!cities) {
      return [];
    }

    return cities.map((city) => PrismaCityMapper.toDomain(city));
  }

  async findByState(stateId: string): Promise<City[]> {
    const cities = await this.prisma.city.findMany({
      where: {
        stateId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (!cities) {
      return [];
    }

    return cities.map((city) => PrismaCityMapper.toDomain(city));
  }

  async findById(id: string): Promise<City | null> {
    const city = await this.prisma.city.findUnique({
      where: {
        id,
      },
    });

    if (!city) {
      return null;
    }

    return PrismaCityMapper.toDomain(city);
  }
}
