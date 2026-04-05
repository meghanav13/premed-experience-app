import { Experience } from "@/types/experience";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Tag } from "./Tag";

interface Props {
  experience: Experience;
  onPress?: () => void;
  showStar?: boolean;
  onToggleStar?: () => void;
}

export default function ExperienceCard({
  experience,
  onPress,
  showStar = true,
  onToggleStar,
}: Props) {
  const date = new Date(experience.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{experience.title}</Text>

          {showStar && (
            <Text
              style={styles.star}
              onPress={(e) => {
                e.stopPropagation();
                onToggleStar?.();
              }}
            >
              {experience.isMeaningful ? "⭐" : "☆"}
            </Text>
          )}
        </View>

        <View style={styles.hoursBubble}>
          <Text style={styles.hoursText}>{experience.hours} hrs</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        {formattedDate} • {experience.location} • {experience.supervisor}
      </Text>

      <View style={styles.tagsRow}>
        {experience.tags.map((tag, index) => (
          <Tag key={index} label={tag} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E1E1E",
  },

  star: {
    fontSize: 16,
  },

  hoursBubble: {
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  hoursText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2E7D32",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },

  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },
});
