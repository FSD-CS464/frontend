export type Repeat =
    | { type: "daily" }
    | { type: "weekly"; daysOfWeek: number[] } // 0=Sun ... 6=Sat
    | { type: "everyN"; interval: number };

export type Habit = {
  id: string;
  title: string;
  icon: string;
  done: boolean;
  repeat: Repeat;
};