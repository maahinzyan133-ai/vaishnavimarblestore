import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ProductFiltersProps {
  materials: string[];
  colors: string[];
  sizes: string[];
  onMaterialChange: (material: string | null) => void;
  onColorChange: (color: string | null) => void;
  onSizeChange: (size: string | null) => void;
  onPriceChange: (range: [number, number]) => void;
  minPrice?: number;
  maxPrice?: number;
}

export function ProductFilters({
  materials,
  colors,
  sizes,
  onMaterialChange,
  onColorChange,
  onSizeChange,
  onPriceChange,
  minPrice = 0,
  maxPrice = 50000,
}: ProductFiltersProps) {
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['material', 'price']);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  const toggleFilter = (filter: string) => {
    setExpandedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newRange = type === 'min' ? [value, priceRange[1]] : [priceRange[0], value];
    setPriceRange(newRange as [number, number]);
    onPriceChange(newRange as [number, number]);
  };

  return (
    <div className="space-y-4">
      {/* Material Filter */}
      <div className="bg-white rounded-lg border border-stone-200">
        <button
          onClick={() => toggleFilter('material')}
          className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
        >
          <h3 className="font-semibold text-stone-800">Material</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedFilters.includes('material') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedFilters.includes('material') && (
          <div className="px-4 pb-4 border-t border-stone-200 space-y-2">
            {materials.map(material => (
              <label key={material} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => onMaterialChange(e.target.checked ? material : null)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">{material}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="bg-white rounded-lg border border-stone-200">
        <button
          onClick={() => toggleFilter('price')}
          className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
        >
          <h3 className="font-semibold text-stone-800">Price</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedFilters.includes('price') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedFilters.includes('price') && (
          <div className="px-4 pb-4 border-t border-stone-200 space-y-4">
            <div>
              <label className="text-sm text-stone-700 block mb-2">Min: ₹{priceRange[0]}</label>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-stone-700 block mb-2">Max: ₹{priceRange[1]}</label>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="bg-white rounded-lg border border-stone-200">
        <button
          onClick={() => toggleFilter('color')}
          className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
        >
          <h3 className="font-semibold text-stone-800">Color</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedFilters.includes('color') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedFilters.includes('color') && (
          <div className="px-4 pb-4 border-t border-stone-200 space-y-2">
            {colors.map(color => (
              <label key={color} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => onColorChange(e.target.checked ? color : null)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">{color}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="bg-white rounded-lg border border-stone-200">
        <button
          onClick={() => toggleFilter('size')}
          className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
        >
          <h3 className="font-semibold text-stone-800">Size</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedFilters.includes('size') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedFilters.includes('size') && (
          <div className="px-4 pb-4 border-t border-stone-200 space-y-2">
            {sizes.map(size => (
              <label key={size} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => onSizeChange(e.target.checked ? size : null)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-700">{size}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
