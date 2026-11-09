import { useEffect, useState } from 'react';
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Home,
  MessageCircle,
  Phone,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Gem,
} from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { navigate } from '@/lib/router';
import { whatsappEnquiry } from '@/lib/whatsapp';
import { api } from '@/lib/api';
import type { Category, Subcategory } from '@/types';

/* ============================================================
   SECOND HEADER — TOP CATEGORIES + SUBCATEGORIES
============================================================ */

type MegaColumn = {
  title: string;
  items: { name: string; path: string }[];
};

type MegaMenu = {
  name: string;
  icon: typeof Gem;
  route: string;
  columns: MegaColumn[];
};


/* ============================================================
   HEADER COMPONENT
============================================================ */

export function Header() {
  const { totalItems, setIsOpen } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [openMobileMega, setOpenMobileMega] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const categoryList = await api.getCategories();
        const subcategoryLists = await Promise.all(
          categoryList.map(category => api.getSubcategoriesByCategoryId(category.id)),
        );
        if (!active) return;
        setCategories(categoryList);
        setSubcategories(subcategoryLists.flat());
      } catch (error) {
        console.error('Failed to load header categories:', error);
      }
    };

    const refreshCategories = () => {
      void loadCategories();
    };

    void loadCategories();
    window.addEventListener('catalog:categories-updated', refreshCategories);
    return () => {
      active = false;
      window.removeEventListener('catalog:categories-updated', refreshCategories);
    };
  }, []);

  const megaMenus: MegaMenu[] = categories.map(category => ({
    name: category.name,
    icon: Gem,
    route: `/category/${category.slug}`,
    columns: [{
      title: `${category.name} Subcategories`,
      items: subcategories
        .filter(subcategory => subcategory.category_id === category.id)
        .map(subcategory => ({
          name: subcategory.name,
          path: `/category/${category.slug}/sub/${subcategory.slug}`,
        })),
    }],
  }));

  /* ==========================================================
     LIVE CLOCK
  ========================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ==========================================================
     BODY SCROLL LOCK
  ========================================================== */

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    setActiveMega(null);
    setOpenMobileMega(null);

    navigate(path);
  };

  /* ==========================================================
     SEARCH
  ========================================================== */

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const q = searchQuery.trim();

    if (!q) {
      goTo('/products');
      return;
    }

    setMobileMenuOpen(false);

    navigate(
      `/products?search=${encodeURIComponent(q)}`
    );
  };

  /* ==========================================================
     MEGA MENU ITEM
  ========================================================== */

  const handleMegaItemClick = (path: string) => {
    setActiveMega(null);
    setOpenMobileMega(null);
    setMobileMenuOpen(false);

    navigate(path);
  };

  /* ==========================================================
     GET DROPDOWN GRID
  ========================================================== */

  const getGridClass = (columnCount: number) => {
    if (columnCount >= 4) {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }

    if (columnCount === 3) {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }

    return 'grid-cols-1 sm:grid-cols-2';
  };

  return (
    <>
      {/* ======================================================
          LIVE MARQUEE
      ======================================================= */}

      <div className="sticky top-0 z-[70] w-full overflow-hidden bg-[#020609] text-white">

        <div className="w-full overflow-hidden border-b border-white/[0.06] bg-[#050b10]">

          <div className="mx-auto w-full max-w-[1600px] px-3 lg:px-7">

            <div className="flex h-9 items-center overflow-hidden">

              <div className="flex min-w-max animate-[marquee_45s_linear_infinite] items-center gap-4 whitespace-nowrap text-[10px] font-semibold sm:text-[11px] md:text-xs">

                <span className="font-extrabold text-[#ff9d17]">
                  VAISHNAVI MARBLE SHOP
                </span>

                <span className="text-white/30">•</span>

                <span className="text-cyan-300">
                  Tiles
                </span>

                <span className="text-white/30">•</span>

                <span className="text-emerald-300">
                  Sanitaryware
                </span>

                <span className="text-white/30">•</span>

                <span className="text-blue-300">
                  Kitchen Sink
                </span>

                <span className="text-white/30">•</span>

                <span className="text-purple-300">
                  Bathroom Vanity
                </span>

                <span className="text-white/30">•</span>

                <span className="text-yellow-300">
                  Parking Tiles
                </span>

                <span className="text-white/30">•</span>

                <span className="text-pink-300">
                  Marble &amp; Granite
                </span>

                <span className="mx-2 text-white/20">
                  |
                </span>

                <span className="text-orange-300">
                  Kajaria
                </span>

                <span className="text-white/30">•</span>

                <span className="text-green-300">
                  Johnson
                </span>

                <span className="text-white/30">•</span>

                <span className="text-sky-300">
                  Jaquar
                </span>

                <span className="text-white/30">•</span>

                <span className="text-violet-300">
                  Fortiva
                </span>

                <span className="text-white/30">•</span>

                <span className="text-emerald-300">
                  Somany
                </span>

                <span className="text-white/30">•</span>

                <span className="text-cyan-300">
                  Vitero
                </span>

                <span className="text-white/30">•</span>

                <span className="text-pink-300">
                  Sika
                </span>

                <span className="text-white/30">•</span>

                <span className="text-yellow-300">
                  Hindware
                </span>

                <span className="text-white/30">•</span>

                <span className="text-rose-300">
                  Parryware
                </span>

                <span className="text-white/30">•</span>

                <span className="text-amber-300">
                  Varmora
                </span>

                <span className="text-white/30">•</span>

                <span className="text-blue-300">
                  ROOF
                </span>

                <span className="text-white/30">•</span>

                <span className="text-lime-300">
                  Nitco
                </span>

                <span className="text-white/30">•</span>

                <span className="text-purple-300">
                  CERO
                </span>

                <span className="text-white/30">•</span>

                <span className="text-orange-300">
                  Lemovia
                </span>

                <span className="text-white/30">•</span>

                <span className="text-fuchsia-300">
                  Wonder Ceramic
                </span>

                <span className="mx-2 text-white/20">
                  |
                </span>

                <span className="font-extrabold text-[#ff9d17]">
                  Bajaj Finserv
                </span>

                <span className="text-white/30">•</span>

                <span className="font-bold text-green-400">
                  0 Down Payment*
                </span>

                <span className="text-white/30">•</span>

                <span className="font-bold text-amber-300">
                  Easy EMI Available
                </span>

                <span className="text-white/30">•</span>

                <span className="font-bold text-white">
                  📅{' '}
                  {currentDateTime.toLocaleDateString(
                    'en-IN',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }
                  )}
                </span>

                <span className="text-white/30">
                  •
                </span>

                <span className="font-bold text-[#ff9d17]">
                  🕒{' '}
                  {currentDateTime.toLocaleTimeString(
                    'en-IN',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    }
                  )}
                </span>

                <span className="mx-2 text-white/20">
                  |
                </span>

                <span className="text-white">
                  Premium Quality
                </span>

                <span className="text-white/30">
                  •
                </span>

                <span className="text-[#ff9d17]">
                  Latest Designs
                </span>

                <span className="text-white/30">
                  •
                </span>

                <span className="text-emerald-300">
                  Trusted Brands
                </span>

                <span className="text-white/30">
                  •
                </span>

                <span className="text-cyan-300">
                  Flexible Payment Options
                </span>

                <span className="text-white/30">
                  •
                </span>

                <span className="text-white/50">
                  *Subject to eligibility &amp; applicable terms
                </span>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN HEADER
      ======================================================= */}

      <header className="sticky top-9 z-[65] w-full overflow-hidden bg-[#020405] text-white shadow-2xl">

        <div className="w-full border-b border-white/[0.08]">

          <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-7">

            <div className="flex min-h-[76px] items-center gap-2 sm:gap-3">

              {/* MOBILE MENU */}
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen((prev) => !prev)
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition-all duration-300 hover:bg-white/10 hover:text-[#ff9d17] lg:hidden"
                aria-label={
                  mobileMenuOpen
                    ? 'Close menu'
                    : 'Open menu'
                }
              >
                {mobileMenuOpen ? (
                  <X size={23} />
                ) : (
                  <Menu size={23} />
                )}
              </button>

              {/* LOGO */}
              <button
                type="button"
                onClick={() => goTo('/')}
                className="group flex min-w-0 shrink-0 items-center gap-2.5"
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#000000] shadow-lg ring-1 ring-white/10 transition-all duration-300 group-hover:ring-[#ff9d17]/60">
                  <img
                    src="/logo.jpeg"
                    alt="Vaishnavi Marble"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="hidden text-left sm:block">
                  <div className="whitespace-nowrap text-[17px] font-extrabold leading-none tracking-wide text-[#ff9d17] md:text-[18px]">
                    VAISHNAVI{' '}
                    <span className="text-[#ff9d17]">
                      MARBLE
                    </span>
                  </div>

                  <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-white md:text-[10px] md:tracking-[0.28em]">
                    Tiles • Marble • Interiors
                  </div>
                </div>
              </button>

              {/* DESKTOP NAV */}
              <nav className="ml-2 hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:ml-4">

                <button
                  type="button"
                  onClick={() => goTo('/')}
                  className="group flex items-center gap-1.5 rounded-md px-2 py-2.5 text-[12px] font-semibold text-white transition-all duration-300 hover:bg-[#111111] hover:text-[#ff9d17] xl:px-3 xl:text-[13px]"
                >
                  <Home
                    size={17}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <span>Home</span>
                </button>

                <button
                  type="button"
                  onClick={() => goTo('/products')}
                  className="rounded-md bg-[#111111] px-2 py-2.5 text-[12px] font-semibold text-white transition-all duration-300 hover:bg-[#ff9d17] hover:text-black xl:px-3 xl:text-[13px]"
                >
                  All Products
                </button>

                <button
                  type="button"
                  onClick={() => goTo('/blog')}
                  className="rounded-md px-2 py-2.5 text-[12px] font-semibold text-white transition-all duration-300 hover:bg-[#111111] hover:text-[#ff9d17] xl:px-3 xl:text-[13px]"
                >
                  Blog
                </button>

              </nav>

              {/* RIGHT SIDE */}
              <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">

                {/* SEARCH */}
                <form
                  onSubmit={handleSearch}
                  className="hidden md:block"
                >
                  <div className="relative">

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value)
                      }
                      placeholder="Search products..."
                      aria-label="Search products"
                      className="h-10 w-[150px] rounded-lg border border-white/10 bg-[#0c0f11] pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-300 focus:w-[190px] focus:border-[#ff9d17] focus:ring-1 focus:ring-[#ff9d17] lg:w-[200px] xl:w-[220px]"
                    />

                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                  </div>
                </form>

                {/* WHATSAPP */}
                <a
                  href={whatsappEnquiry(
                    'I have a general enquiry about your products.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-[#ff9d17] transition-all duration-300 hover:bg-[#111111] hover:text-[#25D366]"
                >
                  <MessageCircle size={22} />
                </a>

                {/* PHONE */}
                <a
                  href="tel:+919330300408"
                  className="hidden items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2 text-[12px] font-semibold text-white transition-all duration-300 hover:bg-[#111111] hover:text-[#ff9d17] lg:flex"
                >
                  <Phone
                    size={16}
                    className="text-[#ff9d17]"
                  />

                  <span>93303 00408</span>
                </a>

                {/* CART */}
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  aria-label="Open cart"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-lg text-white transition-all duration-300 hover:bg-[#111111] hover:text-[#ff9d17]"
                >
                  <ShoppingCart
                    size={23}
                    className="transition-transform duration-300 group-hover:-rotate-6"
                  />

                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff9d17] px-1 text-[10px] font-bold text-black shadow-lg">
                      {totalItems > 99
                        ? '99+'
                        : totalItems}
                    </span>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================
          SECOND HEADER — DESKTOP
      ======================================================= */}

      <nav
        aria-label="Shop categories"
        className="relative z-[60] hidden w-full max-w-full overflow-visible border-b border-white/[0.08] bg-[#080b0e] text-white lg:block"
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-3 lg:px-5 xl:px-7">

          {/* HORIZONTAL CATEGORY BAR */}
          <div className="flex h-[56px] w-full min-w-0 items-center justify-start overflow-x-auto overflow-y-visible">

            <div className="flex h-full min-w-max items-center">

              {megaMenus.map((menu) => {
                const Icon = menu.icon;
                const isActive =
                  activeMega === menu.name;

                const columnCount =
                  menu.columns.length;

                return (
                  <div
                    key={menu.name}
                    className="relative h-full shrink-0"
                    onMouseEnter={() =>
                      setActiveMega(menu.name)
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        menu.route &&
                        goTo(menu.route)
                      }
                      className={`
                        group flex h-full items-center gap-1
                        whitespace-nowrap px-2.5
                        text-[11px] font-bold
                        transition-all duration-200
                        sm:px-3 sm:text-xs
                        xl:px-4 xl:text-[13px]
                        ${
                          isActive
                            ? 'bg-[#ff9d17] text-black'
                            : 'text-white hover:bg-[#111111] hover:text-[#ff9d17]'
                        }
                      `}
                    >
                      <Icon
                        size={15}
                        className="shrink-0 sm:size-[16px]"
                      />

                      <span>
                        {menu.name}
                      </span>

                      <ChevronDown
                        size={12}
                        className={`
                          shrink-0 transition-transform duration-200
                          ${
                            isActive
                              ? 'rotate-180'
                              : ''
                          }
                        `}
                      />
                    </button>

                    {/* ==================================================
                        RESPONSIVE MEGA DROPDOWN
                    =================================================== */}

                    <div
                      className={`
                        fixed left-1/2 top-[calc(9rem+56px)]
                        z-[100]
                        w-[calc(100vw-20px)]
                        max-w-[1180px]
                        -translate-x-1/2
                        overflow-hidden
                        rounded-b-2xl
                        border border-stone-200
                        bg-white
                        text-stone-900
                        shadow-2xl
                        transition-all duration-200
                        ${
                          isActive
                            ? 'visible translate-y-0 opacity-100'
                            : 'invisible -translate-y-2 opacity-0 pointer-events-none'
                        }
                      `}
                    >
                      <div className="max-h-[calc(100vh-150px)] overflow-y-auto overscroll-contain">

                        {/* DROPDOWN HEADER */}
                        <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-stone-200 bg-white/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ff9d17]/15 text-[#ff9d17]">
                              <Icon size={18} />
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-base font-extrabold sm:text-lg">
                                {menu.name}
                              </h3>

                              <p className="truncate text-[11px] text-stone-500 sm:text-xs">
                                Explore our{' '}
                                {menu.name.toLowerCase()}{' '}
                                collection
                              </p>
                            </div>

                          </div>

                          {menu.route && (
                            <button
                              type="button"
                              onClick={() =>
                                goTo(menu.route!)
                              }
                              className="w-full shrink-0 rounded-lg bg-stone-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-[#ff9d17] hover:text-black sm:w-auto"
                            >
                              View All →
                            </button>
                          )}

                        </div>

                        {/* DROPDOWN CONTENT */}
                        <div
                          className={`
                            grid gap-5 p-4 sm:p-5
                            ${getGridClass(columnCount)}
                          `}
                        >
                          {menu.columns.map((col) => (
                            <div
                              key={col.title}
                              className="min-w-0"
                            >

                              <div className="mb-3 flex items-center gap-2 border-b border-stone-200 pb-2">

                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-stone-100">
                                  <Grid3X3 size={12} />
                                </div>

                                <h4 className="truncate text-[10px] font-extrabold uppercase tracking-wider text-stone-700 sm:text-xs">
                                  {col.title}
                                </h4>

                              </div>

                              <ul className="grid grid-cols-1 gap-0.5 sm:grid-cols-1">

                                {col.items.map(
                                  (item) => (
                                    <li
                                      key={item.path}
                                      className="min-w-0"
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleMegaItemClick(item.path)
                                        }
                                        className="group flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] font-medium text-stone-600 transition-colors hover:bg-[#ff9d17]/10 hover:text-[#ff9d17] sm:text-[12.5px]"
                                      >

                                        <ChevronRight
                                          size={12}
                                          className="shrink-0 text-stone-300 group-hover:text-[#ff9d17]"
                                        />

                                        <span className="min-w-0 truncate">
                                          {item.name}
                                        </span>

                                      </button>
                                    </li>
                                  )
                                )}

                              </ul>
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </nav>

      {/* ======================================================
          MOBILE MENU DRAWER
      ======================================================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          {/* DRAWER */}
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-md overflow-y-auto overscroll-contain bg-[#050708] text-white shadow-2xl">

            {/* DRAWER HEADER */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#050708] px-4 py-3">

              <span className="text-sm font-extrabold tracking-wider text-[#ff9d17]">
                MENU
              </span>

              <button
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>

            </div>

            {/* MOBILE SEARCH */}
            <form
              onSubmit={handleSearch}
              className="border-b border-white/10 p-4"
            >
              <div className="relative">

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search products..."
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#0d1114] pl-10 pr-12 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#ff9d17] focus:ring-1 focus:ring-[#ff9d17]"
                />

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <button
                  type="submit"
                  className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-r-lg bg-[#ff9d17] text-black transition hover:bg-orange-500"
                >
                  <Search size={18} />
                </button>

              </div>
            </form>

            {/* QUICK LINKS */}
            <div className="py-2">

              {[
                {
                  label: 'Home',
                  path: '/',
                  icon: Home,
                },
                {
                  label: 'All Products',
                  path: '/products',
                  icon: null,
                  primary: true,
                },
                {
                  label: 'Blog',
                  path: '/blog',
                  icon: null,
                },
              ].map((item) => {

                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      goTo(item.path)
                    }
                    className={`
                      flex w-full items-center gap-3
                      px-5 py-3.5 text-left
                      font-semibold transition
                      ${
                        item.primary
                          ? 'bg-[#111111] text-white hover:bg-[#ff9d17] hover:text-black'
                          : 'hover:bg-[#111111] hover:text-[#ff9d17]'
                      }
                    `}
                  >
                    {Icon && (
                      <Icon size={18} />
                    )}

                    {item.label}
                  </button>
                );
              })}

            </div>

            {/* MOBILE MEGA MENU */}
            <div className="border-t border-white/10">

              <div className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-widest text-[#ff9d17]">
                Shop by Category
              </div>

              {megaMenus.map((menu) => {

                const Icon = menu.icon;

                const open =
                  openMobileMega ===
                  menu.name;

                return (
                  <div
                    key={menu.name}
                    className="border-b border-white/10"
                  >

                    {/* CATEGORY TITLE */}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileMega(
                          open
                            ? null
                            : menu.name
                        )
                      }
                      className={`
                        flex w-full items-center
                        justify-between
                        px-5 py-3.5
                        text-left font-semibold
                        transition
                        ${
                          open
                            ? 'bg-[#111111] text-[#ff9d17]'
                            : 'hover:bg-[#111111] hover:text-[#ff9d17]'
                        }
                      `}
                    >

                      <span className="flex min-w-0 items-center gap-3">

                        <Icon
                          size={18}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {menu.name}
                        </span>

                      </span>

                      <ChevronDown
                        size={16}
                        className={`
                          shrink-0 transition-transform
                          ${
                            open
                              ? 'rotate-180'
                              : ''
                          }
                        `}
                      />

                    </button>

                    {/* SUBCATEGORIES */}
                    {open && (
                      <div className="bg-[#080d11] px-4 py-3">

                        {menu.route && (
                          <button
                            type="button"
                            onClick={() =>
                              goTo(menu.route!)
                            }
                            className="mb-3 w-full rounded-lg bg-[#ff9d17] px-3 py-2.5 text-xs font-extrabold text-black"
                          >
                            View All{' '}
                            {menu.name} →
                          </button>
                        )}

                        <div className="space-y-5">

                          {menu.columns.map(
                            (col) => (
                              <div
                                key={col.title}
                              >

                                <h4 className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#ff9d17]">
                                  {col.title}
                                </h4>

                                <ul className="space-y-0.5">

                                  {col.items.map(
                                    (item) => (
                                      <li
                                        key={item.path}
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleMegaItemClick(item.path)
                                          }
                                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[12px] font-medium text-white/85 transition hover:bg-white/5 hover:text-[#ff9d17]"
                                        >

                                          <ChevronRight
                                            size={12}
                                            className="shrink-0 text-[#ff9d17]"
                                          />

                                          <span className="min-w-0 truncate">
                                            {item.name}
                                          </span>

                                        </button>
                                      </li>
                                    )
                                  )}

                                </ul>
                              </div>
                            )
                          )}

                        </div>
                      </div>
                    )}

                  </div>
                );
              })}

            </div>

            {/* MOBILE FOOTER ACTIONS */}
            <div className="border-t border-white/10 py-2">

              <a
                href="tel:+919330300408"
                className="flex items-center gap-3 px-5 py-3.5 font-semibold transition hover:bg-[#111111] hover:text-[#ff9d17]"
              >
                <Phone
                  size={18}
                  className="text-[#ff9d17]"
                />

                +91 93303 00408
              </a>

              <a
                href={whatsappEnquiry(
                  'I have a general enquiry about your products.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3.5 font-semibold text-green-400 transition hover:bg-[#111111]"
              >
                <MessageCircle size={18} />

                WhatsApp Enquiry
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-between px-5 py-3.5 text-left font-semibold transition hover:bg-[#111111] hover:text-[#ff9d17]"
              >

                <span className="flex items-center gap-3">
                  <ShoppingCart size={19} />
                  Cart
                </span>

                {totalItems > 0 && (
                  <span className="rounded-full bg-[#ff9d17] px-2 py-0.5 text-xs font-bold text-black">
                    {totalItems}
                  </span>
                )}

              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
