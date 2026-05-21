import { Router } from 'express';
import { getUsers, getUserById, createUser, deleteUserById, updateProfile } from '../controllers/user.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.patch("/users/profile", authMiddleware, updateProfile);    
router.delete("/users/:id", deleteUserById);

export default router;