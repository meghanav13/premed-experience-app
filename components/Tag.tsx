import { StyleSheet, Text } from "react-native";

export function Tag({ label }: { label: string }) {
  return <Text style={styles.tag}>{label}</Text>;
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
  },
});
