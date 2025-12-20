import { Request, Response } from 'express';


export const login = asyncHandler(async (req: Request, res: Response) => {

})

export const Register = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password } = req.body;

	const user = await RegisterService({ name, email, password });

	return res.status(201).json({ message: 'User created successfully'})
})