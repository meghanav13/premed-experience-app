import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

import { experiences as seedData } from '@/data/experiences';
import {
  CustomPrompt,
  Experience,
  ExperienceType,
  SavedDraft,
  SkillTag,
} from '@/types/experience';

const STORAGE_KEY = 'experiences_v2';
const PROMPTS_KEY = 'customPrompts_v1';
const DRAFTS_KEY = 'savedDrafts_v1';

interface ExperiencesContextValue {
  experiences: Experience[];
  allExperiences: Experience[];
  filter: ExperienceType | SkillTag | 'All';
  setFilter: (f: ExperienceType | SkillTag | 'All') => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  toggleMeaningful: (id: string) => void;
  customPrompts: CustomPrompt[];
  addCustomPrompt: (text: string) => void;
  savedDrafts: SavedDraft[];
  saveDraft: (draft: SavedDraft) => void;
  deleteDraft: (id: string) => void;
}

const ExperiencesContext = createContext<ExperiencesContextValue>(
  {} as ExperiencesContextValue,
);

export function ExperiencesProvider({ children }: { children: React.ReactNode }) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filter, setFilter] = useState<ExperienceType | SkillTag | 'All'>('All');
  const [customPrompts, setCustomPrompts] = useState<CustomPrompt[]>([]);
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load all data once on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [storedExp, storedPrompts, storedDrafts] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(PROMPTS_KEY),
          AsyncStorage.getItem(DRAFTS_KEY),
        ]);
        setExperiences(storedExp ? JSON.parse(storedExp) : seedData);
        setCustomPrompts(storedPrompts ? JSON.parse(storedPrompts) : []);
        setSavedDrafts(storedDrafts ? JSON.parse(storedDrafts) : []);
      } catch {
        setExperiences(seedData);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  // Persist on change (skip initial empty state before load completes)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(experiences));
  }, [experiences, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(PROMPTS_KEY, JSON.stringify(customPrompts));
  }, [customPrompts, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(DRAFTS_KEY, JSON.stringify(savedDrafts));
  }, [savedDrafts, loaded]);

  const addExperience = (exp: Experience) => {
    setExperiences((prev) => [exp, ...prev]);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    );
  };

  const deleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleMeaningful = (id: string) => {
    setExperiences((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, isMeaningful: !e.isMeaningful } : e,
      ),
    );
  };

  const addCustomPrompt = (text: string) => {
    const prompt: CustomPrompt = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
    };
    setCustomPrompts((prev) => [prompt, ...prev]);
  };

  const saveDraft = (draft: SavedDraft) => {
    setSavedDrafts((prev) => [draft, ...prev]);
  };

  const deleteDraft = (id: string) => {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  // Dynamic filter: supports ExperienceType and SkillTag
  const filteredExperiences =
    filter === 'All'
      ? experiences
      : experiences.filter(
          (e) => e.type === filter || e.skills.includes(filter as SkillTag),
        );

  return (
    <ExperiencesContext.Provider
      value={{
        experiences: filteredExperiences,
        allExperiences: experiences,
        filter,
        setFilter,
        addExperience,
        updateExperience,
        deleteExperience,
        toggleMeaningful,
        customPrompts,
        addCustomPrompt,
        savedDrafts,
        saveDraft,
        deleteDraft,
      }}
    >
      {children}
    </ExperiencesContext.Provider>
  );
}

export const useExperiences = () => useContext(ExperiencesContext);
