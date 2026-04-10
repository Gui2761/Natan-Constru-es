import express from 'express';
import { getMe, updateMe } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, upload.single('avatar'), updateMe);

export default router;
