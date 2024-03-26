import express, { Application, NextFunction, Request, Response } from  'express';
import cors from  'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser  from 'cookie-parser'
import httpStatus from 'http-status';
const app:Application = express();  

app.use(cookieParser())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api/v1', router);

app.get("/", (req, res) => {
    return res.send({
        data:"server running"
    })
})
app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus .NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
})

export default app;