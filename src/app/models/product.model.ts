import mongoose from '../../shared/database/mongo';
import { CONFIG } from '../../shared/helper/config';
import { Schema } from 'mongoose';

CONFIG.MONGO.SCHEMA.toJSON.transform = parseData;

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Vui lòng nhập tiêu đề.']
        },
        description: {
            type: String,
            required: [true, 'Vui lòng nhập mô tả.']
        },
        price: {
            type: Number,
            required: [true, 'Vui lòng nhập giá sản phẩm.'],
            min: [0, 'Giá sản phẩm phải lớn hơn 0.']
        },
        discount: {
            type: Number,
            required: [true, 'Vui lòng nhập giảm giá.'],
            min: [0, 'Số giảm giá phải lớn hơn 0'],
            max: [100, 'Số giảm giá phải lớn hơn 100']
        },
        thumbnail: {
            type: String,
            default: CONFIG.DEFAULT_THUMBNAIL
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Vui lòng chọn danh mục.']
        },
        likedBy: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            default: []
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

var virtual = ProductSchema.virtual('priceDiscounted');
virtual.get(function (this: any): number {
    return this.price * ((100 - this.discount) / 100.0);
});

/**
 * Parse data before return to client
 * @param doc 
 * @param ret 
 */
function parseData(doc: any, ret: any) { }

export const Product = mongoose.model('Product', ProductSchema);