export const USER_ROLES = [
	'SUPER_ADMIN',
	'ADMIN',
	'TEACHER',
	'STUDENT'
] as const;

export type UserRole = typeof USER_ROLES[number]

export const USER_STATUS = [
	'ACTIVE',
	'BLOCKED'
] as const 

export type UserStatus = typeof USER_STATUS[number]

