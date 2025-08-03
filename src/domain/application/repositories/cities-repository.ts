import { City } from '../../entities/city'

export abstract class CitiesRepository {
  abstract findByState(stateId: string): Promise<City[]>
  abstract findById(id: string): Promise<City | null>
}
