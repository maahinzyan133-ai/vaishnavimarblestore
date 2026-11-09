import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Product } from '@/types';

export function ProductPage({ productSlug }: { productSlug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api.getProductBySlug(productSlug)
      .then((data) => {
        setProduct((data ?? null) as Product | null);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [productSlug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20">Loading...</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-800">{product.name}</h1>
      <p className="mt-4 text-xl text-stone-700">₹{product.price}</p>
      {product.description && (
        <p className="mt-4 text-stone-600">{product.description}</p>
      )}
    </div>
  );
}
