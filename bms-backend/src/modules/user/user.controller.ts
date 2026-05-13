import { NextFunction, Request, Response } from "express"
import * as UserService from "./user.service"


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).json(user)
    } catch (err) {
        next(err)
    }
}

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getAllUsers()
        res.status(200).json(users);
    } catch (err) {
        next(err)
    }
}

export const  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserById(req.user?.id);
        if (!user) {
            res.status(404).json({ message: "User not found" + `${req.user?._id}` })
        }
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        updateData.activateUser = true;
        const updateUser = await UserService.activateUser(userId, updateData);
        res.status(200).json(updateUser)
    } catch (err) {
        next(err)
    }
}