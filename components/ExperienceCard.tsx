import { COLORS, FONTS } from "@/constants/theme";
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
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
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
    fontSize: 17,
    fontFamily: FONTS.sansBold,
    color: COLORS.textPrimary,
  },

  star: {
    fontSize: 16,
  },

  hoursBubble: {
    backgroundColor: "#EDF7F1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  hoursText: {
    fontSize: 12,
    fontFamily: FONTS.sansBold,
    color: COLORS.green,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
  },

  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },
});
