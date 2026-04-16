import ExperienceDetailSheet from '@/components/ExperienceDetailSheet';
import { ProgressBar } from '@/components/ProgressBar';
import { Tag } from '@/components/Tag';
import { COLORS, FONTS, SHADOWS } from '@/constants/theme';
import { useExperiences } from '@/context/ExperiencesContext';
import { Experience } from '@/types/experience';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const HOUR_GOAL = 150;

export default function HomeScreen() {
  const { allExperiences, savedDrafts } = useExperiences();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  // Filter to current calendar month
  const now = new Date();
  const thisMonth = allExperiences.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const clinical = thisMonth
    .filter((e) => e.type === 'Clinical')
    .reduce((s, e) => s + e.hours, 0);
  const shadowing = thisMonth
    .filter((e) => e.type === 'Shadowing')
    .reduce((s, e) => s + e.hours, 0);
  const research = thisMonth
    .filter((e) => e.type === 'Research')
    .reduce((s, e) => s + e.hours, 0);

  const highlights = allExperiences.filter((e) => e.isMeaningful);
  const latestDraft = savedDrafts[0] ?? null;

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.green}
          />
        }
      >
        <Text style={styles.header}>My Journey</Text>

        {/* THIS MONTH CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionLabel}>THIS MONTH</Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/timeline');
              }}
            >
              <Text style={styles.jumpLink}>Jump →</Text>
            </Pressable>
          </View>

          <ProgressRow label="Clinical" hours={clinical} goal={HOUR_GOAL} />
          <ProgressRow label="Shadowing" hours={shadowing} goal={HOUR_GOAL} />
          <ProgressRow label="Research" hours={research} goal={HOUR_GOAL} />
        </View>

        {/* ATTENTION CARD — only if a saved draft exists */}
        {latestDraft && (
          <Pressable
            style={styles.attentionCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/essays');
            }}
          >
            <Text style={styles.attentionLabel}>⚠️ DRAFT IN PROGRESS</Text>
            <Text style={styles.attentionTitle} numberOfLines={1}>
              {latestDraft.prompt}
            </Text>
            <Text style={styles.attentionSub}>Tap to continue in Essays →</Text>
          </Pressable>
        )}

        {/* HIGHLIGHTS CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>⭐ HIGHLIGHTS</Text>
          {highlights.length === 0 ? (
            <Text style={styles.emptyText}>
              Star an experience on the Timeline to see it here.
            </Text>
          ) : (
            highlights.map((exp) => (
              <Pressable
                key={exp.id}
                style={styles.highlightRow}
                onPress={() => openDetail(exp)}
              >
                <Text style={styles.highlightTitle}>{exp.title}</Text>
                <View style={styles.tagsRow}>
                  <Tag label={exp.type} variant="type" />
                  {exp.skills.slice(0, 2).map((skill, i) => (
                    <Tag key={i} label={skill} variant="skill" />
                  ))}
                </View>
              </Pressable>
            ))
          )}
        </View>
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

function ProgressRow({
  label,
  hours,
  goal,
}: {
  label: string;
  hours: number;
  goal: number;
}) {
  return (
    <View style={styles.progressBlock}>
      <View style={styles.progressLabelRow}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressValue}>
          {hours} / {goal} hrs
        </Text>
      </View>
      <ProgressBar progress={hours / goal} />
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
  header: {
    fontSize: 32,
    fontFamily: FONTS.serif,
    color: COLORS.green,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  jumpLink: {
    fontSize: 13,
    fontFamily: FONTS.sansBold,
    color: COLORS.green,
  },
  progressBlock: {
    marginTop: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressLabel: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  progressValue: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: COLORS.green,
  },
  attentionCard: {
    borderWidth: 1.5,
    borderColor: COLORS.amber,
    backgroundColor: COLORS.amberLight,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  attentionLabel: {
    color: COLORS.amber,
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  attentionTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  attentionSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    fontFamily: FONTS.sans,
  },
  highlightRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  highlightTitle: {
    fontSize: 14,
    fontFamily: FONTS.sansBold,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  emptyText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
});
