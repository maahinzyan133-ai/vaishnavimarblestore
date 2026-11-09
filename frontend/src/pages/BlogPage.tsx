import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, User, ArrowRight, Loader } from 'lucide-react';
import { api } from '@/lib/api';
import { navigate } from '@/lib/router';
import type { BlogArticle } from '@/types';

export function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const typedArticles = await api.getBlogArticles();
      setArticles(typedArticles);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(typedArticles.map(a => a.category))
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        a => a.title.toLowerCase().includes(query) ||
             a.excerpt.toLowerCase().includes(query) ||
             a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    return filtered;
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-800 to-stone-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
          <p className="text-stone-300 text-lg max-w-2xl">Expert tips, trends, and guides for marble, tiles, and interior design</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              All Articles
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-stone-800 text-white'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={32} className="animate-spin text-stone-600" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-600 text-lg">No articles found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <article
                key={article.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                onClick={() => navigate(`/blog/${article.slug}`)}
              >
                {article.featured_image_url && (
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3 text-sm text-stone-500">
                    <span className="inline-block px-2 py-1 bg-stone-100 rounded text-xs font-medium text-stone-700">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-stone-900 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <User size={14} /> {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {new Date(article.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-stone-400 group-hover:text-stone-700 transition-colors" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
