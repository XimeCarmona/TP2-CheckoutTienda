import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
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
import { CardBrand } from '@/types/cart';

const BRANDS: { id: CardBrand; label: string; badge: string; desc: string }[] = [
  { id: 'visa', label: 'Visa', badge: 'VISA', desc: 'Débito / Crédito' },
  { id: 'mastercard', label: 'Master', badge: 'MC', desc: 'Mastercard' },
  { id: 'otras', label: 'Otras', badge: 'OTRAS', desc: 'Amex, Cabal, etc.' },
];

export default function PaymentScreen() {
  const { total, items, completeOrder } = useCart();
  const [brand, setBrand] = useState<CardBrand>('visa');
  const [name, setName] = useState('Jane Doe');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefaultCard, setIsDefaultCard] = useState(true);

  // Validación de los datos de pago
  const valid = useMemo(() => {
    const rawNumber = number.replace(/\s/g, '');
    const [month, year] = expiry.split('/').map((s) => parseInt(s, 10));
    const isExpiryValid =
      expiry.length === 5 &&
      month >= 1 &&
      month <= 12 &&
      year >= 24;

    return (
      items.length > 0 &&
      name.trim().length >= 3 &&
      rawNumber.length === 16 &&
      isExpiryValid &&
      cvv.length >= 3
    );
  }, [cvv, expiry, items.length, name, number]);

  // Formateador de número de tarjeta en grupos de 4 dígitos
  const handleNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    // Detección automática sugerida si el usuario escribe
    if (digits.startsWith('4')) {
      setBrand('visa');
    } else if (digits.startsWith('5')) {
      setBrand('mastercard');
    } else if (digits.length >= 2 && !digits.startsWith('4') && !digits.startsWith('5')) {
      setBrand('otras');
    }

    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setNumber(formatted);
  };

  // Formateador de fecha de expiración MM/YY
  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      setExpiry(digits);
    } else {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    }
  };

  const handleSubmit = () => {
    const rawNumber = number.replace(/\s/g, '');
    const cardLast4 = rawNumber.slice(-4) || '4242';
    completeOrder({
      cardBrand: brand,
      cardLast4,
    });
    router.push('/success');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Secure Payment" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Selector de tipos de tarjeta (Requerimiento 3) */}
        <Text style={styles.sectionTitle}>Tipo de tarjeta</Text>
        <View style={styles.brandsRow}>
          {BRANDS.map((item) => {
            const isSelected = item.id === brand;
            return (
              <Pressable
                key={item.id}
                onPress={() => setBrand(item.id)}
                style={[
                  styles.brandOption,
                  isSelected && styles.brandOptionSelected,
                  brandOptionStyle(item.id, isSelected),
                ]}
              >
                <View style={styles.brandTopRow}>
                  <Text
                    style={[
                      styles.brandLabel,
                      isSelected && styles.brandLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isSelected ? (
                    <View style={styles.activeCheck}>
                      <Text style={styles.activeCheckText}>✓</Text>
                    </View>
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.brandDesc,
                    isSelected && styles.brandDescSelected,
                  ]}
                >
                  {item.desc}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Tarjeta de crédito interactiva simulada */}
        <View style={[styles.cardPreview, cardBackgroundStyle(brand)]}>
          <View style={styles.cardPreviewTop}>
            <View style={styles.chipWrapper}>
              <View style={styles.chip} />
              <Text style={styles.contactless}>)))</Text>
            </View>
            <CardBrandLogo brand={brand} />
          </View>

          <Text style={styles.cardPreviewNumber}>
            {formatDisplayCardNumber(number)}
          </Text>

          <View style={styles.cardPreviewBottom}>
            <View style={styles.cardPreviewColumn}>
              <Text style={styles.cardPreviewSmallLabel}>CARD HOLDER</Text>
              <Text style={styles.cardPreviewHolder} numberOfLines={1}>
                {name.trim() ? name.toUpperCase() : 'JANE DOE'}
              </Text>
            </View>
            <View style={styles.cardPreviewColumnRight}>
              <Text style={styles.cardPreviewSmallLabel}>EXPIRES</Text>
              <Text style={styles.cardPreviewExpiry}>
                {expiry || 'MM/YY'}
              </Text>
            </View>
          </View>
        </View>

        {/* Formulario de datos */}
        <Text style={styles.sectionTitle}>Card details</Text>

        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Name on card</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Jane Doe"
            placeholderTextColor={CheckoutColors.muted}
            autoCapitalize="words"
            style={styles.fieldInput}
          />
        </View>

        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Card number</Text>
          <TextInput
            value={number}
            onChangeText={handleNumberChange}
            keyboardType="number-pad"
            placeholder="XXXX XXXX XXXX XXXX"
            placeholderTextColor={CheckoutColors.muted}
            maxLength={19}
            style={styles.fieldInput}
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.fieldCard, styles.halfField]}>
            <Text style={styles.fieldLabel}>Expiry date</Text>
            <TextInput
              value={expiry}
              onChangeText={handleExpiryChange}
              keyboardType="number-pad"
              placeholder="MM/YY"
              placeholderTextColor={CheckoutColors.muted}
              maxLength={5}
              style={styles.fieldInput}
            />
          </View>

          <View style={[styles.fieldCard, styles.halfField]}>
            <Text style={styles.fieldLabel}>CVV</Text>
            <TextInput
              value={cvv}
              onChangeText={(text) =>
                setCvv(text.replace(/\D/g, '').slice(0, 4))
              }
              keyboardType="number-pad"
              placeholder="123"
              placeholderTextColor={CheckoutColors.muted}
              secureTextEntry
              maxLength={4}
              style={styles.fieldInput}
            />
          </View>
        </View>

        {/* Toggle para usar como predeterminada */}
        <Pressable
          onPress={() => setIsDefaultCard((prev) => !prev)}
          style={styles.defaultCheckboxRow}
        >
          <View
            style={[
              styles.checkboxBox,
              isDefaultCard && styles.checkboxBoxChecked,
            ]}
          >
            {isDefaultCard ? (
              <Text style={styles.checkboxCheck}>✓</Text>
            ) : null}
          </View>
          <Text style={styles.checkboxLabel}>
            Use as default payment method
          </Text>
        </Pressable>

        {/* Resumen del monto a pagar */}
        <View style={styles.summaryBar}>
          <Text style={styles.summaryLabel}>Total amount:</Text>
          <Text style={styles.summaryValue}>${total}</Text>
        </View>

        {/* Botón de envío */}
        <PrimaryButton
          label="Submit order"
          disabled={!valid}
          onPress={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Logo visual de la marca de tarjeta
function CardBrandLogo({ brand }: { brand: CardBrand }) {
  if (brand === 'visa') {
    return (
      <View style={styles.logoVisa}>
        <Text style={styles.logoVisaText}>VISA</Text>
      </View>
    );
  }

  if (brand === 'mastercard') {
    return (
      <View style={styles.logoMaster}>
        <View style={[styles.masterCircle, styles.masterCircleRed]} />
        <View style={[styles.masterCircle, styles.masterCircleYellow]} />
      </View>
    );
  }

  return (
    <View style={styles.logoOtras}>
      <Text style={styles.logoOtrasText}>OTRAS</Text>
    </View>
  );
}

function formatDisplayCardNumber(raw: string) {
  const digits = raw.replace(/\s/g, '');
  if (!digits) return '•••• •••• •••• ••••';
  const padded = digits.padEnd(16, '•');
  return `${padded.slice(0, 4)} ${padded.slice(4, 8)} ${padded.slice(8, 12)} ${padded.slice(12, 16)}`;
}

function cardBackgroundStyle(brand: CardBrand) {
  if (brand === 'visa') {
    return { backgroundColor: '#1A1F71' };
  }
  if (brand === 'mastercard') {
    return { backgroundColor: '#8B0000' };
  }
  return { backgroundColor: '#263238' };
}

function brandOptionStyle(brand: CardBrand, isSelected: boolean) {
  if (!isSelected) {
    return { borderColor: 'transparent', backgroundColor: CheckoutColors.card };
  }
  if (brand === 'visa') {
    return { borderColor: '#1A1F71', backgroundColor: '#F0F2FA' };
  }
  if (brand === 'mastercard') {
    return { borderColor: '#8B0000', backgroundColor: '#FAF0F0' };
  }
  return { borderColor: '#263238', backgroundColor: '#F2F4F5' };
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CheckoutColors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: CheckoutColors.text,
  },
  brandsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  brandOption: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  brandOptionSelected: {
    shadowOpacity: 0.12,
  },
  brandTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: CheckoutColors.text,
  },
  brandLabelSelected: {
    fontWeight: '800',
  },
  brandDesc: {
    fontSize: 10,
    color: CheckoutColors.muted,
    marginTop: 4,
  },
  brandDescSelected: {
    color: CheckoutColors.text,
    fontWeight: '500',
  },
  activeCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: CheckoutColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCheckText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardPreview: {
    borderRadius: 16,
    padding: 22,
    minHeight: 180,
    justifyContent: 'space-between',
    marginVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardPreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#D4AF37',
    borderWidth: 1,
    borderColor: '#F3E5AB',
  },
  contactless: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: '600',
  },
  logoVisa: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  logoVisaText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 2,
  },
  logoMaster: {
    flexDirection: 'row',
    width: 44,
    height: 28,
    alignItems: 'center',
  },
  masterCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  masterCircleRed: {
    backgroundColor: '#EB001B',
  },
  masterCircleYellow: {
    backgroundColor: '#F79E1B',
    marginLeft: -10,
    opacity: 0.9,
  },
  logoOtras: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  logoOtrasText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardPreviewNumber: {
    color: '#FFFFFF',
    fontSize: 19,
    letterSpacing: 2.5,
    fontFamily: 'monospace',
    fontWeight: '600',
    marginVertical: 14,
  },
  cardPreviewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardPreviewColumn: {
    flex: 1,
  },
  cardPreviewColumnRight: {
    alignItems: 'flex-end',
  },
  cardPreviewSmallLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardPreviewHolder: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardPreviewExpiry: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  fieldCard: {
    backgroundColor: CheckoutColors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: CheckoutColors.line,
  },
  fieldLabel: {
    fontSize: 11,
    color: CheckoutColors.muted,
    fontWeight: '500',
  },
  fieldInput: {
    height: 36,
    color: CheckoutColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  defaultCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: CheckoutColors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: CheckoutColors.primary,
    borderColor: CheckoutColors.primary,
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 13,
    color: CheckoutColors.text,
  },
  summaryBar: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    color: CheckoutColors.muted,
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: CheckoutColors.text,
  },
});
