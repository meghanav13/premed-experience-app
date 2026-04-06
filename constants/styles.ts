import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "./theme";

export const globalStyles = StyleSheet.create({
  /* ---------- LAYOUT ---------- */
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* ---------- TEXT ---------- */
  header: {
    fontSize: 30,
    fontFamily: FONTS.serif,
    color: COLORS.green,
  },

  subheader: {
    fontSize: 14,
    fontFamily: FONTS.sansBold,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },

  body: {
    fontSize: 14,
    fontFamily: FONTS.sans,
    color: COLORS.textPrimary,
  },

  /* ---------- BUTTONS ---------- */
  primaryButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  primaryButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.sansBold,
  },

  /* ---------- INPUT ---------- */
  input: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    fontFamily: FONTS.sans,
  },
});
