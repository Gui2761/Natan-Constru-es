import express from 'express';
import { login, register } from '../controllers/authController.js';

import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', upload.single('avatar'), register);

export default router;
