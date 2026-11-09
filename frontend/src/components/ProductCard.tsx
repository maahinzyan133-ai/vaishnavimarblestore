import { Star, ShoppingCart, Eye, MessageCircle } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { navigate } from '@/lib/router';
import { whatsappProductOrder } from '@/lib/whatsapp';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const priceStr = `Rs. ${product.price.toLocaleString('en-IN')}`;

  return (
    <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 cursor-pointer" onClick={() => navigate(`/product/${product.slug}`)}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">No Image</div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white/90 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5">
            <Eye size={16} /> View Details
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-semibold text-stone-800 text-sm leading-snug cursor-pointer hover:text-stone-900 line-clamp-2"
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          {product.name}
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          {product.brand} &middot; {product.material}
        </p>

        <div className="flex items-center gap-1 mt-2">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-stone-600">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-stone-400 ml-1">
            {product.stock_status === 'In Stock' ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-stone-900">
            Rs. {product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <span className="text-sm text-stone-400 line-through">
              Rs. {product.mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2 flex-1 items-end">
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock_status !== 'In Stock'}
            className="flex-1 bg-stone-800 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-stone-900 transition-colors flex items-center justify-center gap-1.5 disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
          <a
            href={whatsappProductOrder(product.name, priceStr)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            aria-label="Order on WhatsApp"
          >
            <MessageCircle size={16} />
          </a>
          <button
            onClick={() => navigate(`/product/${product.slug}`)}
            className="px-3 py-2.5 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            aria-label="View details"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
