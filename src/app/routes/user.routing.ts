import express from 'express';
import UserController from '../controllers/user.controller';
import UserMiddleware from '../middlewares/user.middleware';

export default class UserRouting {
	constructor(app: express.Application) {
		// Declare Middleware
		let userMiddleware: UserMiddleware = new UserMiddleware();
		let token = userMiddleware.token;
		let search = userMiddleware.search;
		let verify = userMiddleware.verify;

		// Declare base controller
		let userController: UserController = new UserController();
		let list = userController.list;
		let create = userController.create;
		let update = userController.update;
		let detail = userController.detail;
		let _delete = userController.delete;
		let patch = userController.patch;

		// [GET] Get list Posts
		app.route('/v1/users').get(token, search, list);

		// [POST] Add new Post
		app.route('/v1/user').post(token, verify, create);

		// [PUT] Update Post
		app.route('/v1/user/:userId').put(token, update);

		// [GET] Get detail Post
		app.route('/v1/user/:userId').get(token, detail);

		// [DELETE] Delete Post
		app.route('/v1/user/:userId').delete(token, _delete);

		// [PATCH] Update status Post
		app.route('/v1/user/:userId/:patch/:value').patch(token, patch);

		// [GET] Get user's wishlist product
		app.route('/v1/user/:userId').get(token, detail);
	}
}