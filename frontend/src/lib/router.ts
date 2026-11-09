import { useState, useEffect, useCallback } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'category'; categorySlug: string }
  | { name: 'subcategory'; categorySlug: string; subcategorySlug: string }
  | { name: 'product'; productSlug: string }
  | { name: 'cart' }
  | { name: 'admin' }
  | { name: 'blog' }
  | { name: 'blogArticle'; slug: string }
  | { name: 'search'; query: string };

function parseHash(): Route {
  const hash = window.location.hash.slice(1);
  if (!hash || hash === '/') return { name: 'home' };

  const parts = hash.split('/').filter(Boolean);

  if (parts[0] === 'category' && parts[1]) {
    if (parts[2] === 'sub' && parts[3]) {
      return { name: 'subcategory', categorySlug: parts[1], subcategorySlug: parts[3] };
    }
    return { name: 'category', categorySlug: parts[1] };
  }

  if (parts[0] === 'product' && parts[1]) {
    return { name: 'product', productSlug: parts[1] };
  }

  if (parts[0] === 'cart')  return { name: 'cart' };
  if (parts[0] === 'admin') return { name: 'admin' };

  if (parts[0] === 'blog') {
    if (parts[1]) return { name: 'blogArticle', slug: parts[1] };
    return { name: 'blog' };
  }
  if (parts[0] === 'search' && parts[1]) {
    return { name: 'search', query: decodeURIComponent(parts[1]) };
  }

  return { name: 'home' };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  return { route, navigate };
}

export function navigate(path: string) {
  window.location.hash = path;
}
