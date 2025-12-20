import { z } from 'zod';

export const registerSchema = z.object({
	name: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(4).max(8),
})


export const login = z.object({
	email: z.string().email(),
	password: z.string().min(4).max(8),
})