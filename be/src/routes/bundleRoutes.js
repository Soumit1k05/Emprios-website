import express from 'express';
import { getAllBundles, getBundleById, seedBundles, downloadBundle, getBundleItems } from '../controllers/bundleController.js';

const router = express.Router();

router.get('/', getAllBundles);
router.get('/:id', getBundleById);
router.get('/:id/items', getBundleItems);
router.get('/:id/download', downloadBundle);
router.post('/seed', seedBundles);

export default router;
