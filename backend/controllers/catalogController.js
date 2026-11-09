import { pool } from '../config/database.js';

function parseProduct(row) {
  if (!row) return row;
  return {
    ...row,
    price: Number(row.price),
    mrp: Number(row.mrp),
    rating: Number(row.rating),
    is_featured: Boolean(row.is_featured),
    display_order: Number(row.display_order),
    specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : (row.specs || {}),
  };
}

export async function getCategories(req, res, next) {
  try {
    const sql = req.query.slug
      ? 'SELECT * FROM categories WHERE slug = ? ORDER BY display_order, name'
      : 'SELECT * FROM categories ORDER BY display_order, name';
    const [rows] = await pool.execute(sql, req.query.slug ? [req.query.slug] : []);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

export async function getSubcategories(req, res, next) {
  try {
    const where = req.query.category_id ? 'WHERE category_id = ?' : '';
    const [rows] = await pool.execute(
      `SELECT * FROM subcategories ${where} ORDER BY display_order, name`,
      req.query.category_id ? [req.query.category_id] : [],
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

export async function getProducts(req, res, next, featuredOnly = false) {
  try {
    const clauses = [];
    const values = [];
    if (req.query.subcategory_id) {
      clauses.push('s.id = ?');
      values.push(req.query.subcategory_id);
    }
    if (req.query.category_id) {
      clauses.push('s.category_id = ?');
      values.push(req.query.category_id);
    }
    if (featuredOnly || req.query.featured === 'true') clauses.push('p.is_featured = 1');
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const requestedLimit = Number(req.query.limit);
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 1000)
      : 1000;
    values.push(limit);

    const [rows] = await pool.execute(
      `SELECT p.* FROM products p
       INNER JOIN subcategories s ON s.id = p.subcategory_id
       ${where}
       ORDER BY p.display_order, p.name
       LIMIT ?`,
      values,
    );
    return res.json(rows.map(parseProduct));
  } catch (error) {
    return next(error);
  }
}

export async function getFeaturedProducts(req, res, next) {
  return getProducts(req, res, next, true);
}

export async function searchProducts(req, res, next) {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) return res.json([]);
    const term = `%${query}%`;
    const [rows] = await pool.execute(
      `SELECT p.* FROM products p
       WHERE p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?
          OR p.material LIKE ? OR p.color LIKE ? OR p.design LIKE ?
       ORDER BY p.display_order, p.name
       LIMIT 100`,
      [term, term, term, term, term, term],
    );
    return res.json(rows.map(parseProduct));
  } catch (error) {
    return next(error);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE slug = ? LIMIT 1', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    return res.json(parseProduct(rows[0]));
  } catch (error) {
    return next(error);
  }
}
