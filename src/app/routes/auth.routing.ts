import express from 'express';
import AuthController from '../controllers/auth.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

export default class AuthRouting {
    constructor(app: express.Application) {
        let authController: AuthController = new AuthController();
        let authMiddleware: AuthMiddleware = new AuthMiddleware();

        // [GET] Get list Posts
        app.route('/v1/register').post(authMiddleware.checkRegister, authController.register);

        // [POST] Add new Post
        app.route('/v1/login').post(authMiddleware.checkLogin, authController.login);

        // [PUT] Update Post
        app.route('/v1/password').post(authMiddleware.token, authMiddleware.checkPassword, authController.password);

        // [GET] Get detail Post
        app.route('/v1/profile').get(authMiddleware.token, authController.profile);

        // [POST] Add new Post
        app.route('/v1/logout').get(authMiddleware.token, authController.logout);
    }
}