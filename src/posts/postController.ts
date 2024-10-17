import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../middlewares/authenticate'
import { PrismaClient } from '@prisma/client'
import createHttpError from 'http-errors'
import { log } from 'node:console'



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

                userEmail: true
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

const getAllTodo = async (req: Request, res: Response, next: NextFunction) => {
    console.log("***************getAllTodo *********");

    let allTodos
    try {
        allTodos = await prisma.todo.findMany()
        if (allTodos) {
            console.log("allTodos", allTodos);
            res.status(200).json({
                message: "Fecthed all todos",
                todo: allTodos
            })

        }
    } catch (error) {
        console.log("Error occured while getting all todos");
        return next(createHttpError(500, "Error occured while getting all todos"))

    }
}
const singleUserGetAllTodo = async (req: Request, res: Response, next: NextFunction) => {
    const _req = req as AuthRequest
    const userEmail = _req.email
    let allTodos
    // Below query return all user with all todos
    // try {
    //     const allPosts = await prisma.user.findMany({
    //         include: {
    //             todo: true
    //         }
    //     })

    //     if (allPosts) {
    //         console.log(allPosts)
    //         res.status(200).json({
    //             message: "User all post",
    //             todo: allPosts
    //         })
    //     }
    // } catch (error) {

    // }

    try {
        allTodos = await prisma.user.findUnique({
            where: {
                email: userEmail
            },
            select: {
                todo: true
            }
        })

    } catch (error) {
        console.log("error");

    }
    let todo

    try {
        todo = await prisma.todo.findMany({
            where: {
                userEmail: userEmail
            }
        })

    } catch (error) {
        console.log("err");

    }
    if (allTodos && todo) {
        console.log("allTodos", allTodos);
        console.log("todo", todo);

        res.status(200).json({
            todo: todo,
            allTodos: allTodos
        })


    }
}

export { createTodo, getAllTodo, singleUserGetAllTodo }