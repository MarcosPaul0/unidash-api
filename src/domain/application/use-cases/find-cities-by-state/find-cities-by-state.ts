import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CitiesRepository } from '../../repositories/cities-repository';
import { City } from '@/domain/entities/city';

interface FindCitiesByStateUseCaseRequest {
  stateId: string;
}

type FindCitiesByStateUseCaseResponse = Either<
  null,
  {
    cities: City[];
  }
>;

@Injectable()
export class FindCitiesByStateUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute({
    stateId,
  }: FindCitiesByStateUseCaseRequest): Promise<FindCitiesByStateUseCaseResponse> {
    const cities = await this.citiesRepository.findByState(stateId);

    return right({
      cities,
    });
  }
}
