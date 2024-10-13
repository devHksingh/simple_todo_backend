// import { createUser } from "./userController";
import {createUser} from './userController'
import express from  'express'

const userRoute = express.Router()


// userRoute.post('/register',createUser)
userRoute.post("/register",createUser)

export default userRoute