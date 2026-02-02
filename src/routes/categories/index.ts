import express from 'express';
import {
    createCategory,
    getCategoryById,
    getCategories,
    deleteCategory,
    updateCategory,
    deactivateCategory,
    activateCategory
} from '../../controllers/categories/index.js';

const router = express.Router();

router.post('/', createCategory);
router.get('/:id', getCategoryById);
router.get('/', getCategories);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);
router.patch('/:id/deactivate', deactivateCategory);
router.patch('/:id/activate', activateCategory);

export default router;