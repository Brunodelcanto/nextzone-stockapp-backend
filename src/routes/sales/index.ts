import express from 'express';
import { isAdmin, protect } from '../../middlewares/auth.js';

import {
    createSale,
    getSales,
    deleteSale
} from '../../controllers/sales/index.js';

const router = express.Router();

router.post('/', protect, createSale);
router.get('/', protect, getSales);
router.delete('/:id', protect, isAdmin, deleteSale);

export default router;