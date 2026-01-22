import { Request, Response, NextFunction } from 'express'

export const tenantResolver = ( req: Request, res: Response, next: NextFunction) => {
	const user = req.user

	if(user?.role === 'SUPER_ADMIN') {
		req.tenantId = null
		return next()
	}

	if(!user?.tenantId) {
		return res.status(400).json({ message: 'Tenant Context missing'})
	}

	req.tenantId = user.tenantId
	next()
}