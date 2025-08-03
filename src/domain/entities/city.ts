import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CityProps {
  name: string
  stateId: UniqueEntityId
}

export class City extends Entity<CityProps> {
  get name() {
    return this.props.name
  }

  get stateId() {
    return this.props.stateId
  }

  static create(props: CityProps, id?: UniqueEntityId) {
    const city = new City(
      {
        ...props,
      },
      id,
    )

    return city
  }
}
