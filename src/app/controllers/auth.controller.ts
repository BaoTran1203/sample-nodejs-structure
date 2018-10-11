import { Common } from './../../shared/helper/common';
import { BaseController, iAuthController } from './../../shared/base/base.controller';
import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { CONFIG } from '../../shared/helper/config';
import { BaseResponse } from '../../shared/base/base.response';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthController extends BaseController implements iAuthController {

    /**
     * Đăng ký tài khoản vào hệ thống
     * @param req 
     * @param res 
     */
    async register(req: Request, res: Response): Promise<void> {
        let userData: any = {
            fullName: req.body.fullName,
            hash_password: bcrypt.hashSync(req.body.password, 12),
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar
        }

        try {
            await new User(userData).save();
            return BaseResponse.success(req, res, 'Đăng ký tài khoản thành công.');
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }

    /**
	 * Đăng nhập vào hệ thống
	 * @param req
	 * @param res
	 */
    async login(req: Request, res: Response): Promise<void> {
        try {
            let user: any = await User.findOne({
                email: req.body.email,
                isDeleted: false
            });

            if (!user) {
                return BaseResponse.error(req, res, { name: 'AccountNotExist' });
            }

            if (!bcrypt.compareSync(req.body.password, user.hash_password)) {
                return BaseResponse.error(req, res, { name: 'WrongPassword' });
            }

            // Create secret code
            let secretCode = Common.generateCode();
            await User.findByIdAndUpdate(user._id, { secretCode: secretCode });

            // Sign token
            let token = await jwt.sign({ data: user._id.toString() }, secretCode, CONFIG.JWT.OPTIONS);

            return res.status(200).json({
                status: true,
                code: 200,
                msg: 'Đăng nhập thành công vào hệ thống.',
                token: token,
                secretCode: secretCode,
                data: user
            }).end();
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }

    /**
     * Đổi mật khẩu tài khoản
     * @param req 
     * @param res 
     */
    async password(req: Request, res: Response): Promise<void> {
        let userData: any = {
            hash_password: bcrypt.hashSync(req.body.new_password, 12),
        }

        try {
            let loggedUser: any = res.locals.loggedUser;
            await User.findByIdAndUpdate(loggedUser._id, userData);
            return BaseResponse.success(req, res, 'Đổi mật khẩu thành công.');
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }

    /**
     * Lấy thông tin chi tiết tài khoản
     * @param req 
     * @param res 
     */
    async profile(req: Request, res: Response): Promise<void> {
        let loggedUser: any = res.locals.loggedUser;
        return BaseResponse.success(req, res, loggedUser);
    }

    /**
     * Đăng xuất khõi hệ thống
     * @param req 
     * @param res 
     */
    async logout(req: Request, res: Response): Promise<void> {
        try {
            // Remove Secret Code
            let loggedUser: any = res.locals.loggedUser;
            await User.findByIdAndUpdate(loggedUser._id, { secretCode: '' });
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }

        return BaseResponse.success(req, res, 'Đăng xuất thành công.');
    }

    /**
     * Lấy thông tin chi tiết tài khoản
     * @param req 
     * @param res 
     */
    async forgot(req: Request, res: Response): Promise<void> {
        let loggedUser: any = res.locals.loggedUser;
        return BaseResponse.success(req, res, loggedUser);
    }

    /**
     * Lấy thông tin chi tiết tài khoản
     * @param req 
     * @param res 
     */
    async reset(req: Request, res: Response): Promise<void> {
        let loggedUser: any = res.locals.loggedUser;
        return BaseResponse.success(req, res, loggedUser);
    }
}