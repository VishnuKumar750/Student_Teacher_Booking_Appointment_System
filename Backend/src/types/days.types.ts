export const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export type Days = (typeof DAYS)[number];

export const TimeSlot = {
  SLOT_10_00: "10:00-10:30",
  SLOT_10_30: "10:30-11:00",
  SLOT_11_00: "11:00-11:30",
  SLOT_11_30: "11:30-12:00",
  SLOT_12_00: "12:00-12:30",
  SLOT_12_30: "12:30-13:00",
  SLOT_13_00: "13:00-13:30",
  SLOT_13_30: "13:30-14:00",
  SLOT_14_00: "14:00-14:30",
  SLOT_14_30: "14:30-15:00",
  SLOT_15_00: "15:00-15:30",
  SLOT_15_30: "15:30-16:00",
} as const;

export type TimeSlot = (typeof TimeSlot)[keyof typeof TimeSlot];
