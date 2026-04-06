import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

import { experiences as initialData } from "@/data/experiences";
import { Experience, ExperienceType } from "@/types/experience";

const STORAGE_KEY = "experiences";

const ExperiencesContext = createContext<any>({});

export function ExperiencesProvider({ children }: any) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filter, setFilter] = useState<ExperienceType | "All">("All");

  // load once
  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setExperiences(JSON.parse(stored));
      else setExperiences(initialData);
    };
    load();
  }, []);

  // save on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(experiences));
  }, [experiences]);

  const addExperience = (exp: Experience) => {
    setExperiences((prev) => [exp, ...prev]);
  };

  const toggleMeaningful = (id: string) => {
    setExperiences((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, isMeaningful: !exp.isMeaningful } : exp,
      ),
    );
  };

  const filteredExperiences =
    filter === "All"
      ? experiences
      : experiences.filter(
          (exp) => exp.type === filter || exp.tags.includes(filter),
        );

  return (
    <ExperiencesContext.Provider
      value={{
        experiences: filteredExperiences,
        allExperiences: experiences,
        filter,
        setFilter,
        addExperience,
        toggleMeaningful,
      }}
    >
      {children}
    </ExperiencesContext.Provider>
  );
}

export const useExperiences = () => {
  return useContext(ExperiencesContext);
};
