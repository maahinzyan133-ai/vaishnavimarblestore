import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Category } from '@/types';
import { navigate } from '@/lib/router';

const AUTO_ADVANCE_MS = 4000;

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % categories.length);
  }, [categories.length]);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + categories.length) % categories.length);
  }, [categories.length]);

  const goTo = (idx: number) => setCurrent(idx);

  useEffect(() => {
    if (isPaused || categories.length <= 1) return;
    timerRef.current = setInterval(next, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, next, categories.length]);

  if (categories.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {categories.map(cat => (
          <div
            key={cat.id}
            className="relative w-full shrink-0 h-[420px] md:h-[560px] lg:h-[640px]"
          >
            {cat.image_url ? (
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-stone-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-16 max-w-xl">
                <span className="inline-block bg-amber-500/90 text-stone-900 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
                  Premium Collection
                </span>
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-stone-200 text-sm md:text-lg mb-6 line-clamp-3 drop-shadow leading-relaxed">
                    {cat.description}
                  </p>
                )}
                <button
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="inline-flex items-center gap-2 bg-white text-stone-900 px-7 py-3.5 rounded-lg font-semibold hover:bg-amber-400 hover:text-stone-900 transition-all hover:scale-105 shadow-lg"
                >
                  Shop Now <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      {categories.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous category"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            aria-label="Next category"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Dots */}
      {categories.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => goTo(idx)}
              aria-label={`Go to ${cat.name}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      <div className="absolute top-4 right-4 bg-black/40 text-white text-xs font-medium px-3 py-1 rounded-full">
        {current + 1} / {categories.length}
      </div>
    </div>
  );
}
