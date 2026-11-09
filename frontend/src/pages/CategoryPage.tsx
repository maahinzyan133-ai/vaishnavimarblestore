import { useState, useEffect, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronRight } from 'lucide-react';
import { navigate } from '@/lib/router';
import type { Category, Subcategory, Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';

interface Props {
  categorySlug: string;
  subcategorySlug?: string;
}

const PRICE_RANGES = [
  { label: 'Under Rs. 500', min: 0, max: 500 },
  { label: 'Rs. 500 - 1,000', min: 500, max: 1000 },
  { label: 'Rs. 1,000 - 2,500', min: 1000, max: 2500 },
  { label: 'Rs. 2,500 - 5,000', min: 2500, max: 5000 },
  { label: 'Rs. 5,000 - 10,000', min: 5000, max: 10000 },
  { label: 'Rs. 10,000+', min: 10000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'discount', label: 'Highest Discount' },
  { value: 'rating', label: 'Highest Rated' },
];

const COLORS = ['White', 'Black', 'Grey', 'Beige', 'Brown', 'Cream', 'Blue', 'Green', 'Red', 'Multicolor', 'Silver'];
const MATERIALS = ['Ceramic', 'Vitrified', 'Porcelain', 'Marble', 'Granite', 'Stainless Steel', 'HDHMR', 'PVC', 'Glass'];
const FINISHES = ['Matte', 'Glossy', 'Polished', 'Rustic', 'Brushed'];

export function CategoryPage({ categorySlug, subcategorySlug }: Props) {
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    setLoading(true);

    const load = async () => {
      try {
        const categories = await api.getCategories(categorySlug);
        const currentCategory = categories.find(item => item.slug === categorySlug || item.name === categorySlug);
        setCategory(currentCategory ?? null);

        const categoryId = currentCategory?.id;
        if (!categoryId) {
          setSubcategories([]);
          setProducts([]);
          setLoading(false);
          return;
        }

        const categorySubcategories = await api.getSubcategoriesByCategoryId(categoryId);
        const subs = Array.isArray(categorySubcategories) ? categorySubcategories : [];
        setSubcategories(subs as Subcategory[]);

        let nextProducts: Product[] = [];
        if (subcategorySlug) {
          const match = subs.find(sub => sub.slug === subcategorySlug);
          if (match) {
            const list = await api.getProducts({ subcategory_id: match.id });
            nextProducts = Array.isArray(list) ? (list as Product[]) : [];
          }
        } else {
          const ids = subs.map(sub => sub.id);
          if (ids.length > 0) {
            const list = await api.getProducts({ category_id: categoryId });
            nextProducts = Array.isArray(list) ? (list as Product[]) : [];
          }
        }

        setProducts(nextProducts);
      } catch (error) {
        console.error('Category loading error:', error);
        setCategory(null);
        setSubcategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categorySlug, subcategorySlug]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.brand) set.add(p.brand); });
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedPriceRanges.length > 0) {
      result = result.filter((p) => selectedPriceRanges.some((idx) => {
        const range = PRICE_RANGES[idx];
        return p.price >= range.min && p.price < range.max;
      }));
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) => {
        if (!p.color) return false;
        return selectedColors.some((c) => p.color!.toLowerCase().includes(c.toLowerCase()));
      });
    }

    if (selectedMaterials.length > 0) {
      result = result.filter((p) => p.material && selectedMaterials.includes(p.material));
    }

    if (selectedFinishes.length > 0) {
      result = result.filter((p) => p.finish && selectedFinishes.includes(p.finish));
    }

    if (inStockOnly) {
      result = result.filter((p) => p.stock_status === 'In Stock');
    }

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'discount': result.sort((a, b) => {
        const da = a.mrp > 0 ? (a.mrp - a.price) / a.mrp : 0;
        const db = b.mrp > 0 ? (b.mrp - b.price) / b.mrp : 0;
        return db - da;
      }); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => b.id.localeCompare(a.id)); break;
      default: result.sort((a, b) => a.display_order - b.display_order); break;
    }

    return result;
  }, [products, selectedPriceRanges, selectedBrands, selectedColors, selectedMaterials, selectedFinishes, inStockOnly, minRating, sortBy]);

  const activeSubcategory = subcategorySlug ? subcategories.find((s) => s.slug === subcategorySlug) : null;

  const toggleArray = (arr: string[], val: string): string[] => arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
  const togglePriceRange = (idx: number) => setSelectedPriceRanges((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
  const clearAllFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedFinishes([]);
    setInStockOnly(false);
    setMinRating(0);
  };

  const activeFilterCount = selectedPriceRanges.length + selectedBrands.length + selectedColors.length + selectedMaterials.length + selectedFinishes.length + (inStockOnly ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-stone-800 text-sm mb-3">Price</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, idx) => (
            <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
              <input type="checkbox" checked={selectedPriceRanges.includes(idx)} onChange={() => togglePriceRange(idx)} className="rounded border-stone-300 text-stone-800 focus:ring-stone-700" />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h4 className="font-semibold text-stone-800 text-sm mb-3">Brand</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
                <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => setSelectedBrands((prev) => toggleArray(prev, brand))} className="rounded border-stone-300 text-stone-800 focus:ring-stone-700" />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-stone-800 text-sm mb-3">Color</h4>
        <div className="space-y-2">
          {COLORS.map((color) => (
            <label key={color} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
              <input type="checkbox" checked={selectedColors.includes(color)} onChange={() => setSelectedColors((prev) => toggleArray(prev, color))} className="rounded border-stone-300 text-stone-800 focus:ring-stone-700" />
              {color}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-stone-800 text-sm mb-3">Material</h4>
        <div className="space-y-2">
          {MATERIALS.map((material) => (
            <label key={material} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
              <input type="checkbox" checked={selectedMaterials.includes(material)} onChange={() => setSelectedMaterials((prev) => toggleArray(prev, material))} className="rounded border-stone-300 text-stone-800 focus:ring-stone-700" />
              {material}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-stone-800 text-sm mb-3">Finish</h4>
        <div className="space-y-2">
          {FINISHES.map((finish) => (
            <label key={finish} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
              <input type="checkbox" checked={selectedFinishes.includes(finish)} onChange={() => setSelectedFinishes((prev) => toggleArray(prev, finish))} className="rounded border-stone-300 text-stone-800 focus:ring-stone-700" />
              {finish}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-stone-800 text-sm mb-3">Availability</h4>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="rounded border-stone-300 text-stone-800 focus:ring-stone-700" />
          In Stock Only
        </label>
      </div>

      <div>
        <h4 className="font-semibold text-stone-800 text-sm mb-3">Rating</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800"><input type="radio" name="rating" checked={minRating === 0} onChange={() => setMinRating(0)} className="text-stone-800 focus:ring-stone-700" />All Ratings</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800"><input type="radio" name="rating" checked={minRating === 4} onChange={() => setMinRating(4)} className="text-stone-800 focus:ring-stone-700" />4 Stars & Above</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800"><input type="radio" name="rating" checked={minRating === 3} onChange={() => setMinRating(3)} className="text-stone-800 focus:ring-stone-700" />3 Stars & Above</label>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearAllFilters} className="w-full text-sm text-stone-600 hover:text-stone-900 underline">Clear All Filters ({activeFilterCount})</button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-sm text-stone-500 mb-4">
        <button onClick={() => navigate('/')} className="hover:text-stone-700">Home</button>
        <ChevronRight size={14} />
        <button onClick={() => navigate(`/category/${categorySlug}`)} className="hover:text-stone-700">{category?.name || 'Category'}</button>
        {activeSubcategory && (<><ChevronRight size={14} /><span className="text-stone-800 font-medium">{activeSubcategory.name}</span></>) }
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800">{activeSubcategory ? activeSubcategory.name : category?.name}</h1>
        <p className="text-stone-500 mt-1">{activeSubcategory ? activeSubcategory.description : category?.description}</p>
      </div>

      {!subcategorySlug && subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {subcategories.map((sub) => (
            <button key={sub.id} onClick={() => navigate(`/category/${categorySlug}/sub/${sub.slug}`)} className="px-4 py-2 bg-stone-100 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-200 transition-colors">{sub.name}</button>
          ))}
        </div>
      )}

      {subcategorySlug && subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => navigate(`/category/${categorySlug}`)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${!activeSubcategory ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>All</button>
          {subcategories.map((sub) => (
            <button key={sub.id} onClick={() => navigate(`/category/${categorySlug}/sub/${sub.slug}`)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${sub.slug === subcategorySlug ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>{sub.name}</button>
          ))}
        </div>
      )}

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-800">Filters</h3>
              {activeFilterCount > 0 && <span className="text-xs bg-stone-800 text-white px-2 py-0.5 rounded-full">{activeFilterCount}</span>}
            </div>
            <FilterPanel />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-stone-500">{loading ? 'Loading...' : `${filteredProducts.length} products found`}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-1.5 text-sm text-stone-700 border border-stone-300 px-3 py-2 rounded-lg"><SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && <span className="bg-stone-800 text-white text-xs px-1.5 rounded-full">{activeFilterCount}</span>}</button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-stone-300 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-700">
                {SORT_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-stone-200 animate-pulse aspect-[3/4]" />)}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-stone-400"><p className="text-lg font-medium">No products match your filters</p><button onClick={clearAllFilters} className="mt-3 text-sm text-stone-700 underline">Clear filters</button></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-800">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-stone-500"><X size={24} /></button>
            </div>
            <FilterPanel />
            <button onClick={() => setShowFilters(false)} className="w-full bg-stone-800 text-white py-3 rounded-lg font-medium mt-6">Show {filteredProducts.length} Results</button>
          </div>
        </div>
      )}
    </div>
  );
}
