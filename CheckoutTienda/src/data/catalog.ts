import { CartItem, ShippingAddress, ShippingMethod } from '@/types/cart';

// Productos iniciales del carrito, acordes al flujo de checkout de Figma
export const INITIAL_CART: CartItem[] = [
  {
    id: '1',
    name: 'Pullover',
    price: 51,
    image:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
    colors: ['Black', 'Gray', 'Beige'],
    sizes: ['S', 'M', 'L'],
    color: 'Black',
    size: 'L',
    qty: 1,
  },
  {
    id: '2',
    name: 'T-Shirt',
    price: 30,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    colors: ['Gray', 'White', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Gray',
    size: 'L',
    qty: 1,
  },
  {
    id: '3',
    name: 'Sport Dress',
    price: 43,
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    colors: ['Black', 'Red', 'Blue'],
    sizes: ['XS', 'S', 'M', 'L'],
    color: 'Black',
    size: 'M',
    qty: 1,
  },
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'fedex', title: 'FedEx', subtitle: '2-3 days', price: 15 },
  { id: 'pickup', title: 'Pickup', subtitle: 'In store', price: 0 },
  { id: 'courier', title: 'Courier', subtitle: 'Next day', price: 22 },
];

export const DEFAULT_ADDRESS: ShippingAddress = {
  name: 'Jane Doe',
  street: '3 Newbridge Court',
  cityStateZip: 'Chino Hills, CA 91709',
  country: 'United States',
};
