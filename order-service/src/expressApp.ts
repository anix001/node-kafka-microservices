import express, { Express, Request, Response, NextFunction} from "express";
import cors from 'cors';
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";

const app:Express = express();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use(cartRoutes);
app.use(orderRoutes);

app.use("/",  (req:Request, res:Response, _:NextFunction)=>{
   return res.status(200).json({message: "health is up!"});
})

export default app;