import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserRole } from '@/types/user.types'

interface JwtPayload {
	userId: string
	tenantId: string | null
	role: UserRole
}

export const jwtAuth = ( req: Request, res: Response, next: NextFunction ) => {
	const authHeader = req.headers.authorization

	if(!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized'})
	}

	const token = authHeader.split(' ')[1]

	try {
		const decoded = jwt.verify(
			token,
			config.JWT_SECRET as string
		) as JwtPayload

		req.user = {
			userId: decoded.userId,
			tenantId: decoded.tenantId,
			role: decoded.role
		}

		next()
	} catch(error) {
		return res.status(401).json({ message: 'Invalid or expired token'})
	}
}