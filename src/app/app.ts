import express from 'express';
import BaseRouting from '../shared/base/base.routing';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        new BaseRouting(this.app);
    }
}

export default new App().app;