import express from 'express';

import {
    createProducts,
    getProducts,
    deleteProduct,
    updateProduct,
    deactivateProduct,
    activateProduct,
    updateVariantStock
} from '../../controllers/products/index.js';

const router = express.Router();

router.post('/', createProducts);
router.get('/', getProducts);
router.delete('/:id', deleteProduct);
router.put('/:id', updateProduct);
router.patch('/deactivate/:id', deactivateProduct);
router.patch('/activate/:id', activateProduct);
router.patch('/stock/:id', updateVariantStock);

export default router;