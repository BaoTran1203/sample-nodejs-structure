import { BaseMiddleware, iCRUDMiddleware } from './../../shared/base/base.middleware';
import { CONFIG } from '../../shared/helper/config';
import { Request, Response } from 'express';
import { Common } from '../../shared/helper/common';
import _find from 'lodash/find';
import { BaseResponse } from '../../shared/base/base.response';

export default class UserMiddleware extends BaseMiddleware implements iCRUDMiddleware {

    /**
     * Lấy dữ liệu từ query để tạo bộ lọc điều kiện
     * @param req 
     * @param res 
     * @param next 
     */
    async search(req: Request, res: Response, next: any): Promise<void> {
        // Get condition for query
        let condition: any = { isDeleted: false };

        // -- search: keyword
        if (req.query.keyword) {
            condition['$or'] = [
                { name: { $regex: req.query.keyword, $options: 'imxs' } },
                { email: { $regex: req.query.keyword, $options: 'imxs' } },
                { phone: { $regex: req.query.keyword, $options: 'imxs' } }
            ];
        }

        // -- search: email
        if (req.query.email) {
            condition.email = req.query.email;
        }

        // -- search: phone
        if (req.query.phone) {
            condition.phone = req.query.phone;
        }

        // -- search: status
        if (req.query.status) {
            condition.status = req.query.status;
        }

        // -- search: role
        if (req.query.role) {
            condition.role = req.query.role;
        }

        // -- search: date range
        if (req.query.start_date && req.query.end_date) {
            condition.createdAt = {
                $gte: Common.strToTime(`${req.query.start_date} 00:00:00`),
                $lte: Common.strToTime(`${req.query.end_date} 23:59:59`),
            };
        }

        // Get Sort condition from query
        let sort: any = {};
        if (req.query.sort_by && req.query.sort_order) {
            sort[req.query.sort_by] = req.query.sort_order;
        } else {
            sort = { createdAt: -1 };
        }

        // Get pagination
        let page = Number(req.query.page) || CONFIG.PAGE;
        let ppp = Number(req.query.ppp) || CONFIG.PPP;

        // Pass value to next controller
        res.locals.condition = condition;
        res.locals.page = page;
        res.locals.ppp = ppp;
        res.locals.sort = sort;
        next();
    }

    /**
     * Kiểm tra dữ liệu đầu vào
     * @param req 
     * @param res 
     * @param next 
     */
    async verify(req: Request, res: Response, next: any): Promise<void> {
        next();
    }

    /**
     * Kiểm tra dữ liệu đầu vào
     * @param req 
     * @param res 
     * @param next 
     */
    async status(req: Request, res: Response, next: any): Promise<void> {
        let arrayPatches = ['status', 'role'];
        let patch = req.params.patch;

        let avaiblePatch = _find(arrayPatches, patch)
        if (!avaiblePatch) {
            return BaseResponse.error(req, res, 'Loại trạng thái không hợp lệ. Vui lòng kiểm tra lại.');
        }

        next();
    }
}