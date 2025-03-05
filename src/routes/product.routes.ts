import { Router } from "express";
import ProductController from "../controllers/product.controller";


const productCtrl = new ProductController()

const productRouter = Router()

productRouter.post('/createProduct', productCtrl.createProduct.bind(productCtrl))

productRouter.get('/getProducts', productCtrl.getProduct.bind(productCtrl))

productRouter.get('/getProductById/:idProduct', productCtrl.getProductById.bind(productCtrl))

productRouter.put('/updateProduct/:idProduct', productCtrl.updateProduct.bind(productCtrl))

productRouter.delete('/deleteProduct/:idProduct', productCtrl.deleteProduct.bind(productCtrl))

export default productRouter