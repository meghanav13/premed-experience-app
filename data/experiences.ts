import { Experience } from "@/types/experience";

export const experiences: Experience[] = [
  {
    id: "1",
    title: "Free Clinic Shift",
    type: "Clinical",
    date: "2025-03-02",
    hours: 4,
    location: "Free Clinic",
    supervisor: "Dr. Wilson",
    tags: ["Clinical", "Health Equity"],
    description:
      "Assisted intake for 12 patients at the free clinic. Helped a Spanish-speaking family navigate their visit and realized how much language access matters in care.",
    impact:
      "Seeing firsthand how socioeconomic barriers shape health outcomes made me more certain about pursuing primary care in underserved communities.",
    isMeaningful: true,
  },
  {
    id: "2",
    title: "Dr. Patel Shadowing",
    type: "Shadowing",
    date: "2025-03-01",
    hours: 6,
    location: "University Hospital",
    supervisor: "Dr. Patel",
    tags: ["Shadowing"],
    description:
      "Observed patient consultations and learned how physicians communicate complex diagnoses in simple terms.",
    impact:
      "Reinforced the importance of clear communication in building patient trust.",
    isMeaningful: false,
  },
  {
    id: "3",
    title: "Lab Research Session",
    type: "Research",
    date: "2025-02-26",
    hours: 4,
    location: "Bio Research Lab",
    supervisor: "Dr. Kim",
    tags: ["Research"],
    description:
      "Conducted experiments on Drosophila melanogaster and assisted with data collection.",
    impact:
      "Developed attention to detail and appreciation for experimental design.",
    isMeaningful: true,
  },
  {
    id: "4",
    title: "Health Fair Volunteer",
    type: "Clinical",
    date: "2025-02-24",
    hours: 3,
    location: "Community Center",
    supervisor: "N/A",
    tags: ["Clinical", "Leadership"],
    description:
      "Helped organize a community health fair and guided attendees through screenings.",
    impact: "Strengthened leadership and community engagement skills.",
    isMeaningful: false,
  },
  {
    id: "5",
    title: "Dr. Dhingra Shadowing",
    type: "Shadowing",
    date: "2025-02-02",
    hours: 6,
    location: "University Hospital",
    supervisor: "Dr. Dhingra",
    tags: ["Shadowing"],
    description:
      "Shadowed patient rounds and observed diagnostic decision-making.",
    impact: "Gained insight into clinical reasoning and patient care workflow.",
    isMeaningful: false,
  },
];
