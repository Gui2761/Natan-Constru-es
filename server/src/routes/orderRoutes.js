import express from 'express';
import { getOrders, updateOrderStatus, createOrder, getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/user/:id', getUserOrders);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;
