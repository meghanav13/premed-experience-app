import { COLORS, FONTS } from '@/constants/theme';
import { StyleSheet, Text } from 'react-native';

type TagVariant = 'type' | 'skill';

interface Props {
  label: string;
  variant?: TagVariant;
}

export function Tag({ label, variant = 'type' }: Props) {
  const isSkill = variant === 'skill';
  return (
    <Text
      style={[
        styles.tag,
        isSkill ? styles.skillTag : styles.typeTag,
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    fontSize: 12,
    fontFamily: FONTS.sans,
    overflow: 'hidden',
  },
  typeTag: {
    backgroundColor: COLORS.greenLight,
    color: COLORS.green,
  },
  skillTag: {
    backgroundColor: COLORS.skillBlueLight,
    color: COLORS.skillBlue,
  },
});
