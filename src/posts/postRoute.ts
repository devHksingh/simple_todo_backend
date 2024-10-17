import express from 'express'
import authenticate from '../middlewares/authenticate'
import { createTodo, getAllTodo, singleUserGetAllTodo } from './postController'


const todoRoute = express.Router()

todoRoute.post('/createTodo', authenticate, createTodo)
todoRoute.get('/allTodos', getAllTodo)
todoRoute.get('/usersTodo', authenticate, singleUserGetAllTodo)



export default todoRoute