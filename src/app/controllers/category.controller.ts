import { Category } from './../models/category.model';
import { CONFIG } from '../../shared/helper/config';
import { Request, Response } from 'express';
import { BaseController, iCRUDController } from '../../shared/base/base.controller';
import { BaseResponse } from '../../shared/base/base.response';
import slug from 'slug';

export default class CategoryController extends BaseController implements iCRUDController {

	/**
	 * Lấy danh sách Category từ hệ thống
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
            let data = await Category.find(condition).limit(ppp).skip(skip).sort(sort);
            let count = await Category.countDocuments(condition);
            return BaseResponse.success(req, res, data, count);
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }

	/**
	 * Thêm mới một Category vào hệ thống
	 * @param req
	 * @param res
	 */
    async create(req: Request, res: Response): Promise<void> {
        // Get data from body
        let categoryData: any = {
            title: req.body.title,
            description: req.body.description,
            slug: slug(req.body.title).toLowerCase()
        };

        // Insert to database
        try {
            let data = await new Category(categoryData).save();
            return BaseResponse.success(req, res, data);
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }

	/**
	 * Cập nhật Category vào hệ thống
	 * @param req
	 * @param res
	 */
    async update(req: Request, res: Response): Promise<void> {
        // Get condition
        let condition: object = {
            _id: req.params.categoryId,
            isDeleted: false
        };

        // Get data from body
        let categoryData: any = {
            title: req.body.title,
            description: req.body.description,
            slug: slug(req.body.title).toLowerCase()
        };

        // Update data to database
        try {
            let data = await Category.findOneAndUpdate(condition, categoryData, CONFIG.MONGO.OPTIONS);
            return BaseResponse.success(req, res, data);
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }

	/**
	 * Xem chi tiết một Category dựa vào categoryId
	 * @param req
	 * @param res
	 */
    async detail(req: Request, res: Response): Promise<void> {
        // Get condition
        let condition: object = {
            _id: req.params.categoryId,
            isDeleted: false
        };

        // Query data from database
        try {
            let data: any = await Category.findOne(condition);
            return BaseResponse.success(req, res, data);
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }

	/**
	 * Xóa một Category khõi hệ thống (Soft delete)
	 * @param req
	 * @param res
	 */
    async delete(req: Request, res: Response): Promise<void> {
        // Get condition
        let condition: any = {
            _id: req.params.categoryId,
            isDeleted: false
        };

        // Set data for deletion
        let categoryData: any = {
            isDeleted: true,
            status: 'disabled'
        };

        // Update data to database
        try {
            let data: any = await Category.findOneAndUpdate(condition, categoryData, CONFIG.MONGO.OPTIONS);
            return BaseResponse.success(req, res, data);
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }

	/**
	 * Cập nhật trạng thái Category vào hệ thống
	 * @param req
	 * @param res
	 */
    async patch(req: Request, res: Response): Promise<void> {
        // get condition
        let condition: any = {
            _id: req.params.categoryId,
            isDeleted: false
        };

        // get params data
        let patch = req.params.patch;
        let categoryData: any = {};
        categoryData[patch] = req.params.value;

        // Update data to database
        try {
            let data = await Category.findOneAndUpdate(condition, categoryData, CONFIG.MONGO.OPTIONS);
            return BaseResponse.success(req, res, data);
        } catch (error) {
            return BaseResponse.error(req, res, error);
        }
    }
}