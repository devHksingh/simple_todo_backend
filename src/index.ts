import express, { Request, Response, NextFunction } from 'express'
import { config } from './config/config';
import cors from 'cors'
const app = express()

app.use(
    cors({
        origin:config.frontendDomain
    })
)

const port = config.port || 3000

console.log(config.port);


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Welcome to todo server" })
})

app.listen(port, () => {
    console.log(`Sever is running on port ${port}`)
})