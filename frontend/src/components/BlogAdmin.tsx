import { useEffect, useState } from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import type { BlogArticle } from '@/types';
import { api } from '@/lib/api';

const emptyArticle = { title: '', slug: '', excerpt: '', content: '', category: 'Inspiration', featured_image_url: '', author: 'Vaishnavi Marble', tags: '', is_published: false };

type ArticleForm = typeof emptyArticle;

export function BlogAdmin() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [form, setForm] = useState<ArticleForm>(emptyArticle);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = async () => {
    setError(null);
    try {
      setArticles(await api.getAdminBlogArticles());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load blog articles');
      setArticles([]);
    }
  };

  useEffect(() => { loadArticles(); }, []);

  const openForm = (article?: BlogArticle) => {
    if (article) {
      setEditingId(article.id);
      setForm({ title: article.title, slug: article.slug, excerpt: article.excerpt, content: article.content, category: article.category, featured_image_url: article.featured_image_url ?? '', author: article.author, tags: article.tags.join(', '), is_published: article.is_published });
    } else {
      setEditingId(null);
      setForm(emptyArticle);
    }
    setError(null);
    setShowForm(true);
  };

  const saveArticle = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean), featured_image_url: form.featured_image_url || null };

    try {
      if (editingId) {
        await api.admin.updateBlogArticle(editingId, payload);
      } else {
        await api.admin.createBlogArticle(payload);
      }
      setShowForm(false);
      await loadArticles();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const removeArticle = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await api.admin.deleteBlogArticle(id);
      await loadArticles();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete article');
    }
  };

  const update = (field: keyof ArticleForm, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-stone-500">{articles.length} articles</p>
          <p className="text-xs text-stone-400">Blog management via backend API</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-1.5 bg-stone-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-900">
          <Plus size={16} /> Add Article
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="divide-y divide-stone-100">
          {articles.map((article) => (
            <div key={article.id} className="px-4 py-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-stone-700">{article.title}</p>
                <p className="text-xs text-stone-500">{article.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openForm(article)} className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"><Pencil size={16} /></button>
                <button onClick={() => removeArticle(article.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-800">{editingId ? 'Edit Article' : 'Add Article'}</h2>
              <button onClick={() => setShowForm(false)} className="text-stone-500 hover:text-stone-700"><X size={24} /></button>
            </div>

            <form onSubmit={saveArticle} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => update('title', e.target.value)} required className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => update('slug', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} rows={3} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => update('content', e.target.value)} rows={5} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Tags</label>
                <input value={form.tags} onChange={(e) => update('tags', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-stone-300 text-stone-700 py-2.5 rounded-lg font-medium hover:bg-stone-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-stone-800 text-white py-2.5 rounded-lg font-medium hover:bg-stone-900 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? 'Saving...' : <><Save size={16} /> {editingId ? 'Update' : 'Create'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
