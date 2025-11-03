export type Habit = {
    id: string;
    title: string;
    done: boolean;
    icons: string;
    cadence: "daily" | `everyN-${number}` | `weekly-${string}`; // "daily" | "everyN-<n_days>" | "weekly-<day_of_the_week>" or "weekly-<day1,day2,...>"
};