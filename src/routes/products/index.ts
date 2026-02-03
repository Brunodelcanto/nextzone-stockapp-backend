import express from 'express';

import {
    createProducts,
    getProducts
} from '../../controllers/products/index.js';

const router = express.Router();

router.post('/', createProducts);
router.get('/', getProducts);

export default router;