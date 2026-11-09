interface SeoMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
}

export function setSeoMeta(meta: SeoMeta) {
  // Set basic meta tags
  document.title = meta.title;
  updateMetaTag('description', meta.description);
  updateMetaTag('og:title', meta.title);
  updateMetaTag('og:description', meta.description);

  if (meta.image) {
    updateMetaTag('og:image', meta.image);
    updateMetaTag('twitter:image', meta.image);
  }

  if (meta.url) {
    updateMetaTag('og:url', meta.url);
  }

  if (meta.type) {
    updateMetaTag('og:type', meta.type);
  }

  if (meta.author) {
    updateMetaTag('article:author', meta.author);
  }

  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', meta.title);
  updateMetaTag('twitter:description', meta.description);
}

function updateMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    if (name.startsWith('og:')) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function generateJsonLd(type: string, data: Record<string, unknown>) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  });
  document.head.appendChild(script);
}
