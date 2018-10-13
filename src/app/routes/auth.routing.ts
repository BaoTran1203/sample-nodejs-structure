import express from 'express';
import AuthController from '../controllers/auth.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

export default class AuthRouting {
    constructor(app: express.Application) {
        // Declare auth Middleware
        let authMiddleware: AuthMiddleware = new AuthMiddleware();
        let token = authMiddleware.token;
        let checkRegister = authMiddleware.checkRegister;
        let checkLogin = authMiddleware.checkLogin;
        let checkForgot = authMiddleware.checkForgot;
        let checkReset = authMiddleware.checkReset;
        let checkPassword = authMiddleware.checkPassword;

        // Declare auth controller
        let authController: AuthController = new AuthController();
        let register = authController.register;
        let login = authController.login;
        let logout = authController.logout;
        let forgot = authController.forgot;
        let reset = authController.reset;
        let password = authController.password;
        let profile = authController.profile;

        // [GET] Register account
        app.route('/v1/register').post(checkRegister, register);

        // [POST] Login to system
        app.route('/v1/login').post(checkLogin, login);

        // [GET] Logout from system
        app.route('/v1/logout').get(token, logout);

        // [POST] Request when forgot password
        app.route('/v1/forgot').post(checkForgot, forgot);

        // [POST] Reset new password
        app.route('/v1/reset').put(checkReset, reset);

        // [POST] Change password's profile
        app.route('/v1/password').put(token, checkPassword, password);

        // [GET] Get profile
        app.route('/v1/profile').get(token, profile);

        // [POST] Update profile
        app.route('/v1/profile').put(token, profile);
    }
}