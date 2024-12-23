import request from "supertest";
import express from "express";
import { faker } from "@faker-js/faker";
import catalogRoutes , {catalogService} from "../catalog.routes";
import { ProductFactory } from "../../utils/fixtures";

const app = express();
app.use(express.json());
app.use(catalogRoutes);

const mockRequest = () => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 10, max: 100 }),
    price: +faker.commerce.price(),
  };
};


describe("Catalog Routes", () => {

   describe("POST/products", ()=>{

     test("should create product successfully", async()=>{
        const requestBody = mockRequest();
        const product = ProductFactory.build();

        //creating mock implementation
       jest.spyOn(catalogService,"createProduct")
       .mockImplementationOnce(()=> Promise.resolve(product));

        const response = await request(app) //setting app environment
                    .post("/products")
                    .send(requestBody)
                    .set("Accepted", "application/json");
         
        // console.log("Test response", response);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(product);
     });

     test("should response with validation error 400", async()=>{
        const requestBody = mockRequest();

        const response = await request(app) //setting app environment
                    .post("/products")
                    .send({...requestBody, name:""})
                    .set("Accepted", "application/json");
         

        expect(response.status).toBe(400);
        expect(response.body).toEqual("name should not be empty");
     })

     test("should response with an internal error code 500", async()=>{
        const requestBody = mockRequest();

        //creating mock implementation
       jest.spyOn(catalogService,"createProduct")
       .mockImplementationOnce(()=> Promise.reject(new Error("error occurred on create product")));

        const response = await request(app) //setting app environment
                    .post("/products")
                    .send(requestBody)
                    .set("Accepted", "application/json");
         
        // console.log("Test response", response);

        expect(response.status).toBe(500);
        expect(response.body).toEqual("error occurred on create product");
     });

   });

   
   describe("PATCH/products/:id", ()=>{

      test("should update product successfully", async()=>{
         const product = ProductFactory.build();
         const requestBody ={
            name: product.name,
            price: product.price,
            stock: product.stock
         }
 
         //creating mock implementation
        jest.spyOn(catalogService,"updateProduct")
        .mockImplementationOnce(()=> Promise.resolve(product));
 
         const response = await request(app) //setting app environment
                     .patch(`/products/${product.id}`)
                     .send(requestBody)
                     .set("Accepted", "application/json");
          
         // console.log("Test response", response);
 
         expect(response.status).toBe(200);
         expect(response.body).toEqual(product);
      });
 
      test("should response with validation error 400", async()=>{
         const product = ProductFactory.build();
         const requestBody ={
            name: product.name,
            price: -1,
            stock: product.stock
         }
 
         const response = await request(app) //setting app environment
                     .patch(`/products/${product.id}`)
                     .send({...requestBody})
                     .set("Accepted", "application/json");
          
 
         expect(response.status).toBe(400);
         expect(response.body).toEqual("price must not be less than 1");
      })
 
      test("should response with an internal error code 500", async()=>{
         const product = ProductFactory.build();
         const requestBody ={
            name: product.name,
            price: product.price,
            stock: product.stock
         }
 
         //creating mock implementation
        jest.spyOn(catalogService,"updateProduct")
        .mockImplementationOnce(()=> Promise.reject(new Error("error occurred on update product")));
 
         const response = await request(app) //setting app environment
                     .patch(`/products/${product.id}`)
                     .send(requestBody)
                     .set("Accepted", "application/json");
          
         // console.log("Test response", response);
 
         expect(response.status).toBe(500);
         expect(response.body).toEqual("error occurred on update product");
      });
 
   });
   

   describe("GET/products?limit=0&offset=0", ()=>{

      test("should return a range of products based on limit and offset", async()=>{
         const randomLimit = faker.number.int({min:10, max:50});
         const products = ProductFactory.buildList(randomLimit);
 
         //creating mock implementation
        jest.spyOn(catalogService,"getProducts")
        .mockImplementationOnce(()=> Promise.resolve(products));
 
         const response = await request(app) //setting app environment
                     .get(`/products?limit=${randomLimit}&offset=0`)
                     .set("Accepted", "application/json");
           
         expect(response.status).toBe(200);
         expect(response.body).toEqual(products);
      });
 
      test("should response with limit must be greater than 0", async()=>{

         jest.spyOn(catalogService,"getProducts")
         .mockImplementationOnce(()=> Promise.reject(new Error("Limit must not be less than 1")));

         const response = await request(app) //setting app environment
                     .get(`/products?limit=0&offset=0`)
                     .set("Accepted", "application/json");
          
 
         expect(response.status).toBe(500);
         expect(response.body).toEqual("Limit must not be less than 1");
      })
 
   });

   describe("GET/products/:id", ()=>{

      test("should get single product by id successfully", async()=>{
         const product = ProductFactory.build();
 
         //creating mock implementation
        jest.spyOn(catalogService,"getProduct")
        .mockImplementationOnce(()=> Promise.resolve(product));
 
         const response = await request(app) //setting app environment
                     .get(`/products/${product.id}`)
                     .set("Accepted", "application/json");
          
         // console.log("Test response", response);
 
         expect(response.status).toBe(200);
         expect(response.body).toEqual(product);
      });
 
      test("should response with an internal error code 500", async()=>{
         const product = ProductFactory.build();

         //creating mock implementation
        jest.spyOn(catalogService,"getProduct")
        .mockImplementationOnce(()=> Promise.reject(new Error("error while get product")));
 
         const response = await request(app) //setting app environment
                     .get(`/products/${product.id}`)
                     .set("Accepted", "application/json");
          
         expect(response.status).toBe(500);
         expect(response.body).toEqual("error while get product");
      });
 
   });

   describe("DELETE/products/:id", ()=>{

      test("should delete single product by id successfully", async()=>{
         const product = ProductFactory.build();
 
         //creating mock implementation
        jest.spyOn(catalogService, "deleteProduct")
        .mockImplementationOnce(()=> Promise.resolve({id: product.id!}));
 
         const response = await request(app) //setting app environment
                     .delete(`/products/${product.id}`)
                     .set("Accepted", "application/json");
          
         // console.log("Test response", response);
 
         expect(response.status).toBe(200);
         expect(response.body).toEqual({id:product.id});
      });
 
      test("should response with an internal error code 500", async()=>{
         const product = ProductFactory.build();

         //creating mock implementation
        jest.spyOn(catalogService,"deleteProduct")
        .mockImplementationOnce(()=> Promise.reject(new Error("error while delete product")));
 
         const response = await request(app) //setting app environment
                     .delete(`/products/${product.id}`)
                     .set("Accepted", "application/json");
          
         expect(response.status).toBe(500);
         expect(response.body).toEqual("error while delete product");
      });
 
   });

});