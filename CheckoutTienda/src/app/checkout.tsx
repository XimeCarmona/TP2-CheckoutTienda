import { router } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { CheckoutColors } from '@/constants/checkout-theme';
import { useCart } from '@/context/cart-context';
import { ShippingAddress } from '@/types/cart';

export default function CheckoutScreen() {
  const {
    total,
    amount,
    shipping,
    discount,
    items,
    shippingMethods,
    selectedShippingId,
    setShippingMethodId,
    address,
    setAddress,
  } = useCart();

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [draftAddress, setDraftAddress] = useState<ShippingAddress>(address);

  const openAddressModal = () => {
    setDraftAddress(address);
    setIsEditingAddress(true);
  };

  const saveAddress = () => {
    if (draftAddress.name.trim() && draftAddress.street.trim()) {
      setAddress(draftAddress);
    }
    setIsEditingAddress(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Checkout" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.section}>Shipping address</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>{address.name}</Text>
            <Pressable onPress={openAddressModal} hitSlop={8}>
              <Text style={styles.change}>Change</Text>
            </Pressable>
          </View>
          <Text style={styles.address}>
            {address.street}
            {'\n'}
            {address.cityStateZip}, {address.country}
          </Text>
        </View>

        <Text style={styles.section}>Delivery method</Text>
        <View style={styles.methodsList}>
          {shippingMethods.map((item) => {
            const selected = item.id === selectedShippingId;
            return (
              <Pressable
                key={item.id}
                onPress={() => setShippingMethodId(item.id)}
                style={[styles.method, selected && styles.methodSelected]}
              >
                <View style={styles.methodInfo}>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioInner} /> : null}
                  </View>
                  <View>
                    <Text style={styles.methodTitle}>{item.title}</Text>
                    <Text style={styles.methodSub}>{item.subtitle}</Text>
                  </View>
                </View>
                <Text style={styles.methodPrice}>
                  {item.price === 0 ? 'Free' : `$${item.price}`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.muted}>
              Order ({items.length} {items.length === 1 ? 'item' : 'items'}):
            </Text>
            <Text style={styles.summaryVal}>${amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.muted}>Delivery:</Text>
            <Text style={styles.summaryVal}>
              {shipping === 0 ? 'Free' : `$${shipping}`}
            </Text>
          </View>
          {discount > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.muted}>Promo discount:</Text>
              <Text style={[styles.summaryVal, styles.discountVal]}>
                -${discount}
              </Text>
            </View>
          ) : null}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total amount:</Text>
            <Text style={styles.total}>${total}</Text>
          </View>
        </View>

        <PrimaryButton
          label="Continue to payment"
          disabled={items.length === 0}
          onPress={() => router.push('/payment')}
        />
      </ScrollView>

      {/* Modal para editar dirección */}
      <Modal
        visible={isEditingAddress}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditingAddress(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Shipping Address</Text>

            <Text style={styles.inputLabel}>Recipient Name</Text>
            <TextInput
              style={styles.modalInput}
              value={draftAddress.name}
              onChangeText={(text) =>
                setDraftAddress((prev) => ({ ...prev, name: text }))
              }
              placeholder="e.g. Jane Doe"
            />

            <Text style={styles.inputLabel}>Street Address</Text>
            <TextInput
              style={styles.modalInput}
              value={draftAddress.street}
              onChangeText={(text) =>
                setDraftAddress((prev) => ({ ...prev, street: text }))
              }
              placeholder="e.g. 3 Newbridge Court"
            />

            <Text style={styles.inputLabel}>City, State & ZIP</Text>
            <TextInput
              style={styles.modalInput}
              value={draftAddress.cityStateZip}
              onChangeText={(text) =>
                setDraftAddress((prev) => ({ ...prev, cityStateZip: text }))
              }
              placeholder="e.g. Chino Hills, CA 91709"
            />

            <Text style={styles.inputLabel}>Country</Text>
            <TextInput
              style={styles.modalInput}
              value={draftAddress.country}
              onChangeText={(text) =>
                setDraftAddress((prev) => ({ ...prev, country: text }))
              }
              placeholder="e.g. United States"
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setIsEditingAddress(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnSave]}
                onPress={saveAddress}
              >
                <Text style={styles.modalBtnSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  section: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '700',
    color: CheckoutColors.text,
  },
  card: {
    backgroundColor: CheckoutColors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: CheckoutColors.text,
  },
  address: {
    color: CheckoutColors.text,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.85,
  },
  change: {
    color: CheckoutColors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  methodsList: {
    gap: 10,
  },
  method: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CheckoutColors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  methodSelected: {
    borderColor: CheckoutColors.primary,
    backgroundColor: '#FFFFFF',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: CheckoutColors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: CheckoutColors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: CheckoutColors.primary,
  },
  methodTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: CheckoutColors.text,
  },
  methodSub: {
    color: CheckoutColors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  methodPrice: {
    fontWeight: '700',
    fontSize: 15,
    color: CheckoutColors.text,
  },
  summaryCard: {
    backgroundColor: CheckoutColors.card,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginTop: 6,
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
  summaryVal: {
    fontWeight: '600',
    color: CheckoutColors.text,
    fontSize: 15,
  },
  discountVal: {
    color: CheckoutColors.success,
  },
  divider: {
    height: 1,
    backgroundColor: CheckoutColors.line,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: CheckoutColors.text,
  },
  muted: {
    color: CheckoutColors.muted,
    fontSize: 14,
  },
  total: {
    fontSize: 20,
    fontWeight: '800',
    color: CheckoutColors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: CheckoutColors.text,
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: CheckoutColors.muted,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: CheckoutColors.line,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: CheckoutColors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: CheckoutColors.chip,
  },
  modalBtnCancelText: {
    color: CheckoutColors.text,
    fontWeight: '600',
  },
  modalBtnSave: {
    backgroundColor: CheckoutColors.primary,
  },
  modalBtnSaveText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
