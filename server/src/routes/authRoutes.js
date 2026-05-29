import express from 'express';
import { login, register, googleLogin, googleLoginCallback } from '../controllers/authController.js';

import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', upload.single('avatar'), register);
router.post('/google', googleLogin);
router.post('/google/callback', googleLoginCallback);

export default router;
