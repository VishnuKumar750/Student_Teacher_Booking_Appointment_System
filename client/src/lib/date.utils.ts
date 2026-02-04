export const isPastDate = (date: string | Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointmentDate = new Date(date);
  appointmentDate.setHours(0, 0, 0, 0);

  return appointmentDate < today;
};

export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
