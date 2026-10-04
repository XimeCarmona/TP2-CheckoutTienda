export type CardBrand = 'visa' | 'mastercard' | 'otras';

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
};

export type CartItem = Product & {
  color: string;
  size: string;
  qty: number;
};

export type ShippingMethod = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
};

export type ShippingAddress = {
  name: string;
  street: string;
  cityStateZip: string;
  country: string;
};

export type CompletedOrder = {
  id: string;
  total: number;
  itemsCount: number;
  cardBrand: CardBrand;
  cardLast4: string;
  shippingTitle: string;
};
