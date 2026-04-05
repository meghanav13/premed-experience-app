import ExperienceCard from "@/components/ExperienceCard";
import { useExperiences } from "@/hooks/useExperiences";
import { ExperienceType } from "@/types/experience";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const filters: (ExperienceType | "All")[] = [
  "All",
  "Clinical",
  "Shadowing",
  "Research",
  "Health Equity",
];

export default function TimelineScreen() {
  const router = useRouter();

  const { experiences, filter, setFilter, toggleMeaningful } = useExperiences();

  return (
    <View style={styles.container}>
      {/* HEADER ROW */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Timeline</Text>

        <Pressable style={styles.addButton} onPress={() => router.push("/add")}>
          <Text style={styles.addText}>+ Add</Text>
        </Pressable>
      </View>

      {/* FILTER CHIPS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
      >
        {filters.map((f) => (
          <Text
            key={f}
            style={[styles.chip, filter === f && styles.activeChip]}
            onPress={() => setFilter(f)}
          >
            {f}
          </Text>
        ))}
      </ScrollView>

      {/* EXPERIENCE LIST */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {experiences.map((exp) => (
          <ExperienceCard
            key={exp.id}
            experience={exp}
            onPress={() => {
              console.log("Pressed:", exp.title);
            }}
            onToggleStar={() => toggleMeaningful(exp.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },

  addButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },

  addText: {
    color: "#fff",
    fontWeight: "600",
  },

  filterRow: {
    marginBottom: 12,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
    fontSize: 13,
    color: "#374151",
  },

  activeChip: {
    backgroundColor: "#2E7D32",
    color: "#FFFFFF",
  },
});
