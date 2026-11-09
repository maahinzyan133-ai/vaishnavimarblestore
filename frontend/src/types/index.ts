export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

export interface Product {
  id: string;
  subcategory_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  brand: string | null;
  material: string | null;
  size: string | null;
  thickness: string | null;
  finish: string | null;
  color: string | null;
  design: string | null;
  coverage_per_box: string | null;
  pieces_per_box: string | null;
  suitable_for: string | null;
  price: number;
  mrp: number;
  stock_status: string;
  rating: number;
  specs: Record<string, string>;
  is_featured: boolean;
  display_order: number;
}

export interface ProductWithRelations extends Product {
  subcategory?: Subcategory;
  category?: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  category: string;
  author: string;
  published_at: string;
  updated_at: string;
  tags: string[];
  is_published: boolean;
}