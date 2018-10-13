import { Request, Response } from 'express';
import { BaseMiddleware, iAuthMiddleware } from '../../shared/base/base.middleware';
import { BaseResponse } from '../../shared/base/base.response';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

export default class AuthMiddleware extends BaseMiddleware implements iAuthMiddleware {

    /**
     * Kiểm tra thông tin đăng ký tài khoản
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
     * Kiểm tra thông tin đăng nhập
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
     * Kiểm tra thông tin mật khẩu
     * @param req 
     * @param res 
     * @param next 
     */
    async checkPassword(req: Request, res: Response, next: any): Promise<void> {
        try {
            if (!req.body.old_password) {
                return BaseResponse.error(req, res, 'Vui lòng nhập mật khẩu cũ.');
            }
    
            let loggedUser: any = res.locals.loggedUser;
            if (!bcrypt.compareSync(req.body.old_password, loggedUser.hash_password)) {
                return BaseResponse.error(req, res, { name: 'WrongPassword' });
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

            next();
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }

    /**
     * Kiểm tra thông tin yêu cầu quên mật khẩu
     * @param req 
     * @param res 
     * @param next 
     */
    async checkForgot(req: Request, res: Response, next: any): Promise<void> {
        try {
            if (!req.body.email) {
                return BaseResponse.error(req, res, 'Vui lòng nhập email.');
            }

            let user: any = await User.findOne({ email: req.body.email, isDeleted: false });
            // TODO check status account (permission, role, status...)

            if (!user) {
                return BaseResponse.error(req, res, { name: 'AccountNotExist' });
            }

            res.locals.user = user;
            next();
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }

    /**
     * Kiểm tra thông tin khôi phục mật khẩu
     * @param req 
     * @param res 
     * @param next 
     */
    async checkReset(req: Request, res: Response, next: any): Promise<void> {
        try {
            // Check exist email
            if (!req.body.email) {
                return BaseResponse.error(req, res, 'Vui lòng nhập email.');
            }

            let user: any = await User.findOne({ email: req.body.email, isDeleted: false });

            if (!user) {
                return BaseResponse.error(req, res, { name: 'AccountNotExist' });
            }

            // Check Access Code
            if (!req.body.accessCode) {
                return BaseResponse.error(req, res, 'Vui lòng nhập mã truy cập.');
            }

            if (user.accessCode !== req.body.accessCode) {
                return BaseResponse.error(req, res, 'Mã truy cập không hợp lệ.');
            }

            // Check password
            if (!req.body.new_password) {
                return BaseResponse.error(req, res, 'Vui lòng nhập mật khẩu mới.');
            }

            if (!req.body.confirm_password) {
                return BaseResponse.error(req, res, 'Vui lòng nhập xác nhận mật khẩu.');
            }

            if (req.body.new_password !== req.body.confirm_password) {
                return BaseResponse.error(req, res, 'Mật khẩu xác nhận không đúng. Vui lòng nhập lại.');
            }

            res.locals.user = user;
            res.locals.password = req.body.new_password;
            next();
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }
}