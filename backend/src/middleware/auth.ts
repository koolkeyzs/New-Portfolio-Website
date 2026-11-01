import type {Request , Response , NextFunction} from 'express'
import jwt from 'jsonwebtoken'

const protect = (req: Request , res:Response, next:NextFunction):void =>{
  try {
    const token = req.cookies.token

    if (!token) {
        res.status(401).json({
            success : false,
            message : 'Access Denied , PLease log in'
        })
        return;
    }


    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
    )


    if(typeof decoded === 'string' || !('id' in decoded)) {
        res.status(401).json({
            success : false,
            message : 'Invalid authentication token'
        })
        return;
    }

    res.locals.adminId = String(decoded.id)

    next()

  } catch (error) {
    res.status(401).json({
        success : false,
        message: 'invalid or expired token'
    })
    
  }
}


export default protect;