import { error } from 'console';
import { CreateProductRequest, UpdateProductRequest } from '../dto/product.dto';
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

router.patch("/products/:id",async(req:Request, res:Response, next:NextFunction)=>{
  try{
    const {errors, input} = await RequestValidator(UpdateProductRequest, req.body); 

    const id = parseInt(req.params.id) || 0; 
  
    if(errors) return res.status(400).json(errors);
  
    const data = await catalogService.updateProduct({id, ...input});
    return res.status(200).json(data);
  }catch(error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});


router.get("/products",async(req:Request, res:Response, next:NextFunction)=>{
  const limit = Number(req.query["limit"]) || 10;
  const offset = Number(req.query["offset"]) || 0;
  try{      
    const data = await catalogService.getProducts(limit, offset);
    return res.status(200).json(data);
  }catch(error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

router.get("/products/:id",async(req:Request, res:Response, next:NextFunction)=>{
  try{
    const id = parseInt(req.params.id) || 0; 
    const data = await catalogService.getProduct(id);
    return res.status(200).json(data);
  }catch(error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

router.delete("/products/:id",async(req:Request, res:Response, next:NextFunction)=>{
  try{
    const id = parseInt(req.params.id) || 0; 
    const data = await catalogService.deleteProduct(id);
    return res.status(200).json(data);
  }catch(error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});



export default router;