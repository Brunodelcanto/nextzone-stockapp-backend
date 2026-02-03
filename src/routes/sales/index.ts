import express from 'express';
import { isAdmin, verifyToken } from '../../middlewares/auth.js';

import {
    createSale,
    getSales,
    deleteSale
} from '../../controllers/sales/index.js';

const router = express.Router();

router.post('/', verifyToken, createSale);
router.get('/', verifyToken, getSales);
router.delete('/:id', verifyToken, isAdmin, deleteSale);

export default router;