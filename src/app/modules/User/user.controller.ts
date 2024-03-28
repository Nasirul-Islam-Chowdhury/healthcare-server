import { Request, Response } from "express";
import { userService } from "./user.service";


const createAdmin = async (req: Request, res: Response) => {
    try {

        const result = await userService.createAdmin(req);
        res.status(200).json({
            success: true,
            message: "Admin Created successfuly!",
            data: result
        })
    }
    catch (err:any) {
        res.status(500).json({
            success: false,
            message: err?.name || "Something went wrong",
            error: err
        })
    }
};

export const userController = {
    createAdmin
}