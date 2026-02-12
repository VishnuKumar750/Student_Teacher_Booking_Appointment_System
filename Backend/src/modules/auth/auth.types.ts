export interface RegisterStudentPayload {
  name: string;
  email: string;
  password: string;
  department: string;
  year: number;
}

export const DEFAULT_AVAILABILITY = {
  start: "09:00",
  end: "16:00", // college time
};

export interface LoginStructure {
  email: string;
  password: string;
}
