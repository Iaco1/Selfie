export class Pomodoro {
  // all measures are in seconds
  studyFor: number;
  restFor: number;
  repetitions: number;
  completed: boolean;

  constructor(studyFor: number, restFor: number, repetitions: number) {
    this.studyFor = studyFor;
    this.restFor = restFor;
    this.repetitions = repetitions;
    this.completed = false;
  }
}
