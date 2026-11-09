import { useState, useEffect } from 'react';
import { Lock, Mail, LogOut, Plus, Pencil, Trash2, X, Package, Layers, Tag, ArrowLeft, Save, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { navigate } from '@/lib/router';
import { api } from '@/lib/api';
import type { Category, Subcategory, Product } from '@/types';
import { BlogAdmin } from '@/components/BlogAdmin';
import { ImageUploadField } from '@/components/ImageUploadField';

export function AdminPage() {
  const { session, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-stone-400">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <AdminLogin signIn={signIn} />;
  }

  return <AdminDashboard signOut={signOut} />;
}

function AdminLogin({ signIn }: { signIn: (email: string, password: string) => Promise<{ error: string | null }> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setSubmitting(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-stone-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-stone-800">Admin Login</h1>
            <p className="text-stone-500 text-sm mt-1">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="marblevaishnavi@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-stone-800 text-white py-3 rounded-lg font-semibold hover:bg-stone-900 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full text-sm text-stone-500 hover:text-stone-700 mt-4 flex items-center justify-center gap-1"
          >
            <ArrowLeft size={14} /> Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ signOut }: { signOut: () => Promise<void> }) {
  const [tab, setTab] = useState<'products' | 'categories' | 'subcategories' | 'blog'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productSubcategoryFilter, setProductSubcategoryFilter] = useState('');
  const [productBrandFilter, setProductBrandFilter] = useState('');
  const [productStockFilter, setProductStockFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const catalog = await api.admin.getCatalog();
      setProducts(catalog.products);
      setCategories(catalog.categories);
      setSubcategories(catalog.subcategories);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredProducts = products.filter(p => {
    const q = productSearch.trim().toLowerCase();
    const matchesSearch = !q || [p.name, p.brand, p.material, p.color, p.design, p.slug].some(v => String(v ?? '').toLowerCase().includes(q));
    const sub = subcategories.find(s => s.id === p.subcategory_id);
    const matchesCategory = !productCategoryFilter || sub?.category_id === productCategoryFilter;
    const matchesSubcategory = !productSubcategoryFilter || p.subcategory_id === productSubcategoryFilter;
    const matchesBrand = !productBrandFilter || String(p.brand ?? '') === productBrandFilter;
    const matchesStock = !productStockFilter || p.stock_status === productStockFilter;
    return matchesSearch && matchesCategory && matchesSubcategory && matchesBrand && matchesStock;
  });

  const productBrands = Array.from(new Set(products.map(p => String(p.brand ?? '').trim()).filter(Boolean))).sort();
  const filteredSubcategoryOptions = subcategories.filter(s => !productCategoryFilter || s.category_id === productCategoryFilter);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.admin.deleteProduct(id);
      await loadData();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? All subcategories and products under it will also be deleted.')) return;
    try {
      await api.admin.deleteCategory(id);
      window.dispatchEvent(new Event('catalog:categories-updated'));
      await loadData();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm('Delete this subcategory? All products under it will also be deleted.')) return;
    try {
      await api.admin.deleteSubcategory(id);
      window.dispatchEvent(new Event('catalog:categories-updated'));
      await loadData();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Failed to delete subcategory');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-800">Admin Dashboard</h1>
          <p className="text-stone-500 text-sm">Manage your store catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-sm text-stone-600 hover:text-stone-900">View Store</button>
          <button onClick={signOut} className="flex items-center gap-1.5 text-sm bg-stone-100 text-stone-700 px-3 py-2 rounded-lg hover:bg-stone-200">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
          <Package className="text-stone-700" size={28} />
          <div>
            <p className="text-2xl font-bold text-stone-800">{products.length}</p>
            <p className="text-xs text-stone-500">Products</p>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
          <Layers className="text-stone-700" size={28} />
          <div>
            <p className="text-2xl font-bold text-stone-800">{categories.length}</p>
            <p className="text-xs text-stone-500">Categories</p>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
          <Tag className="text-stone-700" size={28} />
          <div>
            <p className="text-2xl font-bold text-stone-800">{subcategories.length}</p>
            <p className="text-xs text-stone-500">Subcategories</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-stone-200 overflow-x-auto">
        {(['products', 'categories', 'subcategories', 'blog'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
              tab === t ? 'border-stone-800 text-stone-800' : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {t === 'blog' ? 'Blog Posts' : t}
          </button>
        ))}
      </div>

      {loadError && (
        <div role="alert" className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {loadError}
        </div>
      )}

      {loading ? (
        <p className="text-stone-400 text-center py-10">Loading...</p>
      ) : tab === 'blog' ? (
        <BlogAdmin />
      ) : tab === 'products' ? (
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
            <div>
              <p className="text-sm text-stone-500">{filteredProducts.length} of {products.length} products</p>
            </div>
            <button
              onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
              className="flex items-center gap-1.5 bg-stone-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-900"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-stone-700">
              <Filter size={16} /> Product Search &amp; Filters
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative lg:col-span-2">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search name, brand, material, color..." className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
              </div>
              <select value={productCategoryFilter} onChange={e => { setProductCategoryFilter(e.target.value); setProductSubcategoryFilter(''); }} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700">
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <select value={productSubcategoryFilter} onChange={e => setProductSubcategoryFilter(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700">
                <option value="">All Subcategories</option>
                {filteredSubcategoryOptions.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
              </select>
              <select value={productBrandFilter} onChange={e => setProductBrandFilter(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700">
                <option value="">All Brands</option>
                {productBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
              <select value={productStockFilter} onChange={e => setProductStockFilter(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700">
                <option value="">All Stock Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            {(productSearch || productCategoryFilter || productSubcategoryFilter || productBrandFilter || productStockFilter) && (
              <button type="button" onClick={() => { setProductSearch(''); setProductCategoryFilter(''); setProductSubcategoryFilter(''); setProductBrandFilter(''); setProductStockFilter(''); }} className="mt-3 text-xs font-medium text-stone-600 hover:text-stone-900 underline">
                Clear all filters
              </button>
            )}
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Product</th>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3 hidden md:table-cell">Brand</th>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Price</th>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3 hidden md:table-cell">Stock</th>
                    <th className="text-right text-xs font-semibold text-stone-600 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-sm text-stone-500">
                        No products match your search or filters.
                      </td>
                    </tr>
                  ) : filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={e => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><ImageIcon size={18} className="text-stone-300" /></div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-stone-700 line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-600 hidden md:table-cell">{p.brand}</td>
                      <td className="px-4 py-3 text-sm font-medium text-stone-800">Rs. {p.price.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs font-medium ${p.stock_status === 'In Stock' ? 'text-green-600' : 'text-red-500'}`}>
                          {p.stock_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                            className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : tab === 'categories' ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-stone-500">{categories.length} categories</p>
              <p className="mt-1 text-xs text-stone-500">Categories appear in the store header automatically. Use Display Order to arrange them.</p>
            </div>
            <button
              onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }}
              className="flex items-center gap-1.5 bg-stone-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-900"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  {cat.image_url && <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-800 text-sm">{cat.name}</h3>
                  <p className="text-xs text-stone-500 line-clamp-1">{cat.description}</p>
                </div>
                <button
                  onClick={() => { setEditingCategory(cat); setShowCategoryForm(true); }}
                  className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-stone-500">{subcategories.length} subcategories</p>
            <button
              onClick={() => { setEditingSubcategory(null); setShowSubcategoryForm(true); }}
              className="flex items-center gap-1.5 bg-stone-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-900"
            >
              <Plus size={16} /> Add Subcategory
            </button>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Subcategory</th>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3 hidden md:table-cell">Products</th>
                    <th className="text-right text-xs font-semibold text-stone-600 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {subcategories.map(sub => {
                    const parentCat = categories.find(c => c.id === sub.category_id);
                    const productCount = products.filter(p => p.subcategory_id === sub.id).length;
                    return (
                      <tr key={sub.id} className="hover:bg-stone-50">
                        <td className="px-4 py-3 text-sm font-medium text-stone-700">{sub.name}</td>
                        <td className="px-4 py-3 text-sm text-stone-600 hidden md:table-cell">{parentCat?.name ?? '-'}</td>
                        <td className="px-4 py-3 text-sm text-stone-600 hidden md:table-cell">{productCount}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => { setEditingSubcategory(sub); setShowSubcategoryForm(true); }}
                              className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSubcategory(sub.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          subcategories={subcategories}
          categories={categories}
          onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
          onSaved={() => { setShowProductForm(false); setEditingProduct(null); loadData(); }}
        />
      )}
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => { setShowCategoryForm(false); setEditingCategory(null); }}
          onSaved={() => {
            window.dispatchEvent(new Event('catalog:categories-updated'));
            setShowCategoryForm(false);
            setEditingCategory(null);
            loadData();
          }}
        />
      )}
      {showSubcategoryForm && (
        <SubcategoryForm
          subcategory={editingSubcategory}
          categories={categories}
          onClose={() => { setShowSubcategoryForm(false); setEditingSubcategory(null); }}
          onSaved={() => {
            window.dispatchEvent(new Event('catalog:categories-updated'));
            setShowSubcategoryForm(false);
            setEditingSubcategory(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function CategoryForm({
  category,
  onClose,
  onSaved,
}: {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    image_url: category?.image_url ?? '',
    display_order: category?.display_order.toString() ?? '0',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const payload = {
      name: formData.name,
      slug,
      description: formData.description || null,
      image_url: formData.image_url || null,
      display_order: parseInt(formData.display_order) || 0,
    };

    try {
      if (category) {
        await api.admin.updateCategory(category.id, payload);
      } else {
        await api.admin.createCategory(payload);
      }
      onSaved();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save category');
      setSaving(false);
    }
  };

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => update('name', e.target.value)}
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Slug (auto if empty)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={e => update('slug', e.target.value)}
              placeholder="auto-generated"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => update('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>
          <ImageUploadField
            value={formData.image_url}
            onChange={url => update('image_url', url)}
          />
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Display Order</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={e => update('display_order', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-stone-300 text-stone-700 py-2.5 rounded-lg font-medium hover:bg-stone-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-stone-800 text-white py-2.5 rounded-lg font-medium hover:bg-stone-900 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? 'Saving...' : <><Save size={16} /> {category ? 'Update' : 'Create'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SubcategoryForm({
  subcategory,
  categories,
  onClose,
  onSaved,
}: {
  subcategory: Subcategory | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState({
    name: subcategory?.name ?? '',
    slug: subcategory?.slug ?? '',
    description: subcategory?.description ?? '',
    image_url: subcategory?.image_url ?? '',
    display_order: subcategory?.display_order.toString() ?? '0',
    category_id: subcategory?.category_id ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!formData.category_id) {
      setError('Please select a parent category');
      setSaving(false);
      return;
    }

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const payload = {
      name: formData.name,
      slug,
      description: formData.description || null,
      image_url: formData.image_url || null,
      display_order: parseInt(formData.display_order) || 0,
      category_id: formData.category_id,
    };

    try {
      if (subcategory) {
        await api.admin.updateSubcategory(subcategory.id, payload);
      } else {
        await api.admin.createSubcategory(payload);
      }
      onSaved();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save subcategory');
      setSaving(false);
    }
  };

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">{subcategory ? 'Edit Subcategory' : 'Add Subcategory'}</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Parent Category *</label>
            <select
              value={formData.category_id}
              onChange={e => update('category_id', e.target.value)}
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Subcategory Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => update('name', e.target.value)}
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Slug (auto if empty)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={e => update('slug', e.target.value)}
              placeholder="auto-generated"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => update('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>
          <ImageUploadField
            value={formData.image_url}
            onChange={url => update('image_url', url)}
          />
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Display Order</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={e => update('display_order', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-stone-300 text-stone-700 py-2.5 rounded-lg font-medium hover:bg-stone-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-stone-800 text-white py-2.5 rounded-lg font-medium hover:bg-stone-900 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? 'Saving...' : <><Save size={16} /> {subcategory ? 'Update' : 'Create'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  subcategories,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  subcategories: Subcategory[];
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    image_url: product?.image_url ?? '',
    brand: product?.brand ?? '',
    material: product?.material ?? '',
    size: product?.size ?? '',
    thickness: product?.thickness ?? '',
    finish: product?.finish ?? '',
    color: product?.color ?? '',
    design: product?.design ?? '',
    coverage_per_box: product?.coverage_per_box ?? '',
    pieces_per_box: product?.pieces_per_box ?? '',
    suitable_for: product?.suitable_for ?? '',
    price: product?.price.toString() ?? '',
    mrp: product?.mrp.toString() ?? '',
    stock_status: product?.stock_status ?? 'In Stock',
    rating: product?.rating.toString() ?? '4.0',
    is_featured: product?.is_featured ?? false,
    display_order: product?.display_order.toString() ?? '0',
    subcategory_id: product?.subcategory_id ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredSubs = subcategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!formData.subcategory_id) {
      setError('Please select a subcategory');
      setSaving(false);
      return;
    }

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const payload = {
      ...formData,
      slug,
      price: parseFloat(formData.price) || 0,
      mrp: parseFloat(formData.mrp) || 0,
      rating: parseFloat(formData.rating) || 4.0,
      display_order: parseInt(formData.display_order) || 0,
      is_featured: formData.is_featured,
    };

    try {
      if (product) {
        await api.admin.updateProduct(product.id, payload);
      } else {
        await api.admin.createProduct(payload);
      }
      onSaved();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save product');
      setSaving(false);
    }
  };

  const update = (field: string, value: string | boolean) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => update('name', e.target.value)}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Slug (auto if empty)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => update('slug', e.target.value)}
                placeholder="auto-generated"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => update('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>

          <ImageUploadField
            value={formData.image_url}
            onChange={url => update('image_url', url.trim())}
          />

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Subcategory *</label>
            <select
              value={formData.subcategory_id}
              onChange={e => update('subcategory_id', e.target.value)}
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            >
              <option value="">Select subcategory</option>
              {categories.map(cat => (
                <optgroup key={cat.id} label={cat.name}>
                  {filteredSubs.filter(s => s.category_id === cat.id).map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Brand</label>
              <input type="text" value={formData.brand} onChange={e => update('brand', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Material</label>
              <input type="text" value={formData.material} onChange={e => update('material', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Size</label>
              <input type="text" value={formData.size} onChange={e => update('size', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Thickness</label>
              <input type="text" value={formData.thickness} onChange={e => update('thickness', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Finish</label>
              <input type="text" value={formData.finish} onChange={e => update('finish', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Color</label>
              <input type="text" value={formData.color} onChange={e => update('color', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Design</label>
              <input type="text" value={formData.design} onChange={e => update('design', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Coverage/Box</label>
              <input type="text" value={formData.coverage_per_box} onChange={e => update('coverage_per_box', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Pieces/Box</label>
              <input type="text" value={formData.pieces_per_box} onChange={e => update('pieces_per_box', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Suitable For</label>
            <input type="text" value={formData.suitable_for} onChange={e => update('suitable_for', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price *</label>
              <input type="number" step="0.01" value={formData.price} onChange={e => update('price', e.target.value)} required className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">MRP</label>
              <input type="number" step="0.01" value={formData.mrp} onChange={e => update('mrp', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => update('rating', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Display Order</label>
              <input type="number" value={formData.display_order} onChange={e => update('display_order', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Stock Status</label>
              <select
                value={formData.stock_status}
                onChange={e => update('stock_status', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={e => update('is_featured', e.target.checked)}
                  className="rounded border-stone-300 text-stone-800 focus:ring-stone-700"
                />
                <span className="text-sm font-medium text-stone-700">Featured Product</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-stone-300 text-stone-700 py-2.5 rounded-lg font-medium hover:bg-stone-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-stone-800 text-white py-2.5 rounded-lg font-medium hover:bg-stone-900 disabled:opacity-50">
              {saving ? 'Saving...' : product ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
