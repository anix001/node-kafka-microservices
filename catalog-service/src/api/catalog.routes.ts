import express, { Request, Response, NextFunction, Router } from "express";

const router:Router = express.Router();

//endpoints
router.post("/product",async(req:Request, res:Response, next:NextFunction)=>{
  return res.status(201).json({});
});

export default router;