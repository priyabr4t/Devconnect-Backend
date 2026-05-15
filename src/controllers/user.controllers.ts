import { Request, Response } from "express";

// DEMO INPUTS FOR TESTING PURPOSES
const users = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
];

// FETCH ALL USERS
export const getUsers = (req: Request, res: Response) => {
    res.status(200).json({ success: true, data: users });
}

// FETCH USER BY ID
export const getUserById = (req: Request, res: Response) => {
    const id = req.params.id;
    if (isNaN(Number(id))) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    const user = users.find(user => user.id === Number(id));
    if (user) {
        res.status(200).json({ success: true, data: user });
    } else {
        res.status(404).json({ success: false, message: "User not found" });
    }
}

// CREATE NEW USER
export const createUser = (req: Request, res: Response) => {
    const { name } = req.body;
    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Valid name is required",
        });
    }

    const trimmedName = name.trim();

    const newUser = {
        id: users.length + 1,
        name: trimmedName
    }

    users.push(newUser);

    res.status(201).json({ success: true, data: newUser });
}

// DELETE USER BY ID
export const deleteUserById = (req: Request, res: Response) => {
    const id = req.params.id;
    const index = users.findIndex(user => user.id === Number(id));
    if (isNaN(Number(id))) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    if (index !== -1) {
        users.splice(index, 1);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } else {
        res.status(404).json({ success: false, message: "User not found" });
    }
}