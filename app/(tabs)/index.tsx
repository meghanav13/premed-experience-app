import { ProgressBar } from "@/components/ProgressBar";
import { Tag } from "@/components/Tag";
import { COLORS, FONTS } from "@/constants/theme";
import { useExperiences } from "@/context/ExperiencesContext";
import { Experience } from "@/types/experience";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { allExperiences } = useExperiences();

  // simple aggregation for demo
  const clinical = allExperiences
    .filter((e: Experience) => e.type === "Clinical")
    .reduce((sum: number, e: Experience) => sum + e.hours, 0);

  const shadowing = allExperiences
    .filter((e: Experience) => e.type === "Shadowing")
    .reduce((sum: number, e: Experience) => sum + e.hours, 0);

  const research = allExperiences
    .filter((e: Experience) => e.type === "Research")
    .reduce((sum: number, e: Experience) => sum + e.hours, 0);

  const highlights = allExperiences.filter((e: Experience) => e.isMeaningful);

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.header}>My Journey</Text>

      {/* PROGRESS CARD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>THIS MONTH</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Clinical</Text>
          <Text style={styles.rowValue}>{clinical} hrs</Text>
        </View>

        <ProgressBar progress={Math.min(clinical / 150, 1)} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Shadowing</Text>
          <Text style={styles.rowValue}>{shadowing} hrs</Text>
        </View>
        <ProgressBar progress={Math.min(shadowing / 150, 1)} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Research</Text>
          <Text style={styles.rowValue}>{research} hrs</Text>
        </View>
        <ProgressBar progress={Math.min(research / 150, 1)} />
      </View>

      {/* ALERT CARD */}
      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>⚠️ ATTENTION NEEDED</Text>
        <Text style={styles.alertText}>Personal Statement Draft #1</Text>
        <Text style={styles.alertSub}>Tap to review</Text>
      </View>

      {/* HIGHLIGHTS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>⭐ Highlights</Text>

        {highlights.map((exp: Experience) => (
          <View key={exp.id} style={styles.highlightItem}>
            <Text style={styles.highlightTitle}>• {exp.title}</Text>

            <View style={styles.tagsRow}>
              {exp.tags.map((tag: string, i: number) => (
                <Tag key={i} label={tag} />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  header: {
    fontSize: 30,
    fontFamily: FONTS.serif,
    color: COLORS.green,
    marginBottom: 18,
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

  sectionTitle: {
    fontSize: 12,
    fontFamily: FONTS.sansBold,
    color: COLORS.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  alertCard: {
    borderWidth: 1.5,
    borderColor: COLORS.amber,
    backgroundColor: "#FFF6ED",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  alertTitle: {
    color: COLORS.amber,
    fontFamily: FONTS.sansBold,
    marginBottom: 6,
  },

  alertText: {
    fontFamily: FONTS.sansBold,
    color: COLORS.textPrimary,
  },

  alertSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    fontFamily: FONTS.sans,
  },

  highlightItem: {
    marginTop: 10,
  },

  highlightTitle: {
    fontSize: 14,
    fontFamily: FONTS.sans,
    color: COLORS.textPrimary,
  },

  rowLabel: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  rowValue: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: COLORS.green,
  },

  tagsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
  },
});
