import { CitiesRepository } from '@/domain/application/repositories/cities-repository';
import { City } from '@/domain/marketplace/enterprise/entities/city';

export class InMemoryCitiesRepository implements CitiesRepository {
  public items: City[] = [];

  async findByState(stateId: string): Promise<City[]> {
    const cities = this.items
      .filter((item) => item.stateId.toString() === stateId)
      .sort((a, b) => a.name.localeCompare(b.name));

    return cities;
  }

  async findById(id: string): Promise<City | null> {
    const city = this.items.find((item) => item.id.toString() === id);

    if (!city) {
      return null;
    }

    return city;
  }
}
