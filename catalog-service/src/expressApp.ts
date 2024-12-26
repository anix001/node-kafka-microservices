import express, { Express } from "express";
import catalogRouter from "./api/catalog.routes";

const app:Express = express();

//middlewares
app.use(express.json());
app.use("/", catalogRouter);

export default app;