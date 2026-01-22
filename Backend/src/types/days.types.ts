export const DAYS = [
	'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'
] as const

export type Days = typeof DAYS[Number]