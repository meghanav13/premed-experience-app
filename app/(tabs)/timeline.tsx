import ExperienceCard from '@/components/ExperienceCard';
import ExperienceDetailSheet from '@/components/ExperienceDetailSheet';
import { COLORS, FONTS, SHADOWS } from '@/constants/theme';
import { useExperiences } from '@/context/ExperiencesContext';
import { Experience, ExperienceType, SkillTag } from '@/types/experience';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function TimelineScreen() {
  const router = useRouter();
  const { allExperiences, filter, setFilter, deleteExperience, toggleMeaningful } =
    useExperiences();
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Build dynamic filter chips from what's actually in the data
  const filterOptions = useMemo(() => {
    const types = [...new Set(allExperiences.map((e) => e.type))] as ExperienceType[];
    const skills = [
      ...new Set(allExperiences.flatMap((e) => e.skills)),
    ] as SkillTag[];
    return ['All', ...types, ...skills] as const;
  }, [allExperiences]);

  // Apply filter
  const filtered = useMemo(() => {
    if (filter === 'All') return allExperiences;
    return allExperiences.filter(
      (e) => e.type === filter || e.skills.includes(filter as SkillTag),
    );
  }, [allExperiences, filter]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, Experience[]>();
    [...filtered]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((exp) => {
        const d = new Date(exp.date);
        const key = d.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        }).toUpperCase();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(exp);
      });
    return Array.from(map.entries());
  }, [filtered]);

  const handleDelete = (exp: Experience) => {
    Alert.alert(
      'Delete Experience',
      `Delete "${exp.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            deleteExperience(exp.id);
          },
        },
      ],
    );
  };

  const openDetail = (exp: Experience) => {
    setSelectedExp(exp);
    setDetailVisible(true);
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.header}>Timeline</Text>
          <Pressable
            style={styles.addButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/add');
            }}
          >
            <Text style={styles.addText}>＋</Text>
          </Pressable>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {filterOptions.map((f) => (
            <Pressable
              key={f}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilter(f as ExperienceType | SkillTag | 'All');
              }}
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

        {/* Grouped list */}
        {grouped.length === 0 ? (
          <Text style={styles.emptyText}>No experiences yet. Tap ＋ to add one.</Text>
        ) : (
          grouped.map(([monthLabel, exps]) => (
            <View key={monthLabel}>
              <Text style={styles.monthLabel}>{monthLabel}</Text>
              {exps.map((exp) => (
                <SwipeableCard
                  key={exp.id}
                  exp={exp}
                  onPress={() => openDetail(exp)}
                  onToggleStar={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    toggleMeaningful(exp.id);
                  }}
                  onDelete={() => handleDelete(exp)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <ExperienceDetailSheet
        experience={selectedExp}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        onEdit={(exp) => {
          setDetailVisible(false);
          router.push({ pathname: '/add', params: { editId: exp.id } });
        }}
      />
    </>
  );
}

// Swipeable card: long-press reveals delete, keeps it simple without Swipeable pkg complexities
function SwipeableCard({
  exp,
  onPress,
  onToggleStar,
  onDelete,
}: {
  exp: Experience;
  onPress: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.swipeWrapper}>
      <ExperienceCard
        experience={exp}
        onPress={onPress}
        onToggleStar={onToggleStar}
      />
      {/* Delete button revealed on the right — implemented as a long-press
          Alternative: use react-native-gesture-handler Swipeable if preferred */}
      <Pressable
        style={styles.deleteBtn}
        onPress={onDelete}
        hitSlop={4}
      >
        <Text style={styles.deleteBtnText}>🗑</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  content: {
    paddingTop: 64,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  header: {
    fontSize: 32,
    fontFamily: FONTS.serif,
    color: COLORS.green,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  addText: {
    color: COLORS.white,
    fontSize: 20,
    lineHeight: 24,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContent: {
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeChip: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONTS.sans,
  },
  activeChipText: {
    color: COLORS.white,
    fontFamily: FONTS.sansBold,
  },
  monthLabel: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 8,
  },
  emptyText: {
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 60,
    lineHeight: 22,
  },
  swipeWrapper: {
    position: 'relative',
  },
  deleteBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 12,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  deleteBtnText: {
    fontSize: 16,
  },
});
