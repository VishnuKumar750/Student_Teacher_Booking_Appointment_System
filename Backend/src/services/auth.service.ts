import { Request, Response } from 'express'
import { IRegister } from '../types/auth.type'
import { User } from '../model/user.model'

// logic for login
export const loginService = asyncHandler(async (req: Request, res: Response) => {

})


// register service
export const registerService = asyncHandler(async (data: IRegister) => {
	const existingUser = await User.finOne({ email: data.email });

	if(existingUser) {
		return res.status(401).json({ message: 'user already exists'})
	}

	const user = await User.create(data);

	return {
		id: user._id,
		name: user.name,
		email: user.email,
		role: user.role
	}
})

