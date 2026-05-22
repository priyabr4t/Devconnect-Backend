import { Router } from 'express';
import { getUsers, getUserById, deleteUserById, updateProfile, followUser, unfollowUser } from '../controllers/user.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/profile", authMiddleware, updateProfile);    
router.delete("/users/:id", authMiddleware, deleteUserById);
router.post("/users/:id/follow", authMiddleware, followUser);
router.delete("/users/:id/follow", authMiddleware, unfollowUser);

export default router;