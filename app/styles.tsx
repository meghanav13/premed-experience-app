import { ProgressBar } from "@/components/ProgressBar";
import { Tag } from "@/components/Tag";
import { COLORS, FONTS } from "@/constants/theme";
import {
    BookOpenIcon,
    HeartIcon,
    PulseIcon,
    StarIcon,
    UserIcon,
} from "phosphor-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function StylesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Style Guide</Text>

      {/* COLORS */}
      <Text style={styles.section}>Colors</Text>
      <View style={styles.row}>
        <View style={styles.colorItem}>
          <View style={[styles.colorBox, { backgroundColor: COLORS.green }]} />
          <Text style={styles.colorLabel}>Green</Text>
        </View>

        <View style={styles.colorItem}>
          <View
            style={[
              styles.colorBox,
              {
                backgroundColor: COLORS.cream,
                borderWidth: 1,
                borderColor: "#E5E5E5",
              },
            ]}
          />
          <Text style={styles.colorLabel}>Cream</Text>
        </View>

        <View style={styles.colorItem}>
          <View style={[styles.colorBox, { backgroundColor: COLORS.amber }]} />
          <Text style={styles.colorLabel}>Amber</Text>
        </View>
      </View>

      {/* TYPOGRAPHY */}
      <Text style={styles.section}>Typography</Text>

      <Text style={styles.typographyLabel}>DM Serif Display</Text>
      <Text style={styles.title}>My Journey Header</Text>

      <Text style={styles.typographyLabel}>DM Sans Regular</Text>
      <Text style={styles.body}>Body Text Example</Text>

      <Text style={styles.typographyLabel}>DM Sans Bold</Text>
      <Text style={styles.bold}>Important Labels</Text>
      {/* ICONS */}
      <Text style={styles.section}>Icons</Text>

      <Text style={styles.componentLabel}>Phosphor Icons</Text>

      <View style={styles.iconRow}>
        <View style={styles.iconItem}>
          <StarIcon size={28} color={COLORS.amber} weight="fill" />
          <Text style={styles.iconLabel}>Star</Text>
        </View>

        <View style={styles.iconItem}>
          <HeartIcon size={28} color={COLORS.green} weight="fill" />
          <Text style={styles.iconLabel}>Heart</Text>
        </View>

        <View style={styles.iconItem}>
          <PulseIcon size={28} color={COLORS.textPrimary} />
          <Text style={styles.iconLabel}>Pulse</Text>
        </View>

        <View style={styles.iconItem}>
          <UserIcon size={28} color={COLORS.textPrimary} />
          <Text style={styles.iconLabel}>User</Text>
        </View>

        <View style={styles.iconItem}>
          <BookOpenIcon size={28} color={COLORS.textPrimary} />
          <Text style={styles.iconLabel}>Study</Text>
        </View>
      </View>

      {/* COMPONENTS */}
      <Text style={styles.section}>Components</Text>

      <Text style={styles.componentLabel}>Progress Bar</Text>
      <ProgressBar progress={0.6} />

      <Text style={[styles.componentLabel, { marginTop: 16 }]}>Tags</Text>
      <View style={styles.tagRow}>
        <Tag label="Clinical" />
        <Tag label="Research" />
        <Tag label="Leadership" />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFFFFF", // ✅ FIXED
  },

  header: {
    fontSize: 30,
    fontFamily: FONTS.serif,
    color: COLORS.green,
    marginBottom: 24,
  },

  section: {
    marginTop: 18,
    marginBottom: 10,
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: "row",
    gap: 16,
  },

  colorItem: {
    alignItems: "center",
  },

  colorBox: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },

  colorLabel: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
  },

  typographyLabel: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
  },

  title: {
    fontSize: 24,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    marginTop: 4,
  },

  body: {
    fontSize: 14,
    fontFamily: FONTS.sans,
    marginTop: 4,
    color: COLORS.textPrimary,
  },

  bold: {
    fontSize: 14,
    fontFamily: FONTS.sansBold,
    marginTop: 4,
    color: COLORS.textPrimary,
  },

  componentLabel: {
    fontSize: 13,
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  tagRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },

  iconRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
    flexWrap: "wrap",
  },

  iconItem: {
    alignItems: "center",
  },

  iconLabel: {
    marginTop: 4,
    fontSize: 11,
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
  },
});
