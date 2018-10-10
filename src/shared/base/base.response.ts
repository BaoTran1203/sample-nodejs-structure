import { Request, Response } from 'express';

export class BaseResponse {
    /**
     * Phản hồi thông báo và dữ liệu về cho client nếu thao tác được xử lý thành công
     * @param res 
     * @param data 
     */
    static success(req: Request, res: Response, data: any, total: number = 0) {
        if (!data || JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') {
            let error = { name: 'NoContent' };
            return BaseResponse.error(req, res, error);
        }

        // Khác
        if (typeof data === 'string' || data instanceof String) {
            return res.status(200).json({ status: true, code: 200, msg: data }).end();
        }

        if (req.method === 'GET') {
            let msg = 'Lấy dữ liệu thành công.';
            if (total > 0) {
                return res.status(200).json({ status: true, code: 200, msg: msg, data: data, total: total }).end();
            }
            return res.status(200).json({ status: true, code: 200, msg: msg, data: data }).end();
        }

        if (req.method === 'POST') {
            let msg = 'Thêm dữ liệu thành công.';
            return res.status(200).json({ status: true, code: 200, msg: msg, data: data }).end();
        }

        if (req.method === 'PUT') {
            let msg = 'Cập nhật dữ liệu thành công.';
            return res.status(200).json({ status: true, code: 200, msg: msg, data: data }).end();
        }

        if (req.method === 'PATCH') {
            let msg = 'Thay đổi trạng thái dữ liệu thành công.';
            return res.status(200).json({ status: true, code: 200, msg: msg, data: data }).end();
        }

        if (req.method === 'DELETE') {
            let msg = 'Xóa dữ liệu thành công.';
            return res.status(200).json({ status: true, code: 200, msg: msg, data: data }).end();
        }

        // Default
        let msg = 'Thao tác được xử lý thành công.';
        return res.status(200).json({ status: true, code: 200, msg: msg, data: data }).end();
    }

	/**
	 * Gửi thông báo lỗi về cho client nếu thao tác xử lý không thành công
	 * @param error
	 */
    static error(req: Request, res: Response, error: any | string) {
        // Lỗi 401: Unauthorized
        if (error.name === 'JsonWebTokenError') {
            let msg = 'Xác thực thất bại. Vui lòng đăng nhập lại.';
            return res.status(201).json({ status: false, code: 401, name: error.name, msg: msg }).end();
        }

        if (error.name === 'TokenExpiredError') {
            let msg = 'Phiên giao dịch hết hạn. Vui lòng đăng nhập lại.';
            return res.status(201).json({ status: false, code: 401, name: error.name, msg: msg }).end();
        }

        if (error.name === 'AccountNotExist') {
            let msg = 'Tài khoản không tồn tại trong hệ thống.';
            return res.status(201).json({ status: false, code: 401, name: error.name, msg: msg }).end();
        }

        if (error.name === 'WrongPassword') {
            let msg = 'Mật khẩu không chính xác. Vui lòng kiểm tra lại.';
            return res.status(201).json({ status: false, code: 401, name: error.name, msg: msg }).end();
        }

        // Lỗi 403: Forbidden
        if (error.name === 'BlockAccount') {
            let msg = 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị.';
            return res.status(201).json({ status: false, code: 401, name: error.name, msg: msg }).end();
        }

        // Lỗi 404: Not found
        if (error.name === 'NoContent') {
            let msg = 'Không tìm thấy dữ liệu hợp lệ.';
            return res.status(201).json({ status: false, code: 404, name: error.name, msg: msg }).end();
        }

        // Lỗi 201: Created
        if (error.name === 'ValidationError') {
            let errors: any = error.errors;
            let firstError = errors[Object.keys(errors)[0]];
            return res.status(201).json({ status: false, code: 201, name: error.name, msg: firstError.message }).end();
        }

        if (error.name === 'CastError') {
            let value = error.value;
            let msg = `Mã ${value} chưa đúng định dạng. Vui lòng kiểm tra lại.`;
            return res.status(201).json({ status: false, code: 201, name: error.name, msg: error }).end();
        }

        if (error.name === 'MongoError') {
            if (error.codeName === 'BadValue') { }
            return res.status(201).json({ status: false, code: 201, name: error.codeName, msg: error.errmsg }).end();
        }

        if (typeof error === 'string' || error instanceof String) {
            return res.status(201).json({ status: false, code: 201, name: 'Error', msg: error }).end();
        }

        let msg = 'Something went wrong!!!';
        return res.status(201).json({ status: false, code: 201, name: 'Error', msg: msg }).end();
    }
}