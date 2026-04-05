import { ProgressBar } from "@/components/ProgressBar";
import { Tag } from "@/components/Tag";
import { useExperiences } from "@/hooks/useExperiences";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { experiences } = useExperiences();

  // simple aggregation for demo
  const clinical = experiences
    .filter((e) => e.type === "Clinical")
    .reduce((sum, e) => sum + e.hours, 0);

  const shadowing = experiences
    .filter((e) => e.type === "Shadowing")
    .reduce((sum, e) => sum + e.hours, 0);

  const research = experiences
    .filter((e) => e.type === "Research")
    .reduce((sum, e) => sum + e.hours, 0);

  const highlights = experiences.filter((e) => e.isMeaningful);

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.header}>My Journey</Text>

      {/* PROGRESS CARD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>THIS MONTH</Text>

        <View style={styles.row}>
          <Text>Clinical</Text>
          <Text>{clinical} hrs</Text>
        </View>
        <ProgressBar progress={Math.min(clinical / 150, 1)} />

        <View style={styles.row}>
          <Text>Shadowing</Text>
          <Text>{shadowing} hrs</Text>
        </View>
        <ProgressBar progress={Math.min(shadowing / 150, 1)} />

        <View style={styles.row}>
          <Text>Research</Text>
          <Text>{research} hrs</Text>
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

        {highlights.map((exp) => (
          <View key={exp.id} style={styles.highlightItem}>
            <Text style={styles.highlightTitle}>• {exp.title}</Text>

            <View style={styles.tagsRow}>
              {exp.tags.map((tag, i) => (
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
    backgroundColor: "#F8F9FB",
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    elevation: 3,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  alertCard: {
    borderWidth: 1.5,
    borderColor: "#D32F2F",
    backgroundColor: "#FDECEC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  alertTitle: {
    color: "#B71C1C",
    fontWeight: "700",
    marginBottom: 6,
  },

  alertText: {
    fontWeight: "600",
  },

  alertSub: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },

  highlightItem: {
    marginTop: 10,
  },

  highlightTitle: {
    fontSize: 14,
    fontWeight: "500",
  },

  tagsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
  },
});
