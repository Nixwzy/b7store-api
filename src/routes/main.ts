import { Router } from 'express';
import * as bannerController from '../controllers/banner.js';
import * as productController from '../controllers/product.js';
import * as categoryController from '../controllers/category.js';
import * as cartController from '../controllers/cart.js';
import * as userController from '../controllers/user.js';



export const routes = Router();

routes.get('/ping', (req, res) => {
  res.json({ pong: true });
});

routes.get('/banners', bannerController.getBanners);
routes.get('/products', productController.getProducts);
routes.get('/product/:id', productController.getOneProduct);
routes.get('/product/:id/related', productController.getRelatedProducts);
routes.get('/category/:slug/metadata', categoryController.getCategoryWithMetadata);
routes.get('/cart/shipping', cartController.getShipping);

routes.post('/cart/mount', cartController.cartMount);
routes.post('/user/register', userController.register);

