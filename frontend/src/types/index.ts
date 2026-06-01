export interface Product {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  image: string;
  category: string;
  gender?: string;
  sizes?: string[]; 
  stock?: number;
  inStock?: boolean;
  createdAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface User {
  id: string | number;
  nombre: string;
  name?: string; 
  email: string;
  rol: 'admin' | 'user';
  createdAt?: string;
}
