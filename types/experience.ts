export type ExperienceType = 'Clinical' | 'Shadowing' | 'Research';

export type SkillTag =
  | 'Health Equity'
  | 'Leadership'
  | 'Soft Skills'
  | 'Technical Skills'
  | 'Communication'
  | 'Teamwork'
  | 'Cultural Competency'
  | 'Patient Care';

export interface Experience {
  id: string;
  title: string;
  type: ExperienceType;
  date: string; // ISO format e.g. "2025-03-02"
  hours: number;
  location: string;
  supervisor: string;
  whatHappened: string;
  whyItMattered: string;
  skills: SkillTag[];
  isMeaningful: boolean;
  createdAt: string;
}

export interface CustomPrompt {
  id: string;
  text: string;
  createdAt: string;
}

export interface SavedDraft {
  id: string;
  prompt: string;
  experienceIds: string[];
  outline: string;
  createdAt: string;
}
