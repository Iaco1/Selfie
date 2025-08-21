export class Pomodoro {
  // all measures are in seconds
  studyFor: number;
  restFor: number;
  sessionTime: number; // (studyFor + restFor) * repetitions
  completed: boolean;

  constructor(studyFor: number, restFor: number, sessionTime: number) {
    this.studyFor = studyFor;
    this.restFor = restFor;
    this.sessionTime = sessionTime;
    this.completed = false;
  }

  markAsCompleted() {
    this.completed = true;
  }

  markAsNotCompleted() {
    this.completed = false;
  }
}
