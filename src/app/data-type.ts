export interface SignUp {
  name: string;
  email: string;
  password: string;
}
export interface Login {
  email: String;
  password: String;
}
export interface product {
  name: string;
  price: number;
  info: string;
  category: string;
  description: string;
  image: string;
  id: number;
  productId: undefined | number;
  quantity: undefined | number;
}

export interface cart {
  name: string;
  price: number;
  info: string;
  category: string;
  description: string;
  image: string;
  id: number | undefined;
  quantity: undefined | number;
  userId: number;
  productId: number;
}

export interface priceSummary {
  price: number;
  discount: number;
  tax: number;
  delivery: number;
  total: number;
}

export interface order {
  email: string;
  address: string;
  contact: string;
  totalPrice: number;
  userId: number;
  id: number | undefined;
}
