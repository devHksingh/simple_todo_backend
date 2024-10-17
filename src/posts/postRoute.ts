import express from 'express'
import authenticate from '../middlewares/authenticate'
import { createTodo } from './postController'


const todoRoute = express.Router()

todoRoute.post('/createTodo', authenticate, createTodo)


export default todoRoute