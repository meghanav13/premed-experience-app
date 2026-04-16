import { COLORS, FONTS, SHADOWS } from '@/constants/theme';
import { Experience } from '@/types/experience';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tag } from './Tag';

interface Props {
  experience: Experience;
  onPress?: () => void;
  onToggleStar?: () => void;
}

export default function ExperienceCard({ experience, onPress, onToggleStar }: Props) {
  const date = new Date(experience.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {experience.title}
          </Text>
          <Pressable
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
              onToggleStar?.();
            }}
          >
            <Text style={styles.star}>
              {experience.isMeaningful ? '⭐' : '☆'}
            </Text>
          </Pressable>
        </View>
        <View style={styles.hoursBubble}>
          <Text style={styles.hoursText}>{experience.hours} hrs</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        {formattedDate}
        {experience.location ? ` • ${experience.location}` : ''}
        {experience.supervisor ? ` • ${experience.supervisor}` : ''}
      </Text>

      <View style={styles.tagsRow}>
        <Tag label={experience.type} variant="type" />
        {experience.skills.slice(0, 3).map((skill, i) => (
          <Tag key={i} label={skill} variant="skill" />
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
    marginBottom: 12,
    ...SHADOWS.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.sansBold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  star: {
    fontSize: 16,
  },
  hoursBubble: {
    backgroundColor: COLORS.greenLight,
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
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    flexWrap: 'wrap',
  },
});
