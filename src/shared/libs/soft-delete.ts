import { Schema } from 'mongoose';

export default function softDelete(schema: Schema) {
    schema.add({
        test: {
            type: Boolean,
            default: false
        }
    });

    schema.pre('save', function (this: any, next: any) {
        this.test = false;
        next();
    });

    schema.pre('findOne', function (this: any, next: any) {
        next();
    });

    schema.post('findOne', function (this: any, doc: any, next: any) {
        if (doc.test) {
            let a = new Error('Dữ liệu này đã bị xóa');
            return next(new Error('Dữ liệu này đã bị xóa'));
        }
        return next();
    });

    schema.pre('findOneAndUpdate', function (this: any, next: any) {
        next();
    });
}