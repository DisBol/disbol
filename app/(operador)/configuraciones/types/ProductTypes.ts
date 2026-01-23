export interface Product {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}
