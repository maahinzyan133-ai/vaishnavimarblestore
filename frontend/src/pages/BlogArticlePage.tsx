import { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, Loader, Share2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { api } from '@/lib/api';
import { navigate } from '@/lib/router';
import type { BlogArticle } from '@/types';

interface BlogArticlePageProps {
  slug: string;
}

export function BlogArticlePage({ slug }: BlogArticlePageProps) {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await api.getBlogArticleBySlug(slug);
        setArticle(result.article);
        setRelatedArticles(result.related);
      } catch (error) {
        console.error('Error loading article:', error);
        setArticle(null);
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size={32} className="animate-spin text-stone-600" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-4">Article not found</h1>
        <button
          onClick={() => navigate('/blog')}
          className="inline-block bg-stone-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-stone-700 transition-colors"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Blog
          </button>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-stone-100 rounded text-sm font-medium text-stone-700">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-stone-900 mb-4">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-stone-600">
            <span className="flex items-center gap-2">
              <User size={16} /> {article.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} /> {new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <button className="flex items-center gap-2 hover:text-stone-900 transition-colors">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featured_image_url && (
        <div className="bg-stone-100 py-8">
          <div className="max-w-3xl mx-auto px-4">
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div
          className="prose prose-stone max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-stone-200">
            <h3 className="text-sm font-semibold text-stone-800 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => navigate(`/blog?search=${encodeURIComponent(tag)}`)}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-sm transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-stone-100 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-stone-800 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(article => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/blog/${article.slug}`)}
                >
                  {article.featured_image_url && (
                    <div className="h-40 overflow-hidden bg-stone-100">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-stone-800 group-hover:text-stone-900 line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-stone-600 line-clamp-2">{article.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
