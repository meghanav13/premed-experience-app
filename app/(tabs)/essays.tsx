import { Tag } from '@/components/Tag';
import { COLORS, FONTS, SHADOWS } from '@/constants/theme';
import { useExperiences } from '@/context/ExperiencesContext';
import { Experience, ExperienceType, SkillTag } from '@/types/experience';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const HARDCODED_PROMPTS = [
  'Most meaningful experience',
  'Biggest challenge faced & solution',
  'Social determinants of health',
  'A time you worked on a team',
  'What drives you to pursue medicine',
];

type EssayFilter = 'All' | 'Starred' | ExperienceType;

export default function EssaysScreen() {
  const router = useRouter();
  const { allExperiences, customPrompts, addCustomPrompt, savedDrafts, deleteDraft } =
    useExperiences();

  const allPrompts = [...HARDCODED_PROMPTS, ...customPrompts.map((p) => p.text)];

  const [selectedPrompt, setSelectedPrompt] = useState(allPrompts[0]);
  const [promptDropdownOpen, setPromptDropdownOpen] = useState(false);
  const [customPromptModalVisible, setCustomPromptModalVisible] = useState(false);
  const [customPromptText, setCustomPromptText] = useState('');
  const [essayFilter, setEssayFilter] = useState<EssayFilter>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Reset selection when tab loses focus
  useFocusEffect(
    useCallback(() => {
      return () => setSelectedIds(new Set());
    }, []),
  );

  const filterOptions: EssayFilter[] = ['All', 'Starred', 'Clinical', 'Shadowing', 'Research'];

  const filteredExps = useMemo(() => {
    switch (essayFilter) {
      case 'Starred':
        return allExperiences.filter((e) => e.isMeaningful);
      case 'Clinical':
      case 'Shadowing':
      case 'Research':
        return allExperiences.filter((e) => e.type === essayFilter);
      default:
        return allExperiences;
    }
  }, [allExperiences, essayFilter]);

  const selectedExps = allExperiences.filter((e) => selectedIds.has(e.id));

  const coveredSkills: SkillTag[] = [
    ...new Set(selectedExps.flatMap((e) => e.skills)),
  ] as SkillTag[];

  const toggleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSaveCustomPrompt = () => {
    const text = customPromptText.trim();
    if (!text) return;
    addCustomPrompt(text);
    setSelectedPrompt(text);
    setCustomPromptText('');
    setCustomPromptModalVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleGenerate = () => {
    if (selectedIds.size === 0 || !selectedPrompt) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/draft',
      params: {
        prompt: selectedPrompt,
        experienceIds: JSON.stringify([...selectedIds]),
      },
    });
  };

  const handleDeleteDraft = (id: string) => {
    Alert.alert('Delete Draft', 'Remove this saved draft?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deleteDraft(id);
        },
      },
    ]);
  };

  const canGenerate = selectedIds.size > 0 && !!selectedPrompt;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Essay Builder</Text>

      {/* PROMPT SECTION */}
      <Text style={styles.sectionLabel}>PROMPT</Text>
      <Pressable
        style={styles.promptSelector}
        onPress={() => setPromptDropdownOpen(!promptDropdownOpen)}
      >
        <Text style={styles.promptSelectorText} numberOfLines={2}>
          {selectedPrompt}
        </Text>
        <Text style={styles.chevron}>{promptDropdownOpen ? '▲' : '▼'}</Text>
      </Pressable>

      {promptDropdownOpen && (
        <View style={styles.dropdown}>
          {allPrompts.map((p, i) => (
            <Pressable
              key={i}
              style={[styles.dropdownItem, selectedPrompt === p && styles.dropdownItemActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedPrompt(p);
                setPromptDropdownOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedPrompt === p && styles.dropdownItemTextActive,
                ]}
              >
                {p}
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={styles.dropdownItem}
            onPress={() => {
              setPromptDropdownOpen(false);
              setCustomPromptModalVisible(true);
            }}
          >
            <Text style={[styles.dropdownItemText, { color: COLORS.green }]}>
              + Custom prompt…
            </Text>
          </Pressable>
        </View>
      )}

      {/* SELECT EXPERIENCES */}
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>SELECT EXPERIENCES</Text>

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
              setEssayFilter(f);
            }}
            style={[styles.chip, essayFilter === f && styles.activeChip]}
          >
            <Text style={[styles.chipText, essayFilter === f && styles.activeChipText]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Experience list with checkboxes */}
      <View style={styles.expList}>
        {filteredExps.map((exp) => {
          const checked = selectedIds.has(exp.id);
          return (
            <Pressable
              key={exp.id}
              style={[styles.expRow, checked && styles.expRowChecked]}
              onPress={() => toggleSelect(exp.id)}
            >
              <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.expRowContent}>
                <Text style={styles.expTitle}>{exp.title}</Text>
                <Text style={styles.expSub}>
                  {new Date(exp.date).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  • {exp.type} • {exp.hours} hrs
                </Text>
              </View>
              {exp.isMeaningful && <Text style={styles.expStar}>⭐</Text>}
            </Pressable>
          );
        })}
      </View>

      {/* SKILLS COVERED */}
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>SKILLS COVERED</Text>
      {coveredSkills.length === 0 ? (
        <Text style={styles.skillsEmpty}>
          Select experiences to see skills covered.
        </Text>
      ) : (
        <View style={styles.skillsCloud}>
          {coveredSkills.map((skill) => (
            <Tag key={skill} label={skill} variant="skill" />
          ))}
        </View>
      )}

      {/* GENERATE BUTTON */}
      <Pressable
        style={[styles.generateBtn, !canGenerate && styles.generateBtnDisabled]}
        onPress={handleGenerate}
        disabled={!canGenerate}
      >
        <Text style={styles.generateBtnText}>Generate Draft →</Text>
      </Pressable>

      {/* MY DRAFTS */}
      {savedDrafts.length > 0 && (
        <View style={styles.draftsSection}>
          <Text style={styles.sectionLabel}>MY DRAFTS</Text>
          {savedDrafts.map((draft) => (
            <Pressable
              key={draft.id}
              style={styles.draftRow}
              onPress={() =>
                router.push({
                  pathname: '/draft',
                  params: {
                    outline: draft.outline,
                    prompt: draft.prompt,
                    experienceIds: JSON.stringify(draft.experienceIds),
                    viewOnly: '1',
                  },
                })
              }
              onLongPress={() => handleDeleteDraft(draft.id)}
            >
              <Text style={styles.draftPrompt} numberOfLines={1}>
                {draft.prompt}
              </Text>
              <Text style={styles.draftDate}>
                {new Date(draft.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </Pressable>
          ))}
          <Text style={styles.draftsHint}>Long-press a draft to delete it.</Text>
        </View>
      )}

      {/* Custom prompt modal */}
      <Modal
        visible={customPromptModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCustomPromptModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setCustomPromptModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Custom Prompt</Text>
            <Pressable onPress={handleSaveCustomPrompt}>
              <Text style={styles.modalSave}>Save</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.modalInput}
            value={customPromptText}
            onChangeText={setCustomPromptText}
            placeholder="Type your custom essay prompt…"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            autoFocus
            textAlignVertical="top"
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  content: { paddingTop: 64, paddingHorizontal: 16, paddingBottom: 48 },
  header: {
    fontSize: 32,
    fontFamily: FONTS.serif,
    color: COLORS.green,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  promptSelector: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  promptSelectorText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  chevron: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemActive: {
    backgroundColor: COLORS.greenLight,
  },
  dropdownItemText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  dropdownItemTextActive: {
    fontFamily: FONTS.sansBold,
    color: COLORS.green,
  },
  filterScroll: { marginBottom: 12 },
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
  expList: { gap: 8 },
  expRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  expRowChecked: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenLight,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  checkmark: { color: COLORS.white, fontSize: 13, fontFamily: FONTS.sansBold },
  expRowContent: { flex: 1 },
  expTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  expSub: { fontFamily: FONTS.sans, fontSize: 12, color: COLORS.textSecondary },
  expStar: { fontSize: 14, marginLeft: 8 },
  skillsEmpty: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  skillsCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 20,
  },
  generateBtn: {
    backgroundColor: COLORS.green,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  generateBtnDisabled: { backgroundColor: '#A8C5B5', opacity: 0.7 },
  generateBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.sansBold,
    fontSize: 16,
  },
  draftsSection: { marginTop: 28 },
  draftRow: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  draftPrompt: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  draftDate: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  draftsHint: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  modalCancel: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  modalSave: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    color: COLORS.green,
  },
  modalInput: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: COLORS.textPrimary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
