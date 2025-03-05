import mongoose, { Schema, Document } from 'mongoose';
import IProduct from '../interfaces/product.interface';

export interface IProductDocument extends IProduct, Document {}

const ProductSchema: Schema = new Schema<IProductDocument>({
  idProduct: { type: String, unique: true },
  name: { type: String, required: true, },
  price: { type: Number, required: true, },
  category: { type: String, required: true, },
  
},{ collection: 'product' });

export default mongoose.model<IProductDocument>('Product', ProductSchema);
