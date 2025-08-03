import { State } from '../../entities/state'

export abstract class StatesRepository {
  abstract findAll(): Promise<State[]>
}
