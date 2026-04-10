import express from 'express';
import { getBanners, createBanner, deleteBanner, updateBanner } from '../controllers/bannerController.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getBanners);
router.post('/', upload.single('image'), createBanner);
router.put('/:id', upload.single('image'), updateBanner);
router.delete('/:id', deleteBanner);

export default router;
