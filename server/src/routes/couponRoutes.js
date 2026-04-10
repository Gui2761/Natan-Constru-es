import express from 'express';
import { getCoupons, createCoupon, deleteCoupon, validateCoupon } from '../controllers/couponController.js';
import { auth, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas Administrativas (Protegidas)
router.get('/', auth, admin, getCoupons);
router.post('/', auth, admin, createCoupon);
router.delete('/:id', auth, admin, deleteCoupon);

// Rota Pública (Validar cupom no Checkout)
router.post('/validate', validateCoupon);

export default router;
