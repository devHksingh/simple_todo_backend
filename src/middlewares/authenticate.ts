import { Response, Request, NextFunction } from 'express'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import { config } from '../config/config'

interface JwtPayload {
    userId: number;
    email: string;
    isLogin: boolean
}
export interface AuthRequest extends Request {
    userId: number;
    email: string;
    isLogin: boolean;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')
    if (!token) {
        return next(createHttpError(401, "Auth token is required"))
    }
    try {
        const tokenStartsWith = token.split(' ')[0]
        if (tokenStartsWith !== "Bearer") {
            return next(createHttpError(401, 'Invalid Token'))
        }
        const jwtToken = token.split(' ')[1]
        const decodedToken = jwt.verify(jwtToken, config.jwtSecret as string) as JwtPayload

        const {isLogin,email,userId}:any =decodedToken.valueOf()
        console.log("decodedToken",decodedToken);
        console.log("decodedToken",decodedToken.valueOf());
        console.log("isLogin,email,userId",isLogin,email,userId);
        
        const _req = req as AuthRequest
        
        _req.email = email
        _req.userId = userId;
       
        _req.isLogin = isLogin;
        // req.user={email,userId,isLogin}

        // req.email = decodedToken?.email
        next()


    } catch (error) {
        return next(createHttpError(401, "Token expired"))
    }
}

// export interface AuthRequest extends Request{
//     email:String
// }

// const authenticate =(req:Request,res:Response,next:NextFunction)=>{
//     const token = req.header('Authorization')
//     if(!token){
//         return next(createHttpError(401,"Auth token is required"))
//     }

    

//     try {
//         const paresedToken = token.split(' ')[1]
//         const decoded = jwt.verify(paresedToken,config.jwtSecret as string)
    
//         console.log('decoded token',decoded);

//         const _req = req as AuthRequest
//         _req.email = decoded.sub as string
//         next()
//     } catch (err) {
//        return next(createHttpError(401,"Token expired")) 
//     }
    
    
    
// }

export default authenticate