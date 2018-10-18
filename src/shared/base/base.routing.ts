import express, { Request, Response } from 'express';
import Seeder from '../database/seeder';
import AuthRouting from '../../app/routes/auth.routing';
import UserRouting from '../../app/routes/user.routing';
import CategoryRouting from '../../app/routes/category.routing';
import ProductRouting from '../../app/routes/product.routing';

export default class BaseRouting {

    constructor(app: express.Application) {
        app.route('/').get((req: Request, res: Response) => {
            return res.status(200).json({ msg: 'Welcome to Nodejs demo' }).end();
        });

        // app.route('/seed/user').get(new Seeder().user);
        app.route('/v1/seed/category').get(new Seeder().category);
        app.route('/v1/seed/product').get(new Seeder().product);

        new AuthRouting(app);
        new UserRouting(app);
        new CategoryRouting(app);
        new ProductRouting(app);

        app.get('*', function (req, res) {
            res.status(201).json({ msg: 'URL không hợp lệ', code: 404, status: false }).end();
        });
    }
}