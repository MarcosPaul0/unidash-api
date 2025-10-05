import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const ASSET = {
  car: 'car',
  motorcycle: 'motorcycle',
  virtualAssistant: 'virtualAssistant',
  payTv: 'payTv',
  printer: 'printer',
  internet: 'internet',
  tablet: 'tablet',
  desktopComputer: 'desktopComputer',
  laptop: 'laptop',
  smartTv: 'smartTv',
  smartphone: 'smartphone',
} as const;

export type Asset = (typeof ASSET)[keyof typeof ASSET];

export interface StudentAssetProps {
  asset: Asset;
  description: string;
}

export class StudentAsset extends Entity<StudentAssetProps> {
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

  static create(props: StudentAssetProps, id?: UniqueEntityId) {
    const teacherCourse = new StudentAsset(props, id);

    return teacherCourse;
  }
}
