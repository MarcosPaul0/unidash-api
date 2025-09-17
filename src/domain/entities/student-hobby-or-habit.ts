import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const HOBBY_OR_HABIT = {
  videoGames: 'videoGames',
  physicalActivity: 'physicalActivity',
  listeningMusic: 'listeningMusic',
  teamSports: 'teamSports',
  moviesOrSeries: 'moviesOrSeries',
  reading: 'reading',
  internetBrowsing: 'internetBrowsing',
  playingInstrument: 'playingInstrument',
  socialMedia: 'socialMedia',
  traveling: 'traveling',
  individualSports: 'individualSports',
  handcrafting: 'handcrafting',
  other: 'other',
} as const;

export type HobbyOrHabit = (typeof HOBBY_OR_HABIT)[keyof typeof HOBBY_OR_HABIT];

export interface StudentHobbyOrHabitProps {
  hobbyOrHabit: HobbyOrHabit;
  description: string;
}

export class StudentHobbyOrHabit extends Entity<StudentHobbyOrHabitProps> {
  get hobbyOrHabit() {
    return this.props.hobbyOrHabit;
  }

  set hobbyOrHabit(hobbyOrHabit: HobbyOrHabit) {
    if (!hobbyOrHabit) {
      return;
    }

    this.props.hobbyOrHabit = hobbyOrHabit;
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

  static create(props: StudentHobbyOrHabitProps, id?: UniqueEntityId) {
    const teacherCourse = new StudentHobbyOrHabit(props, id);

    return teacherCourse;
  }
}
