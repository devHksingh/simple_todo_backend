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
        console.log(userData);

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


export { createUser }