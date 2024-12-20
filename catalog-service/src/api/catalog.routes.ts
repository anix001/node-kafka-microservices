import { error } from 'console';
import { CreateProductRequest } from '../dto/product.dto';
import { CatalogRepository } from '../repository/catalog.repository';
import { RequestValidator } from '../utils/requestValidator';
import { CatalogService } from './../services/catalog.service';
import express, { Request, Response, NextFunction, Router } from "express";

const router:Router = express.Router();

export const catalogService = new CatalogService(new CatalogRepository());

//endpoints
router.post("/products",async(req:Request, res:Response, next:NextFunction)=>{
  try{
    const {errors, input} = await RequestValidator(CreateProductRequest, req.body); 
  
    if(errors) return res.status(400).json(errors);
  
    const data = await catalogService.createProduct(input);
    return res.status(201).json(data);
  }catch(error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

export default router;