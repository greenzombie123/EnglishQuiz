import type { NextFunction, Request, Response } from "express";
import { Classes } from "./class.model.ts";
import { User } from "../users/Users.model.ts";
import { redirectToDashBoard } from "../auth/auth.controller.ts";

export const getCreateClassPage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // if(!req.user) return res.redirect("/")

    res.locals.view = "createClass"

    res.render('baseview')
}

export const createClass = async (
    req: Request<{}, {}, { name: string }>,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) throw new Error("Something wrong brah! Cant make a class now!")

    const { username } = req.user

    const { name } = req.body

    const user = await User.findByUserName(username, "teacher")

    if (!user) throw new Error("Something wrong brah! Cant find user now!")

    const classId = await Classes.create(user.id, name)

    // Register new class as current class

    await User.changeCurrentClass(classId, user.id)

    res.redirect("/signup/completed")
}
