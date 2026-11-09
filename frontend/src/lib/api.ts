import type { BlogArticle, Category, Product, Subcategory } from '@/types';

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => null) as { error?: string; message?: string } | null;
  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || `Request failed: ${response.status}`);
  }

  return payload as T;
}

function queryString(params: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  });
  return query.toString();
}

const jsonBody = (payload: unknown): RequestInit => ({
  method: 'POST',
  body: JSON.stringify(payload),
});

export const api = {
  getCategories: (slug?: string) => {
    const query = queryString({ slug });
    return apiFetch<Category[]>(`/categories${query ? `?${query}` : ''}`);
  },
  getSubcategoriesByCategoryId: (categoryId: string | number) =>
    apiFetch<Subcategory[]>(`/subcategories?category_id=${encodeURIComponent(String(categoryId))}`),
  getProducts: (params: Record<string, string | number | boolean | undefined> = {}) => {
    const query = queryString(params);
    return apiFetch<Product[]>(`/products${query ? `?${query}` : ''}`);
  },
  getFeaturedProducts: () => apiFetch<Product[]>('/products/featured?limit=8'),
  getProductBySlug: (slug: string) => apiFetch<Product>(`/products/${encodeURIComponent(slug)}`),
  searchProducts: (query: string) => apiFetch<Product[]>(`/products/search?q=${encodeURIComponent(query)}`),
  getBlogArticles: () => apiFetch<BlogArticle[]>('/blog'),
  getBlogArticleBySlug: (slug: string) =>
    apiFetch<{ article: BlogArticle; related: BlogArticle[] }>(`/blog/${encodeURIComponent(slug)}`),
  getAdminBlogArticles: () => apiFetch<BlogArticle[]>('/admin/blog'),
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: { id: string; email: string } }>('/auth/login', jsonBody({ email, password })),
  getCurrentUser: () => apiFetch<{ id: string; email: string }>('/auth/me'),
  admin: {
    getCatalog: () => apiFetch<{ products: Product[]; categories: Category[]; subcategories: Subcategory[] }>('/admin/catalog'),
    createProduct: (payload: Partial<Product>) => apiFetch<Product>('/admin/products', jsonBody(payload)),
    updateProduct: (id: string, payload: Partial<Product>) =>
      apiFetch<Product>(`/admin/products/${encodeURIComponent(id)}`, { ...jsonBody(payload), method: 'PUT' }),
    deleteProduct: (id: string) => apiFetch<void>(`/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    createCategory: (payload: Partial<Category>) => apiFetch<Category>('/admin/categories', jsonBody(payload)),
    updateCategory: (id: string, payload: Partial<Category>) =>
      apiFetch<Category>(`/admin/categories/${encodeURIComponent(id)}`, { ...jsonBody(payload), method: 'PUT' }),
    deleteCategory: (id: string) => apiFetch<void>(`/admin/categories/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    createSubcategory: (payload: Partial<Subcategory>) => apiFetch<Subcategory>('/admin/subcategories', jsonBody(payload)),
    updateSubcategory: (id: string, payload: Partial<Subcategory>) =>
      apiFetch<Subcategory>(`/admin/subcategories/${encodeURIComponent(id)}`, { ...jsonBody(payload), method: 'PUT' }),
    deleteSubcategory: (id: string) => apiFetch<void>(`/admin/subcategories/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    createBlogArticle: (payload: Partial<BlogArticle>) => apiFetch<BlogArticle>('/admin/blog', jsonBody(payload)),
    updateBlogArticle: (id: string, payload: Partial<BlogArticle>) =>
      apiFetch<BlogArticle>(`/admin/blog/${encodeURIComponent(id)}`, { ...jsonBody(payload), method: 'PUT' }),
    deleteBlogArticle: (id: string) => apiFetch<void>(`/admin/blog/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
};
