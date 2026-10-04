import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OptionChips } from '@/components/option-chips';
import { CheckoutColors } from '@/constants/checkout-theme';
import { CartItem } from '@/types/cart';

type Props = {
  item: CartItem;
  onColor: (color: string) => void;
  onSize: (size: string) => void;
  onQty: (qty: number) => void;
  onRemove: () => void;
};

export function CartItemCard({ item, onColor, onSize, onQty, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Pressable
            onPress={onRemove}
            hitSlop={10}
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.deleteBtnPressed,
            ]}
          >
            <Text style={styles.delete}>✕</Text>
          </Pressable>
        </View>

        {/* Selector de Color (Requerimiento 1) */}
        <OptionChips
          label="Color"
          options={item.colors}
          value={item.color}
          onChange={onColor}
        />

        {/* Selector de Size (Requerimiento 1) */}
        <OptionChips
          label="Size"
          options={item.sizes}
          value={item.size}
          onChange={onSize}
        />

        {/* Controles de Qty y Precio (Requerimiento 1) */}
        <View style={styles.footer}>
          <View style={styles.qty}>
            <Pressable
              onPress={() => onQty(item.qty - 1)}
              style={({ pressed }) => [
                styles.qtyBtn,
                item.qty <= 1 && styles.qtyBtnDisabled,
                pressed && styles.qtyBtnPressed,
              ]}
              disabled={item.qty <= 1}
            >
              <Text style={styles.qtySymbol}>−</Text>
            </Pressable>
            <Text style={styles.qtyValue}>{item.qty}</Text>
            <Pressable
              onPress={() => onQty(item.qty + 1)}
              style={({ pressed }) => [
                styles.qtyBtn,
                pressed && styles.qtyBtnPressed,
              ]}
            >
              <Text style={styles.qtySymbol}>+</Text>
            </Pressable>
          </View>

          <View style={styles.priceContainer}>
            {item.qty > 1 ? (
              <Text style={styles.unitPrice}>${item.price} c/u</Text>
            ) : null}
            <Text style={styles.price}>${item.price * item.qty}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: CheckoutColors.card,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  image: {
    width: 115,
    minHeight: 180,
  },
  body: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: CheckoutColors.text,
    marginRight: 8,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CheckoutColors.chip,
  },
  deleteBtnPressed: {
    backgroundColor: '#E0E0E0',
  },
  delete: {
    color: CheckoutColors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: CheckoutColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyBtnPressed: {
    opacity: 0.7,
  },
  qtySymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: CheckoutColors.text,
  },
  qtyValue: {
    minWidth: 18,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: CheckoutColors.text,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  unitPrice: {
    fontSize: 11,
    color: CheckoutColors.muted,
    marginBottom: 1,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: CheckoutColors.text,
  },
});
