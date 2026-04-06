import { COLORS } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface Props {
  progress: number; // 0 → 1
}

export function ProgressBar({ progress }: Props) {
  const clamped = Math.max(0, Math.min(progress, 1));

  return (
    <View style={styles.container}>
      <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: "#EDEDED",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 8,
  },

  fill: {
    height: "100%",
    backgroundColor: COLORS.green,
    borderRadius: 8,
  },
});
