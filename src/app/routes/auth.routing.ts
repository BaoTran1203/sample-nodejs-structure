import express from 'express';
import AuthController from '../controllers/auth.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

export default class AuthRouting {
    constructor(app: express.Application) {
        let authController: AuthController = new AuthController();
        let authMiddleware: AuthMiddleware = new AuthMiddleware();

        // [GET] Register account
        app.route('/v1/register').post(authMiddleware.checkRegister, authController.register);

        // [POST] Login to system
        app.route('/v1/login').post(authMiddleware.checkLogin, authController.login);

        // [GET] Logout from system
        app.route('/v1/logout').get(authMiddleware.token, authController.logout);

        // [POST] Request when forgot password
        app.route('/v1/forgot').post(authMiddleware.token, authController.forgot);

        // [POST] Reset new password
        app.route('/v1/reset').post(authMiddleware.token, authController.reset);

        // [POST] Change password's profile
        app.route('/v1/password').post(authMiddleware.token, authMiddleware.checkPassword, authController.password);

        // [GET] Get profile
        app.route('/v1/profile').get(authMiddleware.token, authController.profile);

        // [POST] Update profile
        app.route('/v1/profile').post(authMiddleware.token, authController.profile);
    }
}