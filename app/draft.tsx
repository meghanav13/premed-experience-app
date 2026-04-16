import { COLORS, FONTS, SHADOWS } from '@/constants/theme';
import { useExperiences } from '@/context/ExperiencesContext';
import { SavedDraft } from '@/types/experience';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const GEMINI_MODEL = 'gemini-2.5-flash';

export default function DraftScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    prompt: string;
    experienceIds: string;
    outline?: string;
    viewOnly?: string;
  }>();

  const { allExperiences, saveDraft } = useExperiences();

  const isViewOnly = params.viewOnly === '1';
  const prompt = params.prompt ?? '';
  const experienceIds: string[] = params.experienceIds
    ? JSON.parse(params.experienceIds)
    : [];

  const selectedExps = allExperiences.filter((e) => experienceIds.includes(e.id));

  const [outline, setOutline] = useState(params.outline ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);

  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

  useEffect(() => {
    if (isViewOnly || hasFetched.current || !prompt) return;
    hasFetched.current = true;
    generateOutline();
  }, []);

  const buildPromptText = () => {
    const expBlocks = selectedExps
      .map(
        (e) =>
          `Title: ${e.title}
Type: ${e.type}
Hours: ${e.hours}
Location: ${e.location}
Supervisor: ${e.supervisor || 'N/A'}
Skills demonstrated: ${e.skills.join(', ') || 'None listed'}
What happened: ${e.whatHappened}
Why it mattered: ${e.whyItMattered}`,
      )
      .join('\n\n');

    return `You are helping a premed student outline a medical school application essay.

ESSAY PROMPT: ${prompt}

EXPERIENCES TO DRAW FROM:
${expBlocks}

Generate a clear, structured OUTLINE (not a full essay) for this medical school application essay. Use this format:

HOOK / OPENING:
[specific opening idea grounded in one of the experiences]

BODY POINT 1: [theme]
Supporting experience: [which one]
Key details to include:
Reflection / insight:

BODY POINT 2: [theme]
(same structure)

[Add more body points as needed]

CONCLUSION / THESIS:
[tie back to prompt and future in medicine]

Keep it concrete and specific to the experiences provided. Don't invent details not in the experiences.`;
  };

  const generateOutline = async () => {
    if (!apiKey || apiKey === 'your_key_here') {
      setError('Add your Gemini API key to .env to generate drafts.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: buildPromptText() }] }],
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error('Gemini error:', errText);
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join('') ??
        'No response received.';
      setOutline(text);
    } catch (err) {
      console.error(err);
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(outline);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Outline copied to clipboard.');
  };

  const handleSave = () => {
    if (!outline) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const draft: SavedDraft = {
      id: Date.now().toString(),
      prompt,
      experienceIds,
      outline,
      createdAt: new Date().toISOString(),
    };
    saveDraft(draft);
    Alert.alert('Saved!', 'Draft saved to My Drafts.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.promptTitle}>{prompt}</Text>

        {selectedExps.length > 0 && (
          <Text style={styles.expCount}>
            Drawing from {selectedExps.length} experience
            {selectedExps.length !== 1 ? 's' : ''}
          </Text>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.green} />
            <Text style={styles.loadingText}>Generating outline…</Text>
          </View>
        )}

        {error !== '' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            {error.includes('Network') && (
              <Pressable style={styles.retryBtn} onPress={generateOutline}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </Pressable>
            )}
          </View>
        )}

        {outline !== '' && !loading && (
          <View style={styles.outlineCard}>
            <Text style={styles.outlineText}>{outline}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom actions */}
      {outline !== '' && !loading && (
        <View style={styles.actions}>
          <Pressable style={styles.copyBtn} onPress={handleCopy}>
            <Text style={styles.copyBtnText}>Copy to Clipboard</Text>
          </Pressable>
          {!isViewOnly && (
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Draft</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backText: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 32 },
  promptTitle: {
    fontSize: 24,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    marginBottom: 8,
    lineHeight: 32,
  },
  expCount: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  loadingText: {
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  errorContainer: {
    backgroundColor: COLORS.redLight,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  errorText: {
    fontFamily: FONTS.sans,
    color: COLORS.red,
    fontSize: 14,
    lineHeight: 20,
  },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.red,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.sansBold,
    fontSize: 14,
  },
  outlineCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    ...SHADOWS.card,
  },
  outlineText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  actions: {
    padding: 20,
    paddingBottom: 36,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  copyBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.green,
  },
  copyBtnText: {
    fontFamily: FONTS.sansBold,
    color: COLORS.green,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: COLORS.green,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: FONTS.sansBold,
    color: COLORS.white,
    fontSize: 15,
  },
});
