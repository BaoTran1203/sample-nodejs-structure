import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../helper/config';
import { BaseResponse } from './base.response';
import { User } from '../../app/models/user.model';

export interface iAuthMiddleware {
	checkRegister(req: Request, res: Response, next: any): Promise<void>;

	checkLogin(req: Request, res: Response, next: any): Promise<void>;

	checkPassword(req: Request, res: Response, next: any): Promise<void>;
}

export interface iCRUDMiddleware {
	search(req: Request, res: Response, next: any): Promise<void>;

	verify(req: Request, res: Response, next: any): Promise<void>;

	status(req: Request, res: Response, next: any): Promise<void>;
}

export class BaseMiddleware {
	constructor() { }

	/**
	 * Xác thực mã token
	 */
	async token(req: Request, res: Response, next: any): Promise<void> {
		const header: string = String(req.headers['authorization']) || '';
		const auth: string[] = header.replace(`Bearer `, '').split(' ');

		let secretCode = auth[0];
		let token = auth[1];

		try {
			let authData: any = await jwt.verify(token, secretCode);
			let userId = authData.data;
			let loggedUser: any = await User.findOne({ _id: userId, isDeleted: false });

			if (!loggedUser) {
				return BaseResponse.error(req, res, { name: 'NoContent' });
			}

			if (loggedUser.status === 'disabled') {
				return BaseResponse.error(req, res, { name: 'BlockAccount' });
			}

			// PASS value to another class (Middleware, Controller)
			// Example: res.locals.any = any
			res.locals.secretCode = secretCode;
			res.locals.token = token;
			res.locals.loggedUser = loggedUser;
			next();
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}
}