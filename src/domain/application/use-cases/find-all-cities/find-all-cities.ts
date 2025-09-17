import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import {
  CitiesRepository,
  FindAllCitiesFilter,
} from '../../repositories/cities-repository';
import { City } from '@/domain/entities/city';

interface FindAllCitiesUseCaseRequest {
  filters?: FindAllCitiesFilter;
}

type FindAllCitiesUseCaseResponse = Either<
  null,
  {
    cities: City[];
  }
>;

@Injectable()
export class FindAllCitiesUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute({
    filters,
  }: FindAllCitiesUseCaseRequest): Promise<FindAllCitiesUseCaseResponse> {
    const cities = await this.citiesRepository.findAll(filters);

    return right({
      cities,
    });
  }
}
