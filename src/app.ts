import express, { Application } from  'express';
import cors from  'cors';

const app:Application = express();  

app.use(cors());


app.get("/", (req, res) => {
    return res.send({
        data:"server running"
    })
})

export default app;