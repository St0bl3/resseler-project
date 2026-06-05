export type Product = {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  price: number;
  oldPrice?: number;
  description: string;
  features: string[];
  stock: number;
  active: boolean;
  gradient: string;
  stripePriceId?: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type ProductKey = {
  id: string;
  productId: string;
  value: string;
  status: "active" | "sold" | "disabled";
  buyerEmail?: string;
  soldAt?: string;
};
