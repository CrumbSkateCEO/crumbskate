export interface Product {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  image: string;
  category: string;
  sizes?: string[]; // Para productos como tablas o ropa que tienen tallas
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface User {
  id: string | number;
  nombre: string;
  email: string;
  rol: 'admin' | 'user';
  createdAt?: string;
}
