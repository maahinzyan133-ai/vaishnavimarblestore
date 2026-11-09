import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';

export function SearchPage({ query }: { query: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api.searchProducts(query)
      .then((data) => {
        setProducts((data ?? []) as Product[]);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Search size={24} className="text-stone-400" />
        <h1 className="text-2xl font-bold text-stone-800">
          Search results for "{query}"
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-200 animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-2">Try a different search term</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-stone-500 mb-4">{products.length} products found</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
