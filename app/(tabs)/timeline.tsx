import DateRangeFilter from '@/components/DateRangeFilter';
import ExperienceCard from '@/components/ExperienceCard';
import ExperienceDetailSheet from '@/components/ExperienceDetailSheet';
import SearchBar from '@/components/SearchBar';
import { COLORS, FONTS, SHADOWS } from '@/constants/theme';
import { useExperiences } from '@/context/ExperiencesContext';
import { useExperienceSearch } from '@/hooks/useExperienceSearch';
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
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Dynamic chip options built from actual data
  const filterOptions = useMemo(() => {
    const types = [...new Set(allExperiences.map((e) => e.type))] as ExperienceType[];
    const skills = [...new Set(allExperiences.flatMap((e) => e.skills))] as SkillTag[];
    return ['All', ...types, ...skills] as const;
  }, [allExperiences]);

  // Step 1: apply chip filter
  const chipFiltered = useMemo(() => {
    if (filter === 'All') return allExperiences;
    return allExperiences.filter(
      (e) => e.type === filter || e.skills.includes(filter as SkillTag),
    );
  }, [allExperiences, filter]);

  // Step 2: apply search + date range on top
  const filtered = useExperienceSearch(chipFiltered, searchText, startDate, endDate);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, Experience[]>();
    [...filtered]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((exp) => {
        const key = new Date(exp.date)
          .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          .toUpperCase();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(exp);
      });
    return Array.from(map.entries());
  }, [filtered]);

  const activeFilterCount = (startDate || endDate ? 1 : 0);

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

  const emptyReason =
    allExperiences.length === 0
      ? 'No experiences yet. Tap ＋ to add one.'
      : 'No experiences match your search or filters.';

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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

        {/* Search bar */}
        <SearchBar value={searchText} onChangeText={setSearchText} />

        {/* Filter row: date range button + chips */}
        <View style={styles.filterRow}>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onApply={(s, e) => { setStartDate(s); setEndDate(e); }}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
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
                <Text style={[styles.chipText, filter === f && styles.activeChipText]}>
                  {f}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Active filter summary */}
        {(searchText || startDate || endDate) && (
          <View style={styles.filterSummaryRow}>
            <Text style={styles.filterSummaryText}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {searchText ? ` for "${searchText}"` : ''}
              {startDate || endDate
                ? ` · ${startDate
                    ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Any'} → ${endDate
                    ? endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Any'}`
                : ''}
            </Text>
            <Pressable
              onPress={() => { setSearchText(''); setStartDate(null); setEndDate(null); }}
              hitSlop={8}
            >
              <Text style={styles.clearAllText}>Clear all</Text>
            </Pressable>
          </View>
        )}

        {/* Grouped list */}
        {grouped.length === 0 ? (
          <Text style={styles.emptyText}>{emptyReason}</Text>
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
      <ExperienceCard experience={exp} onPress={onPress} onToggleStar={onToggleStar} />
      <Pressable style={styles.deleteBtn} onPress={onDelete} hitSlop={4}>
        <Text style={styles.deleteBtnText}>🗑</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  content: { paddingTop: 64, paddingHorizontal: 16, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  header: { fontSize: 32, fontFamily: FONTS.serif, color: COLORS.green },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  addText: { color: COLORS.white, fontSize: 20, lineHeight: 24 },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterContent: { paddingRight: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeChip: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.sans },
  activeChipText: { color: COLORS.white, fontFamily: FONTS.sansBold },
  filterSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  filterSummaryText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  clearAllText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: COLORS.green,
    marginLeft: 8,
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
  swipeWrapper: { position: 'relative' },
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
  deleteBtnText: { fontSize: 16 },
});
