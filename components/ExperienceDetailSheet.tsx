import { COLORS, FONTS, SHADOWS } from '@/constants/theme';
import { useExperiences } from '@/context/ExperiencesContext';
import { Experience } from '@/types/experience';
import * as Haptics from 'expo-haptics';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Tag } from './Tag';

interface Props {
  experience: Experience | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (exp: Experience) => void;
}

export default function ExperienceDetailSheet({
  experience,
  visible,
  onClose,
  onEdit,
}: Props) {
  const { toggleMeaningful } = useExperiences();

  if (!experience) return null;

  const date = new Date(experience.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleMeaningful(experience.id);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Handle bar */}
        <View style={styles.handleBar} />

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Close</Text>
          </Pressable>
          <Pressable onPress={() => onEdit(experience)} hitSlop={8}>
            <Text style={styles.editBtnText}>Edit ✏️</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>{experience.title}</Text>

          {/* Meta */}
          <Text style={styles.meta}>
            {date} • {experience.hours} hrs
            {experience.location ? ` • ${experience.location}` : ''}
          </Text>
          {experience.supervisor ? (
            <Text style={styles.supervisor}>
              Supervisor: {experience.supervisor}
            </Text>
          ) : null}

          {/* Tags */}
          <View style={styles.tagsRow}>
            <Tag label={experience.type} variant="type" />
            {experience.skills.map((skill, i) => (
              <Tag key={i} label={skill} variant="skill" />
            ))}
          </View>

          {/* What Happened */}
          {experience.whatHappened ? (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>WHAT HAPPENED?</Text>
              <Text style={styles.cardBody}>{experience.whatHappened}</Text>
            </View>
          ) : null}

          {/* Why It Mattered */}
          {experience.whyItMattered ? (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>WHY DID IT MATTER?</Text>
              <Text style={styles.cardBody}>{experience.whyItMattered}</Text>
            </View>
          ) : null}

          {/* Meaningful toggle */}
          <Pressable
            onPress={handleToggle}
            style={[
              styles.meaningfulBtn,
              experience.isMeaningful && styles.meaningfulBtnActive,
            ]}
          >
            <Text
              style={[
                styles.meaningfulBtnText,
                experience.isMeaningful && styles.meaningfulBtnTextActive,
              ]}
            >
              {experience.isMeaningful
                ? '⭐  Marked as Meaningful'
                : '☆  Mark as Meaningful'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    paddingTop: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  closeBtnText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.sans,
    fontSize: 15,
  },
  editBtnText: {
    color: COLORS.green,
    fontFamily: FONTS.sansBold,
    fontSize: 15,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  supervisor: {
    fontSize: 14,
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  meaningfulBtn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  meaningfulBtnActive: {
    backgroundColor: COLORS.amberLight,
    borderColor: COLORS.amber,
  },
  meaningfulBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  meaningfulBtnTextActive: {
    color: COLORS.amber,
  },
});
