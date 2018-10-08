import express from 'express';
import ProductController from '../controllers/product.controller';
import ProductMiddleware from '../middlewares/product.middleware';

export default class ProductRouting {
    constructor(app: express.Application) {
        // Declare base middleware
        let productMiddleware: ProductMiddleware = new ProductMiddleware();
        let token = productMiddleware.token;
        let search = productMiddleware.search;
        let verify = productMiddleware.verify;

        // Declare base controller
        let productController: ProductController = new ProductController();
        let list = productController.list;
        let create = productController.create;
        let update = productController.update;
        let detail = productController.detail;
        let _delete = productController.delete;
        let patch = productController.patch;

        // [GET] Get list Products
        app.route('/v1/products').get(token, search, list);

        // [POST] Add new Product
        app.route('/v1/product').post(token, verify, create);

        // [PUT] Update Product
        app.route('/v1/product/:productId').put(token, verify, update);

        // [GET] Get detail Product
        app.route('/v1/product/:productId').get(token, detail);

        // [DELETE] Delete Product
        app.route('/v1/product/:productId').delete(token, _delete);

        // [PATCH] Update status Product
        app.route('/v1/product/:productId/:patch/:value').patch(token, patch);

        // [GET] Update status Product
        app.route('/v1/product/:productId/wishlist/:status').get(token, productMiddleware.wishlist, productController.wishlist);
    }
}