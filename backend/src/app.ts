import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import { expectFailure } from "node:test";
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'
import skillRoutes from './routes/skillRoutes'
import profileRoutes from './routes/profileRoutes'


const app = express()

app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials: true
}))


app.use(express.json())
app.use(cookieParser())


app.use('/api/auth' , authRoutes)
app.use('/api/project' , projectRoutes)
app.use('/api/skill' , skillRoutes)
app.use('/api/profile' , profileRoutes)


app.get('/api', (req , res)=>{
res.status(200).json({
    success : true, 
    message : "API is running succesfully"
})
})


export default app;