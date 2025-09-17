import { City } from '../../entities/city';

export interface FindAllCitiesFilter {
  name?: string;
}

export abstract class CitiesRepository {
  abstract findByState(stateId: string): Promise<City[]>;
  abstract findById(id: string): Promise<City | null>;
  abstract findAll(filters?: FindAllCitiesFilter): Promise<City[]>;
}
