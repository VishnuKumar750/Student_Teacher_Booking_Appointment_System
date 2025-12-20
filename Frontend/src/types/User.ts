export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
