import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface CityProps {
  name: string;
  stateId: string;
}

export class City extends Entity<CityProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    if (!name) {
      return;
    }

    this.props.name = name;
  }

  get stateId() {
    return this.props.stateId;
  }

  set stateId(stateId: string) {
    if (!stateId) {
      return;
    }

    this.props.stateId = stateId;
  }

  static create(props: CityProps, id?: UniqueEntityId) {
    const city = new City(
      {
        ...props,
      },
      id,
    );

    return city;
  }
}
