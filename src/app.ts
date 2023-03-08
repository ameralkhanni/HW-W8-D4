import express,{Application,Request,Response} from 'express';
import userRouter from './routes/user.routre';
import * as dotenv from 'dotenv';
dotenv.config();

const app:Application = express();
const port = process.env.PORT || 3004;

app.use(express.json());

app.use('/users',userRouter);

app.listen(port, ()=>{
    console.log(`Application running on port ${port}`)
});