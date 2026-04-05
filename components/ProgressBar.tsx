import { StyleSheet, View } from "react-native";

interface Props {
  progress: number; // 0 → 1
}

export function ProgressBar({ progress }: Props) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.fill,
          { width: `${Math.max(0, Math.min(progress, 1)) * 100}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 6,
    marginBottom: 6,
  },

  fill: {
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 6,
  },
});
