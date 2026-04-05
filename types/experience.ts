export type ExperienceType =
  | "Clinical"
  | "Shadowing"
  | "Research"
  | "Health Equity"
  | "Leadership"
  | "Soft Skills";

export interface Experience {
  id: string;

  // basic info
  title: string;
  type: ExperienceType;
  date: string; // ISO string (e.g. "2025-03-02")
  hours: number;

  // details
  location: string;
  supervisor: string;

  // tags (for chips)
  tags: ExperienceType[];

  // reflection (for essay builder)
  description?: string; // what happened
  impact?: string; // why it mattered

  // features
  isMeaningful?: boolean;
}
