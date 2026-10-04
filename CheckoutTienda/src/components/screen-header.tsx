import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckoutColors } from '@/constants/checkout-theme';

type Props = {
  title: string;
  showBack?: boolean;
};

export function ScreenHeader({ title, showBack = true }: Props) {
  return (
    <View style={styles.row}>
      {showBack ? (
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.side}>
          <Text style={styles.icon}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  side: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    color: CheckoutColors.text,
    marginTop: -4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: CheckoutColors.text,
  },
});
