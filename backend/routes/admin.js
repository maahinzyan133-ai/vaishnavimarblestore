import { Router } from 'express';
import { getAdminArticles, getCatalog, createEntity, deleteEntity, updateEntity } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

router.get('/catalog', getCatalog);
router.get('/blog', getAdminArticles);

for (const [path, entity] of [
  ['categories', 'categories'],
  ['subcategories', 'subcategories'],
  ['products', 'products'],
  ['blog', 'blog_articles'],
]) {
  router.post(`/${path}`, createEntity(entity));
  router.put(`/${path}/:id`, updateEntity(entity));
  router.delete(`/${path}/:id`, deleteEntity(entity));
}

export default router;
