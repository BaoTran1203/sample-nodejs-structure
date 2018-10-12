import mongoose from '../../shared/database/mongo';
import validator from 'validator';
import { CONFIG } from '../../shared/helper/config';
import { Schema } from 'mongoose';

CONFIG.MONGO.SCHEMA.toJSON.transform = parseData;

export var UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Vui lòng nhập họ tên.']
        },
        hash_password: {
            type: String
        },
        email: {
            type: String,
            required: [true, 'Vui lòng nhập địa chỉ email.'],
            validate: [validator.isEmail, 'Địa chỉ email không hợp lệ.'],
            unique: 'Email đã được sử dụng. Vui lòng chọn email khác.'
        },
        phone: {
            type: String,
            required: [true, 'Vui lòng nhập số điện thoại.'],
            validate: {
                validator: (value: string) => validator.isMobilePhone(value, 'vi-VN'),
                message: 'Số điện thoại không hợp lệ.'
            },
            unique: 'Số điện thoại đã được sử dụng. Vui lòng chọn số điện thoại khác.'
        },
        avatar: {
            type: String,
            default: CONFIG.DEFAULT_THUMBNAIL
        },
        wishlist: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
            default: []
        },
        accessCode: {
            type: String
        },
        secretCode: {
            type: String
        },
        status: {
            type: String,
            required: [true, 'Vui lòng chọn trạng thái.'],
            enum: {
                values: ['activated', 'disabled'],
                message: 'Lựa chọn trạng thái không phù hợp, vui lòng chọn lại.'
            },
            default: 'activated',
            trim: true
        },
        role: {
            type: String,
            required: [true, 'Vui lòng chọn quyền.'],
            enum: {
                values: ['admin', 'client'],
                message: 'Lựa chọn quyền không phù hợp, vui lòng chọn lại.'
            },
            default: 'client',
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    CONFIG.MONGO.SCHEMA
);

/**
 * Parse data before return to client
 * @param doc 
 * @param ret 
 */
function parseData(doc: any, ret: any) {
    delete ret.hash_password;
    delete ret.secretCode;
    delete ret.accessCode;
}

export const User = mongoose.model('User', UserSchema);