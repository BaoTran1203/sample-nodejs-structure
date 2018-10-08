import express from 'express';
import CategoryController from '../controllers/category.controller';
import CategoryMiddleware from '../middlewares/category.middleware';

export default class CategoryRouting {
	constructor(app: express.Application) {
		// Declare Middleware
		let categoryMiddleware: CategoryMiddleware = new CategoryMiddleware();
		let token = categoryMiddleware.token;
		let search = categoryMiddleware.search;
		let verify = categoryMiddleware.verify;
		let status = categoryMiddleware.status;

		// Declare base controller
		let categoryController: CategoryController = new CategoryController();
		let list = categoryController.list;
		let create = categoryController.create;
		let update = categoryController.update;
		let detail = categoryController.detail;
		let _delete = categoryController.delete;
		let patch = categoryController.patch;

		// [GET] Get list Categorys
		app.route('/v1/categories').get(token, search, list);

		// [POST] Add new Category
		app.route('/v1/category').post(token, verify, create);

		// [PUT] Update Category
		app.route('/v1/category/:categoryId').put(token, verify, update);

		// [GET] Get detail Category
		app.route('/v1/category/:categoryId').get(token, detail);

		// [DELETE] Delete Category
		app.route('/v1/category/:categoryId').delete(token, _delete);

		// [PATCH] Update status Category
		app.route('/v1/category/:categoryId/:patch/:value').patch(token, status, patch);
	}
}