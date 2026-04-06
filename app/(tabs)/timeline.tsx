import ExperienceCard from "@/components/ExperienceCard";
import { COLORS, FONTS } from "@/constants/theme";
import { useExperiences } from "@/context/ExperiencesContext";
import { Experience, ExperienceType } from "@/types/experience";
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

  const { experiences, allExperiences, filter, setFilter, toggleMeaningful } =
    useExperiences();

  const data = filter === "All" ? allExperiences : experiences;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
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
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.chip, filter === f && styles.activeChip]}
          >
            <Text
              style={[styles.chipText, filter === f && styles.activeChipText]}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* EXPERIENCE LIST */}
      <View>
        {data.map((exp: Experience) => (
          <ExperienceCard
            key={exp.id}
            experience={exp}
            onPress={() => console.log("Pressed:", exp.title)}
            onToggleStar={() => toggleMeaningful(exp.id)}
          />
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  header: {
    fontSize: 30,
    fontFamily: FONTS.serif,
    color: COLORS.green,
  },

  addButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  addText: {
    color: COLORS.white,
    fontFamily: FONTS.sansBold,
  },

  filterRow: {
    marginBottom: 8,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "#EDEDED",
    marginRight: 8,
  },

  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONTS.sans,
  },

  activeChip: {
    backgroundColor: COLORS.green,
  },

  activeChipText: {
    color: COLORS.white,
  },
});
