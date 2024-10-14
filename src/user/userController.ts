import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { sign } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { config } from '../config/config'
import createHttpError from 'http-errors'


const prisma = new PrismaClient()

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, userName, name, password } = req.body
    // check all required fields are present
    // check user is already register on DB 
    // hash password
    // create user
    // genrate token 

    if (!email || !userName || !name || !password) {
        res.status(400).json({
            message: "All feilds are required"
        })
    }

    // DB call
    try {
        const userData = await prisma.user.findUnique({
            where: {
                email
            },
            select: {

                email: true
            }
        })
        console.log('userData', userData);

        if (userData) {
            const error = createHttpError(400, "User already exits with this email")
            return next(error)
        }

    } catch (error) {
        console.log('error while fetching user detail on cerateUser : ', error)
        //  res.status(500).json({
        //     message: 'error while fetching user detail on cerateUser'
        // })
        return next(createHttpError(500, "error while fetching user detail on cerateUser"))
    }

    // hashed password 
    const hashedPassword = await bcrypt.hash(password, 10)

    let newUser

    try {
        newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                userName,
            }
        })
        console.log('newUser', newUser);

    } catch (error) {
        console.log('error while creating user  on DB : ', error)
        // res.status(500).json({
        //     message: 'error while creating user  on DB'
        // })
        return next(createHttpError(500, "Error creating user"))
    }

    // jwt token
    const token = jwt.sign({ email: newUser?.email, userName: newUser?.userName }, config.jwtSecret as string, {
        expiresIn: "2d",
        algorithm: "HS256"
    })

    res.status(200).json({
        message: `User is created successfully with ${newUser?.email} email id.`,
        token: token
    })


}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const {email,password} = req.body

    if(!email || !password){
        const error = createHttpError(400,"All feilds are required")
        return next(error)
    }
    // check user on db
    // check password
    // genrate token

    let user 
    try {
        user = await prisma.user.findUnique({
            where:{
                email
            },
            select:{
                name:true,
                email:true,
                password:true,
                id:true
            }
        })
        if(!user){
            const error = "Enter correct email id"
            return next(createHttpError(400,error))
        }
        // password check
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            const error = "Enter correct password" 
            return next(createHttpError(400,error))
        }
        // genrate token
        const token =  jwt.sign({isLogin:true, email:user.email,id:user.id}, config.jwtSecret as string , {expiresIn:'1d',algorithm:'HS256'})

        res.status(200).json({
            message: `User is loggin successfully with ${user?.email} email id.`,
            token: token
        })
        

    } catch (error) {
        return next(createHttpError(500,'Unable to fetch user details.'))
    }
}


export { createUser, loginUser }