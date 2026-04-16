import { COLORS, FONTS, SHADOWS } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Props {
  startDate: Date | null;
  endDate: Date | null;
  onApply: (start: Date | null, end: Date | null) => void;
}

export default function DateRangeFilter({ startDate, endDate, onApply }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [draftStart, setDraftStart] = useState<Date | null>(startDate);
  const [draftEnd, setDraftEnd] = useState<Date | null>(endDate);
  const [pickingField, setPickingField] = useState<'start' | 'end' | null>(null);

  const isActive = startDate !== null || endDate !== null;

  const fmt = (d: Date | null) =>
    d
      ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Any';

  const handleOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraftStart(startDate);
    setDraftEnd(endDate);
    setPickingField(null);
    setModalVisible(true);
  };

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onApply(draftStart, draftEnd);
    setModalVisible(false);
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraftStart(null);
    setDraftEnd(null);
    onApply(null, null);
    setModalVisible(false);
  };

  return (
    <>
      {/* Calendar filter button */}
      <Pressable
        onPress={handleOpen}
        style={[styles.calBtn, isActive && styles.calBtnActive]}
      >
        <Text style={[styles.calIcon, isActive && styles.calIconActive]}>📅</Text>
        {isActive && <View style={styles.activeDot} />}
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Date Range</Text>
            <Pressable onPress={handleApply}>
              <Text style={styles.modalApply}>Apply</Text>
            </Pressable>
          </View>

          <View style={styles.body}>
            {/* Start date row */}
            <Pressable
              style={[styles.dateRow, pickingField === 'start' && styles.dateRowActive]}
              onPress={() => setPickingField(pickingField === 'start' ? null : 'start')}
            >
              <Text style={styles.dateLabel}>FROM</Text>
              <Text style={[styles.dateValue, !draftStart && styles.datePlaceholder]}>
                {fmt(draftStart)}
              </Text>
              <Text style={styles.chevron}>{pickingField === 'start' ? '▲' : '▼'}</Text>
            </Pressable>

            {pickingField === 'start' && (
              <DateTimePicker
                value={draftStart ?? new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                maximumDate={draftEnd ?? new Date()}
                onChange={(_, date) => {
                  if (date) setDraftStart(date);
                  if (Platform.OS === 'android') setPickingField(null);
                }}
                style={styles.picker}
              />
            )}

            {/* End date row */}
            <Pressable
              style={[styles.dateRow, pickingField === 'end' && styles.dateRowActive]}
              onPress={() => setPickingField(pickingField === 'end' ? null : 'end')}
            >
              <Text style={styles.dateLabel}>TO</Text>
              <Text style={[styles.dateValue, !draftEnd && styles.datePlaceholder]}>
                {fmt(draftEnd)}
              </Text>
              <Text style={styles.chevron}>{pickingField === 'end' ? '▲' : '▼'}</Text>
            </Pressable>

            {pickingField === 'end' && (
              <DateTimePicker
                value={draftEnd ?? new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                minimumDate={draftStart ?? undefined}
                maximumDate={new Date()}
                onChange={(_, date) => {
                  if (date) setDraftEnd(date);
                  if (Platform.OS === 'android') setPickingField(null);
                }}
                style={styles.picker}
              />
            )}

            {/* Active range summary */}
            {(draftStart || draftEnd) && (
              <Text style={styles.rangeSummary}>
                Showing: {fmt(draftStart)} → {fmt(draftEnd)}
              </Text>
            )}

            {/* Clear button */}
            {(draftStart || draftEnd) && (
              <Pressable style={styles.clearBtn} onPress={handleClear}>
                <Text style={styles.clearBtnText}>Clear Filter</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  calBtn: {
    width: 38,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    position: 'relative',
  },
  calBtnActive: {
    backgroundColor: COLORS.greenLight,
    borderColor: COLORS.green,
  },
  calIcon: {
    fontSize: 16,
  },
  calIconActive: {},
  activeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  modal: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
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
  modalApply: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    color: COLORS.green,
  },
  body: {
    padding: 20,
    gap: 4,
  },
  dateRow: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 8,
    ...SHADOWS.card,
  },
  dateRowActive: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenLight,
  },
  dateLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    width: 42,
  },
  dateValue: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  datePlaceholder: {
    color: COLORS.textSecondary,
  },
  chevron: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  picker: {
    marginBottom: 12,
    marginHorizontal: -4,
  },
  rangeSummary: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  clearBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.red,
    alignItems: 'center',
  },
  clearBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: COLORS.red,
  },
});
