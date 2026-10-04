import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { CheckoutColors } from '@/constants/checkout-theme';
import { useCart } from '@/context/cart-context';

export default function SuccessScreen() {
  const { resetCart, lastOrder } = useCart();

  const continueShopping = () => {
    resetCart();
    router.replace('/');
  };

  const brandName =
    lastOrder?.cardBrand === 'visa'
      ? 'Visa'
      : lastOrder?.cardBrand === 'mastercard'
      ? 'Mastercard'
      : 'Otras tarjetas';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <View style={styles.badge}>
          <Text style={styles.check}>✓</Text>
        </View>
        <Text style={styles.title}>Success!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully.{'\n'}Thank you for choosing
          our shop!
        </Text>

        {lastOrder ? (
          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Order ID:</Text>
              <Text style={styles.receiptValue}>{lastOrder.id}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Payment method:</Text>
              <Text style={styles.receiptValue}>
                {brandName} •••• {lastOrder.cardLast4}
              </Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Delivery:</Text>
              <Text style={styles.receiptValue}>{lastOrder.shippingTitle}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptTotalLabel}>Total Paid:</Text>
              <Text style={styles.receiptTotalValue}>${lastOrder.total}</Text>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Continue shopping" onPress={continueShopping} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CheckoutColors.background,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: CheckoutColors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: CheckoutColors.success,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  check: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '800',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: CheckoutColors.text,
  },
  subtitle: {
    textAlign: 'center',
    color: CheckoutColors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: CheckoutColors.card,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    color: CheckoutColors.muted,
    fontSize: 13,
  },
  receiptValue: {
    color: CheckoutColors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: CheckoutColors.line,
    marginVertical: 4,
  },
  receiptTotalLabel: {
    color: CheckoutColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  receiptTotalValue: {
    color: CheckoutColors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  footer: {
    padding: 16,
    paddingBottom: 28,
  },
});
