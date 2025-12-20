import { getEnv } from '../utils/getEnv.util'

export const appConfig = () => {
	return {
		PORT: Number(getEnv('PORT', '8080')),
		MONGO_URI: getEnv('MONGO_URI', ''),
		FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN', ''),
		JWT_SECRET: getEnv('JWT_SECRET', ''),
		JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '1d'),
	}
}

export const config = appConfig();