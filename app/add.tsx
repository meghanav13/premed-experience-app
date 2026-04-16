import { COLORS, FONTS, SHADOWS } from '@/constants/theme';
import { useExperiences } from '@/context/ExperiencesContext';
import { Experience, ExperienceType, SkillTag } from '@/types/experience';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const TYPES: ExperienceType[] = ['Clinical', 'Shadowing', 'Research'];

const ALL_SKILLS: SkillTag[] = [
  'Health Equity',
  'Leadership',
  'Soft Skills',
  'Technical Skills',
  'Communication',
  'Teamwork',
  'Cultural Competency',
  'Patient Care',
];

export default function AddExperience() {
  const router = useRouter();
  const params = useLocalSearchParams<{ editId?: string }>();
  const { addExperience, updateExperience, allExperiences } = useExperiences();

  const editingExp = params.editId
    ? allExperiences.find((e) => e.id === params.editId) ?? null
    : null;
  const isEditing = !!editingExp;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ExperienceType>('Clinical');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState('');
  const [location, setLocation] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [skills, setSkills] = useState<SkillTag[]>([]);
  const [whatHappened, setWhatHappened] = useState('');
  const [whyItMattered, setWhyItMattered] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill when editing
  useEffect(() => {
    if (editingExp) {
      setTitle(editingExp.title);
      setType(editingExp.type);
      setDate(new Date(editingExp.date));
      setHours(String(editingExp.hours));
      setLocation(editingExp.location);
      setSupervisor(editingExp.supervisor);
      setSkills(editingExp.skills);
      setWhatHappened(editingExp.whatHappened);
      setWhyItMattered(editingExp.whyItMattered);
    }
  }, []);

  const toggleSkill = (skill: SkillTag) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!hours || isNaN(Number(hours)) || Number(hours) <= 0)
      errs.hours = 'Enter a valid number of hours';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const payload: Experience = {
      id: editingExp?.id ?? Date.now().toString(),
      title: title.trim(),
      type,
      date: date.toISOString().split('T')[0],
      hours: Number(hours),
      location: location.trim(),
      supervisor: supervisor.trim(),
      whatHappened: whatHappened.trim(),
      whyItMattered: whyItMattered.trim(),
      skills,
      isMeaningful: editingExp?.isMeaningful ?? false,
      createdAt: editingExp?.createdAt ?? new Date().toISOString(),
    };

    if (isEditing) {
      updateExperience(payload.id, payload);
    } else {
      addExperience(payload);
    }
    router.back();
  };

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backText}>← Cancel</Text>
        </Pressable>
        <Text style={styles.header}>
          {isEditing ? 'Edit Experience' : 'Add Experience'}
        </Text>
        <View style={{ width: 70 }} />
      </View>

      {/* TYPE */}
      <Text style={styles.label}>TYPE</Text>
      <View style={styles.segmentRow}>
        {TYPES.map((t) => (
          <Pressable
            key={t}
            style={[styles.segment, type === t && styles.segmentActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setType(t);
            }}
          >
            <Text
              style={[styles.segmentText, type === t && styles.segmentTextActive]}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* DATE */}
      <Text style={styles.label}>DATE</Text>
      <Pressable
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.inputText}>{formattedDate}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, selected) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selected) setDate(selected);
          }}
          maximumDate={new Date()}
        />
      )}

      {/* HOURS */}
      <Text style={styles.label}>HOURS</Text>
      <TextInput
        style={[styles.input, errors.hours ? styles.inputError : null]}
        value={hours}
        onChangeText={(v) => {
          setHours(v);
          setErrors((e) => ({ ...e, hours: '' }));
        }}
        keyboardType="decimal-pad"
        placeholder="e.g. 4"
        placeholderTextColor={COLORS.textSecondary}
      />
      {errors.hours ? <Text style={styles.errorText}>{errors.hours}</Text> : null}

      {/* TITLE */}
      <Text style={styles.label}>TITLE</Text>
      <TextInput
        style={[styles.input, errors.title ? styles.inputError : null]}
        value={title}
        onChangeText={(v) => {
          setTitle(v);
          setErrors((e) => ({ ...e, title: '' }));
        }}
        placeholder="e.g. Free Clinic Shift"
        placeholderTextColor={COLORS.textSecondary}
      />
      {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

      {/* LOCATION */}
      <Text style={styles.label}>LOCATION</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Where was this?"
        placeholderTextColor={COLORS.textSecondary}
      />

      {/* SUPERVISOR */}
      <Text style={styles.label}>SUPERVISOR (optional)</Text>
      <TextInput
        style={styles.input}
        value={supervisor}
        onChangeText={setSupervisor}
        placeholder="Doctor / manager name"
        placeholderTextColor={COLORS.textSecondary}
      />

      {/* SKILLS */}
      <Text style={styles.label}>SKILLS</Text>
      <View style={styles.skillsGrid}>
        {ALL_SKILLS.map((skill) => {
          const active = skills.includes(skill);
          return (
            <Pressable
              key={skill}
              style={[styles.skillChip, active && styles.skillChipActive]}
              onPress={() => toggleSkill(skill)}
            >
              <Text
                style={[
                  styles.skillChipText,
                  active && styles.skillChipTextActive,
                ]}
              >
                {skill}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* WHAT HAPPENED */}
      <Text style={styles.label}>WHAT HAPPENED?</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={whatHappened}
        onChangeText={setWhatHappened}
        placeholder="Describe the experience..."
        placeholderTextColor={COLORS.textSecondary}
        multiline
        textAlignVertical="top"
      />

      {/* WHY IT MATTERED */}
      <Text style={styles.label}>WHY DID IT MATTER?</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={whyItMattered}
        onChangeText={setWhyItMattered}
        placeholder="What impact did this have on you?"
        placeholderTextColor={COLORS.textSecondary}
        multiline
        textAlignVertical="top"
      />

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>
          {isEditing ? 'Update Experience' : 'Save Experience'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backText: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: COLORS.textSecondary,
    width: 70,
  },
  header: {
    fontSize: 22,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  label: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  segmentActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  segmentText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.sansBold,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  inputText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  errorText: {
    color: COLORS.red,
    fontFamily: FONTS.sans,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
  multiline: {
    minHeight: 90,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  skillChipActive: {
    backgroundColor: COLORS.skillBlueLight,
    borderColor: COLORS.skillBlue,
  },
  skillChipText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  skillChipTextActive: {
    color: COLORS.skillBlue,
    fontFamily: FONTS.sansBold,
  },
  saveBtn: {
    backgroundColor: COLORS.green,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.sansBold,
    fontSize: 16,
  },
});
