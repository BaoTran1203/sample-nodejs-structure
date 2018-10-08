import { Request, Response } from 'express';

export interface iAuthController {
    login(req: Request, res: Response): Promise<void>;

    register(req: Request, res: Response): Promise<void>;

    password(req: Request, res: Response): Promise<void>;

    profile(req: Request, res: Response): Promise<void>;

    logout(req: Request, res: Response): Promise<void>;
}

export interface iCRUDController {
    list(req: Request, res: Response): Promise<void>;

    create(req: Request, res: Response): Promise<void>;

    update(req: Request, res: Response): Promise<void>;

    detail(req: Request, res: Response): Promise<void>;

    delete(req: Request, res: Response): Promise<void>;
}

export class BaseController {
}