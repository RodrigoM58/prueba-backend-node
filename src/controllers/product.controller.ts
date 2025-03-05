import logger from "../../lib/logger"
import IUser from "../interfaces/product.interface"
import Product from "../models/product.model"
import { Request, Response } from 'express'
import { ResponseHelper } from "../helpers/response.helper"
import { v4 as uuidv4 } from 'uuid'
import IProduct from "../interfaces/product.interface"

export default class ProductController {

    async createProduct( req: Request, res: Response ): Promise<any> {
        const product: IProduct = req.body

        try {
            if( !product ) {
                return ResponseHelper.error(res, 'Datos incompletos', null, 400)
            }
            product.idProduct = uuidv4()

            const productCreated = await Product.create(product)

            return ResponseHelper.success(
                res,
                'Producto creado con éxito',
                productCreated,
                201
            )

        } catch( err: any ) {
            logger.error(`[ProductController|createProduct]: ${err}`)
            return ResponseHelper.error(res, 'Ocurrió un error', err.message, 500)
        }
    }

    async getProduct(req: Request, res: Response): Promise<any> {
        try {
            const productFound = await Product.find({
                $and: []
            }, { idProduct: 1, name: 1,  price: 1, category: 1 ,_id: 0 })
            
            if ( productFound.length >= 1 ) {
                return ResponseHelper.success(
                    res,
                    'Productos encontrados',
                    productFound,
                    200
                )
            }
            
            return ResponseHelper.error(res, 'Productos no encontrados', null, 404)
        } catch( err: any ) {
            logger.error(`[ProductController|getProduct]: ${err.message}`);
            return ResponseHelper.error(res, 'Ocurrió un error', err.message, 500)
        }
    }

    async getProductById(req: Request, res: Response): Promise<any> {
        try {
            const idProduct = req.params.idProduct

            const product = await Product.findOne({idProduct}, { idProduct: 1, name: 1,  price: 1, category: 1, _id: 0 })

            if (!product) {
                return ResponseHelper.error(res, "Producto no encontrado", null, 404)
            }

            return ResponseHelper.success(res, "Producto encontrado", product, 200)
        } catch (err: any) {
            logger.error(`[ProductController|getProductById]: ${err.message}`)
            return ResponseHelper.error(res, "Ocurrió un error", err.message, 500)
        }
    }

    async updateProduct(req: Request, res: Response): Promise<any> {
        try {
            const idProduct = req.params.idProduct
            const productData: IProduct = req.body;

            const updatedProduct = await Product.findOneAndUpdate({ idProduct }, productData)

            if (!updatedProduct) {
                return ResponseHelper.error(res, "Producto no actualizado o producto no encontrado", null, 404)
            }

            return ResponseHelper.success(res, "Producto actualizado con éxito", 200)
        } catch (err: any) {
            logger.error(`[ProductController|updateProduct]: ${err.message}`);
            return ResponseHelper.error(res, "Ocurrió un error", err.message, 500)
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<any> {
        try {
            const idProduct = req.params.idProduct

            const deletedProduct = await Product.findOneAndDelete({ idProduct })

            if (!deletedProduct) {
                return ResponseHelper.error(res, "El producto no existe o ya fue eliminado", null, 404)
            }

            return ResponseHelper.success(res, "Producto eliminado con éxito", {idProduct}, 200)
        } catch (err: any) {
            logger.error(`[ProductController|deleteProduct]: ${err.message}`);
            return ResponseHelper.error(res, "Ocurrió un error", err.message, 500)
        }
    }
}