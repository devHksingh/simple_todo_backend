import express, { Request, Response, NextFunction } from 'express'
import { config } from './config/config';
import cors from 'cors'
import userRouter from './user/userRoute'
import globalErrorHandler from './middlewares/globalErrorHandler';
import todoRoute from './posts/postRoute';
// import globalErrorHandler from './middlewares/globalErrorHandler';
const app = express()

// app.use(
//     cors({
//         origin: config.frontendDomain
//     })
// )

app.use(cors())

console.log("frontendDomain",config.frontendDomain);

const port = config.port || 3000

// console.log(config.port);


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Welcome to todo server" })
})

// router

app.use('/api/users', userRouter)
app.use('/api/todo', todoRoute)

//  Global error handler
app.use(globalErrorHandler)


app.listen(port, () => {
    console.log(`Sever is running on port ${port}`)
})