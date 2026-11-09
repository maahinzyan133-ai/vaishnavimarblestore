import { Router } from 'express';
import { getPublishedArticle, getPublishedArticles } from '../controllers/blogController.js';

const router = Router();

router.get('/', getPublishedArticles);
router.get('/:slug', getPublishedArticle);

export default router;
