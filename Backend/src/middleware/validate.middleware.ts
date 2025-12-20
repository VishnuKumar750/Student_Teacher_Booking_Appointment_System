import { z } from 'zod';


export const validate = (schema: z.ZodSchema) => (req, res, next) => {
	const result = schema.safeParse(req.body);

	if(!result.success) {
		return res.status(400).json({ message: 'Invalid request body', errors: result.error.errors })
	}


	req.body = result.data;
	next();
}