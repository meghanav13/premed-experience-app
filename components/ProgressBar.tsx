import { COLORS } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

interface Props {
  progress: number; // 0 → 1
  color?: string;
}

export function ProgressBar({ progress, color = COLORS.green }: Props) {
  const clamped = Math.max(0, Math.min(progress, 1));
  return (
    <View style={styles.container}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 10,
  },
  fill: {
    height: '100%',
    borderRadius: 8,
  },
});
