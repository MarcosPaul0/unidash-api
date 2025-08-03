import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StatesRepository } from '../../repositories/states-repository';
import { State } from '@/domain/entities/state';

type FindAllStatesUseCaseResponse = Either<
  null,
  {
    state: State[];
  }
>;

@Injectable()
export class FindAllStatesUseCase {
  constructor(private statesRepository: StatesRepository) {}

  async execute(): Promise<FindAllStatesUseCaseResponse> {
    const states = await this.statesRepository.findAll();

    return right({
      state: states,
    });
  }
}
