import express from 'express';

import {
        createColor,
        getColors,
        getColorById,
        deleteColor,
        updateColor,
        deactivateColor,
        activateColor
    } from '../../controllers/colors/index.js';

const router = express.Router();

router.post('/', createColor);
router.get('/:id', getColorById);
router.get('/', getColors);
router.delete('/:id', deleteColor);
router.put('/:id', updateColor);
router.patch('/:id/deactivate', deactivateColor);
router.patch('/:id/activate', activateColor);

export default router;