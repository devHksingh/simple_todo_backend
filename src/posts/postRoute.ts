import express from 'express'
import authenticate from '../middlewares/authenticate'
import { createTodo, deleteTodo, getAllTodo, singleTodo, singleTodoFromPrams, singleUserGetAllTodo } from './postController'


const todoRoute = express.Router()

todoRoute.post('/createTodo', authenticate, createTodo)
todoRoute.get('/allTodos', getAllTodo)
todoRoute.get('/usersTodo', authenticate, singleUserGetAllTodo)
todoRoute.get('/singleTodo', authenticate, singleTodo)
todoRoute.get('/:id', singleTodoFromPrams)
todoRoute.delete('/delete', deleteTodo)


export default todoRoute