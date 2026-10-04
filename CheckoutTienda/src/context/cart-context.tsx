import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { DEFAULT_ADDRESS, INITIAL_CART, SHIPPING_METHODS } from '@/data/catalog';
import {
  CartItem,
  CompletedOrder,
  ShippingAddress,
  ShippingMethod,
} from '@/types/cart';

type CartContextValue = {
  items: CartItem[];
  promoCode: string;
  promoApplied: boolean;
  setPromoCode: (value: string) => void;
  applyPromo: () => void;
  updateColor: (id: string, color: string) => void;
  updateSize: (id: string, size: string) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  resetCart: () => void;
  shippingMethods: ShippingMethod[];
  selectedShippingId: string;
  selectedShipping: ShippingMethod;
  setShippingMethodId: (id: string) => void;
  address: ShippingAddress;
  setAddress: (address: ShippingAddress) => void;
  lastOrder: CompletedOrder | null;
  completeOrder: (order: Omit<CompletedOrder, 'id' | 'total' | 'itemsCount' | 'shippingTitle'>) => CompletedOrder;
  amount: number;
  discount: number;
  shipping: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState<string>('fedex');
  const [address, setAddress] = useState<ShippingAddress>(DEFAULT_ADDRESS);
  const [lastOrder, setLastOrder] = useState<CompletedOrder | null>(null);

  const updateItem = (id: string, patch: Partial<CartItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const selectedShipping = useMemo(() => {
    return (
      SHIPPING_METHODS.find((m) => m.id === selectedShippingId) ??
      SHIPPING_METHODS[0]
    );
  }, [selectedShippingId]);

  const amount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = items.length === 0 ? 0 : selectedShipping.price;
  const discount = promoApplied ? Math.round(amount * 0.1) : 0;
  const total = Math.max(0, amount + shipping - discount);

  const value = useMemo(
    () => ({
      items,
      promoCode,
      promoApplied,
      setPromoCode: (value: string) => {
        setPromoCode(value);
        setPromoApplied(false);
      },
      applyPromo: () => {
        const code = promoCode.trim().toUpperCase();
        setPromoApplied(code === 'DESCUENTO10' || code === 'PROMO10');
      },
      updateColor: (id: string, color: string) => updateItem(id, { color }),
      updateSize: (id: string, size: string) => updateItem(id, { size }),
      updateQty: (id: string, qty: number) => {
        if (qty < 1) return;
        updateItem(id, { qty });
      },
      removeItem: (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
      },
      resetCart: () => {
        setItems(INITIAL_CART);
        setPromoCode('');
        setPromoApplied(false);
        setSelectedShippingId('fedex');
        setAddress(DEFAULT_ADDRESS);
      },
      shippingMethods: SHIPPING_METHODS,
      selectedShippingId,
      selectedShipping,
      setShippingMethodId: (id: string) => setSelectedShippingId(id),
      address,
      setAddress,
      lastOrder,
      completeOrder: (info: Omit<CompletedOrder, 'id' | 'total' | 'itemsCount' | 'shippingTitle'>) => {
        const order: CompletedOrder = {
          id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          total,
          itemsCount: items.reduce((acc, curr) => acc + curr.qty, 0),
          shippingTitle: selectedShipping.title,
          ...info,
        };
        setLastOrder(order);
        return order;
      },
      amount,
      discount,
      shipping,
      total,
    }),
    [
      items,
      promoCode,
      promoApplied,
      selectedShippingId,
      selectedShipping,
      address,
      lastOrder,
      amount,
      discount,
      shipping,
      total,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}
