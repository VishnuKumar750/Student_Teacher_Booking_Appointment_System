export const AppointmentStatus = {
  APPROVED: "APPROVED",
  CANCELLED: "CANCELLED",
  PENDING: "PENDING",
};

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];
