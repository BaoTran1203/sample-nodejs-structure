import { Product } from './../../app/models/product.model';
import { Category } from './../../app/models/category.model';
import { User } from './../../app/models/user.model';
import { Request, Response } from 'express';
import faker from 'faker/locale/vi';
import _ from 'lodash';
import slug from 'slug';

/**
 * See: https://www.npmjs.com/package/faker
 */
export default class Seeder {
    async user(req: Request, res: Response): Promise<void> {
        try {
            let count = 0;
            while (count < 1000) {
                let userData: any = {
                    name: faker.name.firstName() + ' ' + faker.name.lastName(),
                    hash_password: await require('bcrypt').hashSync('123456789', 4),
                    email: faker.internet.email(),
                    phone: faker.phone.phoneNumberFormat(2),
                    status: faker.random.arrayElement(['activated', 'disabled']),
                    role: faker.random.arrayElement(['admin', 'client'])
                }

                let newUser = null;
                try {
                    let user = new User(userData);
                    newUser = await user.save();
                    if (newUser) {
                        count++;
                    }
                } catch (error) {
                }
            }
            return res.status(200).json({ msg: `Seed done !!!` }).end();
        } catch (error) {
            return res.status(200).json({ msg: 'Seed Error!!!', err: error }).end();
        }
    }

    async category(req: Request, res: Response): Promise<void> {
        try {
            let count = 0;
            while (count < 10) {
                let title: string = faker.commerce.department();
                if (title.length > 10) {
                    title = title.substring(0, 9);
                }
                let catogoryData: any = {
                    title: title,
                    slug: slug(title),
                    description: faker.lorem.text(),
                    status: faker.random.arrayElement(['activated', 'disabled'])
                }

                let newCategory = null;
                try {
                    let catogory = new Category(catogoryData);
                    newCategory = await catogory.save();
                    if (newCategory) {
                        count++;
                    }
                } catch (error) {
                    console.log(error);
                    // break;
                }
            }
            return res.status(200).json({ msg: `Seed done !!!` }).end();
        } catch (error) {
            return res.status(200).json({ msg: 'Seed Error!!!', err: error }).end();
        }
    }

    async product(req: Request, res: Response): Promise<void> {
        let categories = await Category.find({});
        let catogoryIds = _.map(categories, '_id');

        try {
            let count = 0;
            while (count < 100) {
                let productData: any = {
                    title: faker.commerce.productName(),
                    description: faker.lorem.text(),
                    price: faker.commerce.price(),
                    discount: faker.random.number({ min: 0, max: 99, precision: 2 }),
                    thumbnail: faker.image.imageUrl(300, 200),
                    category: faker.random.arrayElement(catogoryIds),
                    status: faker.random.arrayElement(['activated', 'disabled'])
                }

                let newProduct = null;
                try {
                    let product = new Product(productData);
                    newProduct = await product.save();
                    if (newProduct) {
                        count++;
                    }
                } catch (error) {
                }
            }
            return res.status(200).json({ msg: `Seed done !!!` }).end();
        } catch (error) {
            return res.status(200).json({ msg: 'Seed Error!!!', err: error }).end();
        }
    }
}