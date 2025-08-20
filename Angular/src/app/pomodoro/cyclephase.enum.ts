/**
 * State of the pomodoro timer:
 * - Idle: study and break times and no. of repetitions have not been set
 * - Ready: study and break times have been set, no. of repetitions not set yet
 * - Set: study and break times and no. of repetitions set
 * - Studying: study time timer is ticking
 * - Resting: rest time timer is ticking
 */
export enum CyclePhase {
  IDLE = "IDLE",
  READY = "READY",
  SET = "SET",
  STUDYING = "STUDYING",
  RESTING = "RESTING",
}
