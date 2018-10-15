import mongoose from '../../shared/database/mongo';
import { CONFIG } from '../../shared/helper/config';

CONFIG.MONGO.SCHEMA.toJSON.transform = parseData;

export const CategorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Vui lòng nhập tiêu đề.'],
            minlength: [0, 'Vui lòng nhập tiêu đề.'],
            maxlength: [10, 'Tiêu đề không được quá 10 kí tự.'],
            unique: 'Tiêu đề đã có trong dữ liệu. Vui lòng chọn tiêu đề khác.'
        },
        slug: {
            type: String,
            required: [true, 'Vui lòng nhập tiêu đề.'],
            unique: 'Tiêu đề đã có trong dữ liệu. Vui lòng chọn tiêu đề khác.'
        },
        description: {
            type: String,
            required: [true, 'Vui lòng nhập mô tả.']
        },
        thumbnail: {
            type: String,
            default: CONFIG.DEFAULT_THUMBNAIL
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
    if (!ret.slug) {
        ret.slug = '';
    }
}

export const Category = mongoose.model('Category', CategorySchema);
