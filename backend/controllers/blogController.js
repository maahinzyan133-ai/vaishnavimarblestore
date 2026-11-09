import { pool } from '../config/database.js';

function parseArticle(article) {
  if (!article) return article;
  return {
    ...article,
    tags: Array.isArray(article.tags) ? article.tags : JSON.parse(article.tags || '[]'),
    is_published: Boolean(article.is_published),
  };
}

export async function getPublishedArticles(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM blog_articles WHERE is_published = 1 ORDER BY published_at DESC, created_at DESC',
    );
    return res.json(rows.map(parseArticle));
  } catch (error) {
    return next(error);
  }
}

export async function getPublishedArticle(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM blog_articles WHERE slug = ? AND is_published = 1 LIMIT 1',
      [req.params.slug],
    );
    if (!rows.length) return res.status(404).json({ error: 'Article not found' });
    const article = parseArticle(rows[0]);
    const [relatedRows] = await pool.execute(
      `SELECT * FROM blog_articles
       WHERE category = ? AND is_published = 1 AND id <> ?
       ORDER BY published_at DESC
       LIMIT 3`,
      [article.category, article.id],
    );
    return res.json({ article, related: relatedRows.map(parseArticle) });
  } catch (error) {
    return next(error);
  }
}
