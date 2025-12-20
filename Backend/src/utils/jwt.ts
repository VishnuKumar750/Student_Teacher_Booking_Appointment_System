
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3d';


type UserRole {
  
}


export const signToken = (id: string, role: UserRole) =>  {
  return jwt.sign({id, role}, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export const verifyToken = (token: string): { id: string, role: UserRole} => {
  return jwt.verify(token, JWT_SECRET) as { id: string, role: UserRole}
}