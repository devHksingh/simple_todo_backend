import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../middlewares/authenticate'
import { PrismaClient } from '@prisma/client'
import createHttpError from 'http-errors'


const prisma = new PrismaClient()
const createTodo = async (req: Request, res: Response, next: NextFunction) => {
    const _req = req as AuthRequest
    const userEmail = _req.email
    const userId = _req.userId
    const { title, content } = req.body
    let newTodo
    try {
        newTodo = await prisma.todo.create({
            data: {
                title,
                content,
                userEmail: userEmail
            },
            select: {
                id: true,
                createdAt: true,
                title: true,
                content: true,
                
                userEmail:true
            }
        })
        if (newTodo) {
            console.log('newTodo', newTodo);
            res.status(200).json({
                message: "Todo is created successfully",
                success: true,
                todo: newTodo
            })
        }
    } catch (error) {
        console.log('error while creating todo  on DB : ', error)
        return next(createHttpError(500, 'error while creating todo'))
    }
}


export { createTodo }