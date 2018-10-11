import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { CONFIG } from '../../shared/helper/config';
import { BaseController, iCRUDController } from '../../shared/base/base.controller';
import { BaseResponse } from '../../shared/base/base.response';

export default class UserController extends BaseController implements iCRUDController {

	/**
	 * Lấy danh sách User từ hệ thống
	 * @param req
	 * @param res
	 */
	async list(req: Request, res: Response): Promise<void> {
		// Get condition for query
		let condition: any = res.locals.condition;
		let page: number = res.locals.page;
		let ppp: number = res.locals.ppp;
		let skip: number = (page - 1) * ppp;
		let sort: any = res.locals.sort;

		// Query from database
		try {
			let data = await User.find(condition).limit(ppp).skip(skip).sort(sort);
			let count = await User.countDocuments(condition);
			return BaseResponse.success(req, res, data, count);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Thêm mới một User vào hệ thống
	 * @param req
	 * @param res
	 */
	async create(req: Request, res: Response): Promise<void> {
		// Get data from body
		let userData: any = {
			name: req.body.name,
			pwd: req.body.pwd,
			phone: req.body.phone,
			email: req.body.email
		};

		// Insert to database
		try {
			let data = await new User(userData).save();
			return BaseResponse.success(req, res, data);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Cập nhật User vào hệ thống
	 * @param req
	 * @param res
	 */
	async update(req: Request, res: Response): Promise<void> {
		// Get condition
		let condition: object = {
			_id: req.params.userId,
			isDeleted: false
		};

		// Get data from body
		let userData: any = {
			name: req.body.name,
			pwd: req.body.pwd,
			phone: req.body.phone,
			email: req.body.email
		};

		// Update data to database
		try {
			let data = await User.findOneAndUpdate(condition, userData, CONFIG.MONGO.OPTIONS);
			return BaseResponse.success(req, res, data);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Xem chi tiết một User dựa vào userId
	 * @param req
	 * @param res
	 */
	async detail(req: Request, res: Response): Promise<void> {
		// Get condition
		let condition: object = {
			_id: req.params.userId,
			isDeleted: false
		};

		// Query data from database
		try {
			let data = await User.findOne(condition);
			return BaseResponse.success(req, res, data);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Xóa một User khõi hệ thống (Soft delete)
	 * @param req
	 * @param res
	 */
	async delete(req: Request, res: Response): Promise<void> {
		// Get condition
		let condition: any = {
			_id: req.params.userId,
			isDeleted: false
		};

		// Set data for deleting
		let userData: any = {
			isDeleted: true,
			status: 'disabled'
		};

		// Update data to database
		try {
			let data = await User.findOneAndUpdate(condition, userData, CONFIG.MONGO.OPTIONS);
			return BaseResponse.success(req, res, data);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Cập nhật trạng thái User vào hệ thống
	 * @param req
	 * @param res
	 */
	async patch(req: Request, res: Response): Promise<void> {
		// get condition
		let condition: any = {
			_id: req.params.userId,
			isDeleted: false
		};

		// get params data
		let patch = req.params.patch;
		let userData: any = {};
		userData[patch] = req.params.value;

		// Update data to database
		try {
			let data = await User.findOneAndUpdate(condition, userData, CONFIG.MONGO.OPTIONS);
			return BaseResponse.success(req, res, data);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}
}