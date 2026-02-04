import express from 'express';

import {
    createProducts,
    getProducts,
    deleteProduct,
    updateProduct,
    deactivateProduct,
    activateProduct
} from '../../controllers/products/index.js';

const router = express.Router();

router.post('/', createProducts);
router.get('/', getProducts);
router.delete('/:id', deleteProduct);
router.put('/:id', updateProduct);
router.patch('/deactivate/:id', deactivateProduct);
router.patch('/activate/:id', activateProduct);

export default router;