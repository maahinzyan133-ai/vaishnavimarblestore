import { Router } from 'express';
import {
  getCategories,
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
  getSubcategories,
  searchProducts,
} from '../controllers/catalogController.js';

const router = Router();

router.get('/categories', getCategories);
router.get('/subcategories', getSubcategories);
router.get('/products/search', searchProducts);
router.get('/products/featured', getFeaturedProducts);
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);

export default router;
