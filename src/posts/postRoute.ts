import express from 'express'
import authenticate from '../middlewares/authenticate'
import { createTodo, deleteTodo, getAllTodo, singleTodo, singleTodoFromPrams, singleUserGetAllTodo, updateTodo } from './postController'


const todoRoute = express.Router()

todoRoute.post('/createTodo', authenticate, createTodo)
todoRoute.get('/allTodos', getAllTodo)
todoRoute.get('/usersTodo', authenticate, singleUserGetAllTodo)
todoRoute.post('/singleTodo', authenticate, singleTodo)
todoRoute.get('/:id', authenticate, singleTodoFromPrams)
todoRoute.delete('/delete', authenticate, deleteTodo)
todoRoute.patch('/update', authenticate, updateTodo)


export default todoRoute