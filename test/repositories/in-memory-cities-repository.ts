import { CitiesRepository } from '@/domain/application/repositories/cities-repository';
import { City } from '@/domain/entities/city';

export class InMemoryCitiesRepository implements CitiesRepository {
  public cities: City[] = [];

  async findAll(): Promise<City[]> {
    return this.cities;
  }

  async findByState(stateId: string): Promise<City[]> {
    const cities = this.cities
      .filter((item) => item.stateId.toString() === stateId)
      .sort((a, b) => a.name.localeCompare(b.name));

    return cities;
  }

  async findById(id: string): Promise<City | null> {
    const city = this.cities.find((item) => item.id.toString() === id);

    if (!city) {
      return null;
    }

    return city;
  }
}
