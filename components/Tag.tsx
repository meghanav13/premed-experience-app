import { COLORS, FONTS } from "@/constants/theme";
import { StyleSheet, Text } from "react-native";

export function Tag({ label }: { label: string }) {
  return <Text style={styles.tag}>{label}</Text>;
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#EDF7F1",
    color: COLORS.green,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    fontSize: 12,
    fontFamily: FONTS.sans,
  },
});
