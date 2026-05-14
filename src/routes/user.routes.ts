import { Router } from 'express';
import { getUsers, getUserById, createUser, deleteUserById } from '../controllers/user.controllers';

const router = Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.delete("/users/:id", deleteUserById);

export default router;