import express, { Request, Response } from "express";
import Task from "../model/task.model";


// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response): Promise<void> => {
    interface Find {
        deleted: boolean,
        status?: string
    }

    const find: Find = {
        deleted: false
    }

    if(req.query.status){
        find["status"] = `${req.query.status}`;
    }

    // Sắp xếp
    const sort: any = {};

    if(req.query.sortKey && req.query.sortValue){
        sort[`${req.query.sortKey}`] = req.query.sortValue;
    };
    //Hết sắp xếp

    //Phân trang
    const pagination = {
        limit: 2,
        page: 1,
    };

    if(req.query.page) {
        // vì parseInt yêu cầu phải ở dạng chuỗi nên phải chuyển req.query.page sang chuỗi bằng cách thêm dấu `` và truyền ${}
        pagination.page = parseInt(`${req.query.page}`);
    }

    if(req.query.limit) {
        pagination.limit = parseInt(`${req.query.limit}`);
    }

    const skip = (pagination.page - 1) * pagination.limit;
    //Hết phân trang

    const tasks = await Task
    .find(find)
    .sort(sort)
    .limit(pagination.limit)
    .skip(skip);

    res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false
    });

    res.json(task);
}