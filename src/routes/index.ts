import express from 'express';
import colorRouter from './colors/index.js';
import categoryRouter from './categories/index.js';
import productRouter from './products/index.js';
import userRouter from './users/index.js';

const router = express.Router();

router.use('/colors', colorRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/users', userRouter);

export default router;