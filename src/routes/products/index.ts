import express from 'express';
import multer from 'multer';
import { storage } from '../../config/cloudinary.js';

import {
    createProducts,
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    deactivateProduct,
    activateProduct,
    updateVariantStock,
} from '../../controllers/products/index.js';

const router = express.Router();

const upload = multer({ storage });

router.post('/', upload.single('image'), createProducts);
router.get('/:id', getProductById);
router.get('/', getProducts);
router.delete('/:id', deleteProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.patch('/deactivate/:id', deactivateProduct);
router.patch('/activate/:id', activateProduct);
router.patch('/stock/:id', updateVariantStock);

export default router;