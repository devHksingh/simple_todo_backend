// import { createUser } from "./userController";
import authenticate from '../middlewares/authenticate'
import { createUser, getUserProfile, loginUser, test } from './userController'
import express from 'express'

const userRoute = express.Router()


// userRoute.post('/register',createUser)
userRoute.post("/register", createUser)
userRoute.post("/login", loginUser)
userRoute.post('/test', authenticate, test)
userRoute.post('/userProfile', authenticate, getUserProfile)

export default userRoute