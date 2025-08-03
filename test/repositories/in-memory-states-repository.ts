import { StatesRepository } from '@/domain/application/repositories/states-repository';
import { State } from '@/domain/marketplace/enterprise/entities/state';

export class InMemoryStatesRepository implements StatesRepository {
  public items: State[] = [];

  async findAll(): Promise<State[]> {
    return this.items.sort((a, b) => a.name.localeCompare(b.name));
  }
}
