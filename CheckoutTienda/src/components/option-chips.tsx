import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckoutColors } from '@/constants/checkout-theme';

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function OptionChips({ label, options, value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 6,
  },
  label: {
    fontSize: 11,
    color: CheckoutColors.muted,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: CheckoutColors.chip,
  },
  chipSelected: {
    backgroundColor: CheckoutColors.chipSelected,
  },
  chipText: {
    fontSize: 12,
    color: CheckoutColors.text,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
