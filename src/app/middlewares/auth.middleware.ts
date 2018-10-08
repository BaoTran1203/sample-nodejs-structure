import { Request, Response } from 'express';
import { BaseMiddleware, iAuthMiddleware } from '../../shared/base/base.middleware';
import { BaseResponse } from '../../shared/base/base.response';
import bcrypt from 'bcrypt';

export default class AuthMiddleware extends BaseMiddleware implements iAuthMiddleware {

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    async checkRegister(req: Request, res: Response, next: any): Promise<void> {
        if (!req.body.password) {
            return BaseResponse.error(req, res, 'Vui lòng nhập mật khẩu.');
        }

        if (!req.body.confirm_password) {
            return BaseResponse.error(req, res, 'Vui lòng nhập xác nhận mật khẩu.');
        }

        if (req.body.password !== req.body.confirm_password) {
            return BaseResponse.error(req, res, 'Mật khẩu xác nhận không đúng. Vui lòng nhập lại.');
        }

        next();
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    async checkLogin(req: Request, res: Response, next: any): Promise<void> {
        if (!req.body.email) {
            return BaseResponse.error(req, res, 'Vui lòng nhập email.');
        }

        if (!req.body.password) {
            return BaseResponse.error(req, res, 'Vui lòng nhập mật khẩu.');
        }

        next();
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    async checkPassword(req: Request, res: Response, next: any): Promise<void> {
        if (!req.body.old_password) {
            return BaseResponse.error(req, res, 'Vui lòng nhập mật khẩu cũ.');
        }

        if (!req.body.new_password) {
            return BaseResponse.error(req, res, 'Vui lòng nhập mật khẩu mới.');
        }

        if (!req.body.confirm_password) {
            return BaseResponse.error(req, res, 'Vui lòng nhập xác nhận mật khẩu.');
        }

        if (req.body.new_password !== req.body.confirm_password) {
            return BaseResponse.error(req, res, 'Mật khẩu xác nhận không đúng. Vui lòng nhập lại.');
        }

        if (req.body.old_password === req.body.new_password) {
            return BaseResponse.error(req, res, 'Mật khẩu mới giống với mật khẩu cũ. Vui lòng nhập lại.');
        }

        try {
            let loggedUser: any = res.locals.loggedUser;
            if (!bcrypt.compareSync(req.body.old_password, loggedUser.hash_password)) {
                return BaseResponse.error(req, res, { name: 'WrongPassword' });
            }
            next();
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }
}