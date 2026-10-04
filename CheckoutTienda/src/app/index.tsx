import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartItemCard } from '@/components/cart-item-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { CheckoutColors } from '@/constants/checkout-theme';
import { useCart } from '@/context/cart-context';
import { CartItem } from '@/types/cart';

export default function ShoppingCartScreen() {
  const cart = useCart();
  const [promoError, setPromoError] = useState(false);

  const handleApplyPromo = () => {
    cart.applyPromo();
    const code = cart.promoCode.trim().toUpperCase();
    if (code !== 'DESCUENTO10' && code !== 'PROMO10') {
      setPromoError(true);
    } else {
      setPromoError(false);
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Deseas quitar "${item.name}" de tu carrito de compras?`)) {
        cart.removeItem(item.id);
      }
    } else {
      Alert.alert(
        'Eliminar producto',
        `¿Deseas quitar "${item.name}" de tu carrito?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => cart.removeItem(item.id),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Shopping Cart" showBack={false} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {cart.items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptyText}>
              Has eliminado todos los productos del carrito. Puedes restablecerlos para continuar probando el flujo.
            </Text>
            <Pressable onPress={cart.resetCart} style={styles.reload}>
              <Text style={styles.reloadText}>Restablecer productos</Text>
            </Pressable>
          </View>
        ) : (
          cart.items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onColor={(color) => cart.updateColor(item.id, color)}
              onSize={(size) => cart.updateSize(item.id, size)}
              onQty={(qty) => cart.updateQty(item.id, qty)}
              onRemove={() => handleRemoveItem(item)}
            />
          ))
        )}

        {/* Campo de código promocional */}
        <View style={styles.promoRow}>
          <TextInput
            value={cart.promoCode}
            onChangeText={(text) => {
              cart.setPromoCode(text);
              if (promoError) setPromoError(false);
            }}
            placeholder="Enter your promo code (e.g. DESCUENTO10)"
            placeholderTextColor={CheckoutColors.muted}
            autoCapitalize="characters"
            style={styles.promoInput}
          />
          <Pressable onPress={handleApplyPromo} style={styles.promoBtn}>
            <Text style={styles.promoArrow}>›</Text>
          </Pressable>
        </View>

        {cart.promoApplied ? (
          <Text style={styles.promoOk}>✓ Código aplicado: 10% de descuento</Text>
        ) : promoError ? (
          <Text style={styles.promoError}>
            Código no válido. Prueba con "DESCUENTO10"
          </Text>
        ) : null}

        {/* Resumen de costos */}
        <View style={styles.summaryContainer}>
          <SummaryRow label="Order amount:" value={`$${cart.amount}`} />
          <SummaryRow
            label="Delivery / Shipping:"
            value={cart.shipping === 0 ? 'Free' : `$${cart.shipping}`}
          />
          {cart.discount > 0 ? (
            <SummaryRow
              label="Promo discount:"
              value={`-$${cart.discount}`}
              isDiscount
            />
          ) : null}
          <View style={styles.summaryDivider} />
          <SummaryRow label="Total amount:" value={`$${cart.total}`} bold />
        </View>

        <View style={styles.checkout}>
          <PrimaryButton
            label="Check out"
            disabled={cart.items.length === 0}
            onPress={() => router.push('/checkout')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  isDiscount,
}: {
  label: string;
  value: string;
  bold?: boolean;
  isDiscount?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && styles.boldLabel]}>{label}</Text>
      <Text
        style={[
          styles.summaryValue,
          bold && styles.boldValue,
          isDiscount && styles.discountValue,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CheckoutColors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  empty: {
    backgroundColor: CheckoutColors.card,
    borderRadius: 14,
    padding: 28,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginTop: 10,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: CheckoutColors.text,
  },
  emptyText: {
    textAlign: 'center',
    color: CheckoutColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  reload: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: CheckoutColors.primary,
  },
  reloadText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CheckoutColors.card,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4,
    borderWidth: 1,
    borderColor: CheckoutColors.line,
  },
  promoInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
    color: CheckoutColors.text,
  },
  promoBtn: {
    width: 40,
    height: 40,
    backgroundColor: CheckoutColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginRight: 6,
  },
  promoArrow: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '600',
  },
  promoOk: {
    color: CheckoutColors.success,
    fontSize: 13,
    fontWeight: '600',
    marginTop: -6,
    paddingHorizontal: 4,
  },
  promoError: {
    color: CheckoutColors.accent,
    fontSize: 13,
    fontWeight: '500',
    marginTop: -6,
    paddingHorizontal: 4,
  },
  summaryContainer: {
    backgroundColor: CheckoutColors.card,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: CheckoutColors.muted,
    fontSize: 14,
  },
  summaryValue: {
    color: CheckoutColors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  discountValue: {
    color: CheckoutColors.success,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: CheckoutColors.line,
    marginVertical: 4,
  },
  boldLabel: {
    fontWeight: '700',
    color: CheckoutColors.text,
    fontSize: 16,
  },
  boldValue: {
    fontWeight: '800',
    color: CheckoutColors.text,
    fontSize: 18,
  },
  checkout: {
    marginTop: 4,
  },
});
