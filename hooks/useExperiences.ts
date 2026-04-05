import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { experiences as initialData } from "@/data/experiences";
import { Experience, ExperienceType } from "@/types/experience";

const STORAGE_KEY = "experiences";

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>(initialData);
  const [filter, setFilter] = useState<ExperienceType | "All">("All");

  // 🔄 load from storage on app start
  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setExperiences(JSON.parse(stored));
        }
      } catch (e) {
        console.log("Failed to load experiences", e);
      }
    };

    loadExperiences();
  }, []);

  // 💾 save whenever experiences change
  useEffect(() => {
    const saveExperiences = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(experiences));
      } catch (e) {
        console.log("Failed to save experiences", e);
      }
    };

    saveExperiences();
  }, [experiences]);

  // ➕ add new experience
  const addExperience = (exp: Experience) => {
    setExperiences((prev) => [exp, ...prev]);
  };

  // ⭐ toggle meaningful
  const toggleMeaningful = (id: string) => {
    setExperiences((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, isMeaningful: !exp.isMeaningful } : exp,
      ),
    );
  };

  // 🔍 filter logic
  const filteredExperiences =
    filter === "All"
      ? experiences
      : experiences.filter(
          (exp) => exp.type === filter || exp.tags.includes(filter),
        );

  return {
    experiences: filteredExperiences,
    allExperiences: experiences,
    filter,
    setFilter,
    addExperience,
    toggleMeaningful,
  };
}
