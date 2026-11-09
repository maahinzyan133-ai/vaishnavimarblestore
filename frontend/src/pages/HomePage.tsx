import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Award, MessageCircle, ChevronLeft, ChevronRight, Phone, Truck, ShieldCheck, Headphones } from "lucide-react";

import type { Category, Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { whatsappEnquiry } from "@/lib/whatsapp";
import { useRouter } from "@/lib/router";
import { api } from "@/lib/api";

type HeroSlide = {
  type?: "image" | "emi";
  image: string;
  title?: string;
  subtitle?: string;
  button?: string;
  link?: string;
};

const HERO_SLIDES: HeroSlide[] = [
  { type: "emi", image: "/EMI_OFFER.png" },
  { image: "https://images.pexels.com/photos/7195883/pexels-photo-7195883.jpeg", title: "Premium Marble & Tiles", subtitle: "Transform your home with premium marble, granite and designer tiles.", button: "Shop Marble", link: "/category/marble-granite" },
  { image: "https://images.pexels.com/photos/6969861/pexels-photo-6969861.jpeg", title: "Designer Kitchen & Bath Tiles", subtitle: "Beautiful and durable tiles for modern kitchens and bathrooms.", button: "Explore Tiles", link: "/category/tiles" },
  { image: "https://images.pexels.com/photos/10410101/pexels-photo-10410101.jpeg", title: "Marble, Granite & Sanitaryware", subtitle: "Complete solutions for your home, office and commercial projects.", button: "View Products", link: "/products" },
  { image: "https://images.pexels.com/photos/4249687/pexels-photo-4249687.jpeg", title: "Marble Statues & Mandirs", subtitle: "Elegant marble statues, mandirs and handcrafted decorative pieces.", button: "Shop Statues", link: "/category/marble-statues" },
];

const TRUST_ITEMS = [
  { icon: Award, title: "Premium Quality", description: "Quality products selected for your needs" },
  { icon: Truck, title: "Safe Delivery", description: "Reliable delivery for your order" },
  { icon: ShieldCheck, title: "Trusted Service", description: "Transparent and dependable service" },
  { icon: Headphones, title: "Expert Support", description: "Get help choosing the right product" },
];

export function HomePage() {
  const { navigate } = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const image = new Image();
      image.src = slide.image;
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, []);

  const loadHomeData = useCallback(async () => {
    try {
      setLoading(true);

      const [categoriesResult, productsResult] = await Promise.all([
        api.getCategories(),
        api.getFeaturedProducts(),
      ]);

      setCategories((Array.isArray(categoriesResult) ? categoriesResult : []) as Category[]);
      setFeaturedProducts((Array.isArray(productsResult) ? productsResult : []) as Product[]);
    } catch (error) {
      console.error('Home page data loading error:', error);
      setCategories([]);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const getCategoryLink = (category: Category) => {
    const categoryData = category as Category & { slug?: string | null };
    const slug = categoryData.slug?.trim() || String(category.name).toLowerCase().trim().replace(/&/g, 'and').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `/category/${slug}`;
  };

  const previousSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);

  const handleWhatsApp = () => {
    try {
      const url = whatsappEnquiry('Hello, I would like to enquire about your marble, tiles and sanitaryware products.');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('WhatsApp enquiry error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-slate-900">
        <div className="relative min-h-[520px] md:min-h-[620px]">
          {HERO_SLIDES.map((slide, index) => (
            <div key={`${slide.image}-${index}`} className={`absolute inset-0 transition-opacity duration-700 ${currentSlide === index ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
              <img src={slide.image} alt={slide.title || 'Vaishnavi Marble'} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/45" />

              {slide.type === 'emi' ? (
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <div className="max-w-5xl text-center text-white">
                    <button type="button" onClick={handleWhatsApp} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition hover:bg-white/15">
                      <MessageCircle className="h-5 w-5" />
                      Enquire on WhatsApp
                    </button>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                    <div className="max-w-3xl text-white">
                      <div className="mb-4 inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">Vaishnavi Marble & Tiles</div>
                      <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">{slide.title}</h1>
                      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">{slide.subtitle}</p>
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={() => { if (slide.link) navigate(slide.link); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 font-bold text-slate-900 shadow-lg transition hover:bg-slate-100">
                          {slide.button || 'Explore'}
                          <ArrowRight className="h-5 w-5" />
                        </button>
                        <button type="button" onClick={handleWhatsApp} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition hover:bg-white/15">
                          <MessageCircle className="h-5 w-5" />
                          WhatsApp Enquiry
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={previousSlide} aria-label="Previous slide" className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"><ChevronLeft className="h-6 w-6" /></button>
          <button type="button" onClick={nextSlide} aria-label="Next slide" className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"><ChevronRight className="h-6 w-6" /></button>

          <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {HERO_SLIDES.map((_, index) => (
              <button key={`dot-${index}`} type="button" aria-label={`Go to slide ${index + 1}`} onClick={() => setCurrentSlide(index)} className={`h-2.5 rounded-full transition-all ${currentSlide === index ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y sm:grid-cols-4 sm:divide-y-0">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3 px-4 py-5 sm:px-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-500">Shop by Category</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Explore Our Collections</h2>
              <p className="mt-3 max-w-2xl text-slate-600">Discover marble, tiles, sanitaryware, kitchen sinks, bathroom vanities and more.</p>
            </div>
            <button type="button" onClick={() => navigate('/products')} className="inline-flex items-center gap-2 font-bold text-slate-900 hover:underline">View All Products <ArrowRight className="h-4 w-4" /></button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl bg-slate-200" />)}</div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => {
                const categoryData = category as Category & { image_url?: string | null; slug?: string | null };
                return (
                  <button key={category.id} type="button" onClick={() => navigate(getCategoryLink(category))} className="group overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      {categoryData.image_url ? (
                        <img src={categoryData.image_url} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4"><h3 className="text-base font-bold text-white sm:text-lg">{category.name}</h3></div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <h3 className="text-lg font-bold text-slate-900">Categories Coming Soon</h3>
              <p className="mt-2 text-sm text-slate-500">Our product collections will appear here.</p>
              <button type="button" onClick={() => navigate('/products')} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">Browse Products <ArrowRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-500">Featured Products</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Popular Picks</h2>
              <p className="mt-3 max-w-2xl text-slate-600">Explore some of our featured products selected for your home and projects.</p>
            </div>
            <button type="button" onClick={() => navigate('/products')} className="inline-flex items-center gap-2 font-bold text-slate-900 hover:underline">View All <ArrowRight className="h-4 w-4" /></button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-100" />)}</div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <h3 className="text-lg font-bold text-slate-900">Featured Products Coming Soon</h3>
              <p className="mt-2 text-sm text-slate-500">Products marked as featured in the admin panel will appear here.</p>
              <button type="button" onClick={() => navigate('/products')} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">Browse All Products <ArrowRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl bg-slate-800">
              <img src="/onwer.png" alt="Vaishnavi Marble" className="h-full max-h-[520px] w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-white/60">About Vaishnavi Marble</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Building Beautiful Spaces With Quality Materials</h2>
              <p className="mt-6 text-base leading-8 text-white/75">We offer a wide range of marble, granite, tiles, sanitaryware, kitchen sinks, bathroom vanities and other products for residential and commercial projects.</p>
              <p className="mt-4 text-base leading-8 text-white/75">Whether you are building a new home, renovating your bathroom or designing a commercial space, our team can help you find suitable products for your requirements.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => navigate('/products')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-bold text-slate-900 transition hover:bg-slate-100">Explore Products <ArrowRight className="h-5 w-5" /></button>
                <button type="button" onClick={handleWhatsApp} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"><MessageCircle className="h-5 w-5" />Talk to Us</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white"><Phone className="h-6 w-6" /></div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 sm:text-4xl">Looking for Bulk or Project Requirements?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">Contact us for project enquiries, bulk orders, product availability and assistance with selecting the right materials.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={handleWhatsApp} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-7 py-3.5 font-bold text-white transition hover:bg-green-700"><MessageCircle className="h-5 w-5" />WhatsApp Enquiry</button>
            <a href="tel:+919999999999" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-7 py-3.5 font-bold text-slate-900 transition hover:bg-slate-100"><Phone className="h-5 w-5" />Call Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
