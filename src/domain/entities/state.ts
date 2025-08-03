import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface StateProps {
  name: string
}

export class State extends Entity<StateProps> {
  get name() {
    return this.props.name
  }

  static create(props: StateProps, id?: UniqueEntityId) {
    const state = new State(
      {
        ...props,
      },
      id,
    )

    return state
  }
}
