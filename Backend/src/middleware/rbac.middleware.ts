import { Request, Response, NextFunction } from 'express'
import { UserRole } from '@/types/user.types'

export const rbac = ( allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction ) => {
	const user = req.user;

	if(!user) {
		return res.status(401).json({ message: 'Unauthroized'})
	}

	// super admin
	if(user.role === 'SUPER_ADMIN') {
		return next()
	}

	if(!allowedRoles.includes(user.role)) {
		return res.status(403).json({ message: 'Forbidden'})
	}

	next()
}