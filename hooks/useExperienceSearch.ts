import { Experience } from '@/types/experience';
import { useMemo } from 'react';

/**
 * Applies text search + optional date-range filter on top of an already
 * chip-filtered list of experiences.
 */
export function useExperienceSearch(
  experiences: Experience[],
  searchText: string,
  startDate: Date | null,
  endDate: Date | null,
): Experience[] {
  return useMemo(() => {
    let result = experiences;

    // --- text search ---
    const q = searchText.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.supervisor.toLowerCase().includes(q) ||
          e.whatHappened.toLowerCase().includes(q) ||
          e.whyItMattered.toLowerCase().includes(q) ||
          e.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }

    // --- date range ---
    if (startDate) {
      // Zero out time so the start day is inclusive
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter((e) => new Date(e.date) >= start);
    }
    if (endDate) {
      // Include the full end day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((e) => new Date(e.date) <= end);
    }

    return result;
  }, [experiences, searchText, startDate, endDate]);
}
