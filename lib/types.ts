export type Product = {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  description: string;
  features: string[];
  stock: number;
  active: boolean;
  gradient: string;
  variants: ProductVariant[];
};

export type CartItem = Product & {
  quantity: number;
  variantId: string;
  variantName: string;
  price: number;
};

export type ProductKey = {
  id: string;
  productId: string;
  value: string;
  status: "active" | "sold" | "disabled";
  buyerEmail?: string;
  soldAt?: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  days: number;
};
