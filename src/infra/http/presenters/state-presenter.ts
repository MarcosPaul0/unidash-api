import { State } from '@/domain/entities/state';

export class StatePresenter {
  static toHTTP(state: State) {
    return {
      id: state.id.toString(),
      name: state.name,
    };
  }
}
