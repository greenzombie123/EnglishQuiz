import { User } from "./Users.model.ts"

export type Role = "student" | "teacher"

export type Student = {
    role:"student"
} & User

export type Teacher = {
    role:"teacher"
} & User