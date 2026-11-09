import { randomUUID } from 'node:crypto';
import { pool } from '../config/database.js';

const entities = {
  categories: {
    table: 'categories',
    columns: ['name', 'slug', 'description', 'image_url', 'display_order'],
    required: ['name', 'slug'],
    numbers: ['display_order'],
  },
  subcategories: {
    table: 'subcategories',
    columns: ['category_id', 'name', 'slug', 'description', 'image_url', 'display_order'],
    required: ['category_id', 'name', 'slug'],
    numbers: ['display_order'],
  },
  products: {
    table: 'products',
    columns: [
      'subcategory_id', 'name', 'slug', 'description', 'image_url', 'brand', 'material', 'size',
      'thickness', 'finish', 'color', 'design', 'coverage_per_box', 'pieces_per_box',
      'suitable_for', 'price', 'mrp', 'stock_status', 'rating', 'specs', 'is_featured', 'display_order',
    ],
    required: ['subcategory_id', 'name', 'slug'],
    numbers: ['price', 'mrp', 'rating', 'display_order'],
    booleans: ['is_featured'],
    json: ['specs'],
  },
  blog_articles: {
    table: 'blog_articles',
    columns: [
      'title', 'slug', 'content', 'excerpt', 'featured_image_url', 'category', 'author',
      'published_at', 'tags', 'is_published',
    ],
    required: ['title', 'slug', 'content', 'excerpt'],
    booleans: ['is_published'],
    json: ['tags'],
  },
};

function normalizeValue(field, value, entity) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (entity.numbers?.includes(field)) {
    const number = Number(value);
    if (!Number.isFinite(number)) throw Object.assign(new Error(`${field} must be a valid number`), { status: 400 });
    return number;
  }
  if (entity.booleans?.includes(field)) return value === true || value === 1 || value === '1';
  if (entity.json?.includes(field)) {
    if (!Array.isArray(value) && (field === 'tags' || typeof value !== 'object')) {
      throw Object.assign(new Error(`${field} must be valid JSON`), { status: 400 });
    }
    return JSON.stringify(value);
  }
  if (typeof value !== 'string') {
    throw Object.assign(new Error(`${field} must be text`), { status: 400 });
  }
  return value.trim();
}

function readPayload(body, entity, partial = false) {
  const payload = {};
  for (const field of entity.columns) {
    if (Object.hasOwn(body, field)) payload[field] = normalizeValue(field, body[field], entity);
  }

  if (Object.hasOwn(payload, 'name') && !payload.slug) {
    payload.slug = payload.name.toLowerCase().trim().replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  if (Object.hasOwn(payload, 'title') && !payload.slug) {
    payload.slug = payload.title.toLowerCase().trim().replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  if (!partial && entity.table === 'products' && !Object.hasOwn(payload, 'specs')) payload.specs = JSON.stringify({});
  if (!partial && entity.table === 'blog_articles' && !Object.hasOwn(payload, 'tags')) payload.tags = JSON.stringify([]);
  if (Object.hasOwn(payload, 'is_published') && payload.is_published && !payload.published_at) {
    payload.published_at = new Date();
  }

  if (!partial) {
    const missing = entity.required.filter(field => payload[field] === undefined || payload[field] === null || payload[field] === '');
    if (missing.length) throw Object.assign(new Error(`Required fields: ${missing.join(', ')}`), { status: 400 });
  }
  if (!Object.keys(payload).length) {
    throw Object.assign(new Error('No supported fields were provided'), { status: 400 });
  }
  return payload;
}

async function readEntity(entity, id) {
  const [rows] = await pool.execute(`SELECT * FROM ${entity.table} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export async function getCatalog(req, res, next) {
  try {
    const [products, categories, subcategories] = await Promise.all([
      pool.execute('SELECT * FROM products ORDER BY display_order, name'),
      pool.execute('SELECT * FROM categories ORDER BY display_order, name'),
      pool.execute('SELECT * FROM subcategories ORDER BY display_order, name'),
    ]);
    return res.json({
      products: products[0].map(row => ({
        ...row,
        price: Number(row.price),
        mrp: Number(row.mrp),
        rating: Number(row.rating),
        is_featured: Boolean(row.is_featured),
        specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : (row.specs || {}),
      })),
      categories: categories[0],
      subcategories: subcategories[0],
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminArticles(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT * FROM blog_articles ORDER BY created_at DESC');
    return res.json(rows.map(row => ({
      ...row,
      tags: Array.isArray(row.tags) ? row.tags : JSON.parse(row.tags || '[]'),
      is_published: Boolean(row.is_published),
    })));
  } catch (error) {
    return next(error);
  }
}

export function createEntity(name) {
  const entity = entities[name];
  return async (req, res, next) => {
    try {
      const payload = readPayload(req.body || {}, entity);
      const fields = Object.keys(payload);
      const values = fields.map(field => payload[field]);
      const id = randomUUID();
      await pool.execute(
        `INSERT INTO ${entity.table} (id, ${fields.join(', ')}) VALUES (?, ${fields.map(() => '?').join(', ')})`,
        [id, ...values],
      );
      return res.status(201).json(await readEntity(entity, id));
    } catch (error) {
      return next(error);
    }
  };
}

export function updateEntity(name) {
  const entity = entities[name];
  return async (req, res, next) => {
    try {
      const payload = readPayload(req.body || {}, entity, true);
      const fields = Object.keys(payload);
      await pool.execute(
        `UPDATE ${entity.table} SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE id = ?`,
        [...fields.map(field => payload[field]), req.params.id],
      );
      const updated = await readEntity(entity, req.params.id);
      if (!updated) return res.status(404).json({ error: 'Record not found' });
      return res.json(updated);
    } catch (error) {
      return next(error);
    }
  };
}

export function deleteEntity(name) {
  const entity = entities[name];
  return async (req, res, next) => {
    try {
      const [result] = await pool.execute(`DELETE FROM ${entity.table} WHERE id = ?`, [req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ error: 'Record not found' });
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  };
}
