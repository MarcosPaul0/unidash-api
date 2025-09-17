import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';
import { Asset } from './student-asset';
import { Optional } from '@/core/types/optional';

export interface StudentAssetDataProps {
  studentIncomingDataId: string;
  asset: Asset;
  description: string;
}

export class StudentAssetData extends Entity<StudentAssetDataProps> {
  get studentIncomingDataId() {
    return this.props.studentIncomingDataId;
  }

  set studentIncomingDataId(studentIncomingDataId: string) {
    if (!studentIncomingDataId) {
      return;
    }

    this.props.studentIncomingDataId = studentIncomingDataId;
  }

  get asset() {
    return this.props.asset;
  }

  set asset(asset: Asset) {
    if (!asset) {
      return;
    }

    this.props.asset = asset;
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    if (!description) {
      return;
    }

    this.props.description = description;
  }

  static create(
    props: Optional<StudentAssetDataProps, 'description'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new StudentAssetData(
      {
        ...props,
        description: props.description ?? '',
      },
      id,
    );

    return courseStudentsData;
  }
}
