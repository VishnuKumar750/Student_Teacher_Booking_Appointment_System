import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import { config } from '../config/app.config'


interface IAuth extends Request {
	user?: {
		id: string;
		role: string;
	}
}

// auth middleware for token verification
export const authmiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization;

		if(!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'Unauthorized'})
		}

		const token = authHeader.split(' ')[1];

		const payload = jwt.verify(token, config.JWT_SECRET) as {
			sub: string;
			role: string;
		}

		req.user = {
			id: payload.sub,
			role: payload.role,
		}

		next();
	} catch(err) {
		return res.status(401).json({ message: 'Invalid or expired token'})
	}
}

//  verify authroize roles
export const authorize = (...roles: string[]) =>
(req: IAuth, res: Response, next: NextFunction) => {
	if(!req.user || !roles.includes(req.user.role)) {
		return res.status(401).json({ message: 'Forbidden'})
	}
}


