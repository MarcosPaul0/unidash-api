import { City } from '@/domain/entities/city';

export class CityPresenter {
  static toHTTP(city: City) {
    return {
      id: city.id.toString(),
      name: city.name,
    };
  }
}
