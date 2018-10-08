import { User } from './../models/user.model';
import { CONFIG } from '../../shared/helper/config';
import { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { BaseController, iCRUDController } from '../../shared/base/base.controller';
import { BaseResponse } from '../../shared/base/base.response';
import _remove from 'lodash/remove';
import _union from 'lodash/union';
import _ from 'lodash';

export default class ProductController extends BaseController implements iCRUDController {

	/**
	 * Lấy danh sách Product từ hệ thống
	 * @param req
	 * @param res
	 */
	async list(req: Request, res: Response): Promise<void> {
		// Get condition for query
		let condition: any = res.locals.condition;
		let page: number = res.locals.page;
		let ppp: number = res.locals.ppp;
		let sort: any = res.locals.sort;
		let skip: number = (page - 1) * ppp;

		// Query from database
		try {
			condition.category = { $ne: null };
			let data = await Product.find(condition).populate({
				path: 'category',
				match: { status: 'activated' },
				select: '-isDeleted -createdAt -updatedAt'
			}).limit(ppp).skip(skip).sort(sort);

			let count = await Product.countDocuments(condition);
			return BaseResponse.success(req, res, data, count);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Thêm mới một Product vào hệ thống
	 * @param req
	 * @param res
	 */
	async create(req: Request, res: Response): Promise<void> {
		// Get data from body
		let productData: any = {
			title: req.body.title,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			discount: req.body.discount,
			thumbnail: req.body.thumbnail
		};

		// Insert to database
		try {
			let data = await new Product(productData).save();
			return BaseResponse.success(req, res, data);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Cập nhật Product vào hệ thống
	 * @param req
	 * @param res
	 */
	async update(req: Request, res: Response): Promise<void> {
		// Get condition
		let condition: object = {
			_id: req.params.productId,
			isDeleted: false
		};

		// Get data from body
		let productData: any = {
			title: req.body.title,
			description: req.body.description,
			price: req.body.price,
			discount: req.body.discount,
			thumbnail: req.body.thumbnail
		};

		// Update data to database
		try {
			let data = await Product.findOneAndUpdate(condition, productData, CONFIG.MONGO.OPTIONS);
			return BaseResponse.success(req, res, data);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Xem chi tiết một Product dựa vào productId
	 * @param req
	 * @param res
	 */
	async detail(req: Request, res: Response): Promise<void> {
		// Get condition
		let condition: object = {
			_id: req.params.productId,
			isDeleted: false
		};

		// Query data from database
		try {
			let data = await Product.findOne(condition).populate('category');
			return BaseResponse.success(req, res, data);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Xóa một Product khõi hệ thống (Soft delete)
	 * @param req
	 * @param res
	 */
	async delete(req: Request, res: Response): Promise<void> {
		// Get condition
		let condition: any = {
			_id: req.params.productId,
			isDeleted: false
		};

		// Set data for deleting
		let productData: any = {
			isDeleted: true,
			status: 'disabled'
		};

		// Update data to database
		try {
			let data = await Product.findOneAndUpdate(condition, productData, CONFIG.MONGO.OPTIONS);
			return BaseResponse.success(req, res, data);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Cập nhật trạng thái Product vào hệ thống
	 * @param req
	 * @param res
	 */
	async patch(req: Request, res: Response): Promise<void> {
		// get condition
		let condition: any = {
			_id: req.params.productId,
			isDeleted: false
		};

		// get params data
		let patch = req.params.patch;
		let productData: any = {};
		productData[patch] = req.params.value;

		// Update data to database
		try {
			let data = await Product.findOneAndUpdate(condition, productData, CONFIG.MONGO.OPTIONS);
			return BaseResponse.success(req, res, data);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}

	/**
	 * Cập nhật trạng thái Product vào hệ thống
	 * @param req
	 * @param res
	 */
	async wishlist(req: Request, res: Response): Promise<void> {
		try {
			let product: any = res.locals.product;
			let productLikedBy: any[] = product.likedBy;
			let newProductLikedBy: any[] = [];

			let loggedUser: any = res.locals.loggedUser;
			let userWishlist: any[] = loggedUser.wishlist;
			let newUserWishList: any[] = [];

			let status = req.params.status;

			newProductLikedBy = _.filter(productLikedBy, element => {
				return String(element) !== String(loggedUser._id);
			});

			newUserWishList = _.filter(userWishlist, element => {
				return String(element) !== String(product._id);
			});

			if (status == 1) {
				newProductLikedBy.push(loggedUser._id);
				newUserWishList.push(product._id);
			}

			await Product.findByIdAndUpdate(product._id, { likedBy: newProductLikedBy });
			await User.findByIdAndUpdate(loggedUser._id, { wishlist: newUserWishList })

			return BaseResponse.success(req, res, `Đã thêm sản phẩm ${product.title} vào mục yêu thích.`);
		} catch (error) {
			return BaseResponse.error(req, res, error);
		}
	}
}