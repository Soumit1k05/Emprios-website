import express from 'express';
import { getAllBundles, getBundleById, seedBundles } from '../controllers/bundleController.js';

const router = express.Router();

router.get('/', getAllBundles);
router.get('/:id', getBundleById);
router.post('/seed', seedBundles);

export default router;
