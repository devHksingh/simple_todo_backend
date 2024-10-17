import express from 'express'
import authenticate from '../middlewares/authenticate'
import { createTodo, getAllTodo } from './postController'


const todoRoute = express.Router()

todoRoute.post('/createTodo', authenticate, createTodo)
todoRoute.get('/allTodos', getAllTodo)


export default todoRoute