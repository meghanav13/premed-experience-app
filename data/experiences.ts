import { Experience } from '@/types/experience';

export const experiences: Experience[] = [
  {
    id: '1',
    title: 'Free Clinic Shift',
    type: 'Clinical',
    date: '2025-03-02',
    hours: 4,
    location: 'Free Clinic',
    supervisor: 'Dr. Wilson',
    whatHappened:
      'Assisted intake for 12 patients at the free clinic. Helped a Spanish-speaking family navigate their visit and realized how much language access matters in care.',
    whyItMattered:
      'Seeing firsthand how socioeconomic barriers shape health outcomes made me more certain about pursuing primary care in underserved communities.',
    skills: ['Health Equity', 'Cultural Competency', 'Patient Care'],
    isMeaningful: true,
    createdAt: '2025-03-02T09:00:00.000Z',
  },
  {
    id: '2',
    title: 'Dr. Patel Shadowing',
    type: 'Shadowing',
    date: '2025-03-01',
    hours: 6,
    location: 'University Hospital',
    supervisor: 'Dr. Patel',
    whatHappened:
      'Observed patient consultations and learned how physicians communicate complex diagnoses in simple terms.',
    whyItMattered:
      'Reinforced the importance of clear communication in building patient trust.',
    skills: ['Communication', 'Patient Care'],
    isMeaningful: false,
    createdAt: '2025-03-01T08:00:00.000Z',
  },
  {
    id: '3',
    title: 'Lab Research Session',
    type: 'Research',
    date: '2025-02-26',
    hours: 4,
    location: 'Bio Research Lab',
    supervisor: 'Dr. Kim',
    whatHappened:
      'Conducted experiments on Drosophila melanogaster and assisted with data collection for a genetics study on aging markers.',
    whyItMattered:
      'Developed attention to detail and a genuine appreciation for experimental design and the patience required in bench research.',
    skills: ['Technical Skills'],
    isMeaningful: true,
    createdAt: '2025-02-26T10:00:00.000Z',
  },
  {
    id: '4',
    title: 'Health Fair Volunteer',
    type: 'Clinical',
    date: '2025-02-24',
    hours: 3,
    location: 'Community Center',
    supervisor: '',
    whatHappened:
      'Helped organize a community health fair and guided attendees through blood pressure, glucose, and BMI screenings.',
    whyItMattered:
      'Strengthened my leadership and community engagement skills while making preventive care accessible to underserved residents.',
    skills: ['Leadership', 'Teamwork'],
    isMeaningful: false,
    createdAt: '2025-02-24T09:00:00.000Z',
  },
  {
    id: '5',
    title: 'Dr. Dhingra Shadowing',
    type: 'Shadowing',
    date: '2025-02-02',
    hours: 6,
    location: 'University Hospital',
    supervisor: 'Dr. Dhingra',
    whatHappened:
      'Shadowed morning patient rounds and observed diagnostic decision-making across cardiology and internal medicine cases.',
    whyItMattered:
      'Gained insight into clinical reasoning, differential diagnosis, and the workflow of a teaching hospital.',
    skills: ['Communication'],
    isMeaningful: false,
    createdAt: '2025-02-02T07:30:00.000Z',
  },
  {
    id: '6',
    title: 'Drosophila Research Symposium',
    type: 'Research',
    date: '2025-01-15',
    hours: 8,
    location: 'University Research Symposium',
    supervisor: 'Dr. Kim',
    whatHappened:
      'Presented our Drosophila melanogaster aging-marker findings to faculty and peers. Fielded questions on methodology and statistical interpretation.',
    whyItMattered:
      'Presenting research publicly pushed me to deeply understand every layer of our methodology. It also showed me how science communication bridges the bench and the bedside.',
    skills: ['Soft Skills', 'Technical Skills', 'Communication'],
    isMeaningful: true,
    createdAt: '2025-01-15T09:00:00.000Z',
  },
  {
    id: '7',
    title: 'Pediatric Ward Volunteering',
    type: 'Clinical',
    date: '2024-12-14',
    hours: 5,
    location: "Children's Medical Center",
    supervisor: 'Nurse Coordinator Reyes',
    whatHappened:
      'Spent the afternoon delivering books, games, and comfort items to pediatric oncology patients and their families. Sat with two families who had no other support present.',
    whyItMattered:
      "I learned that medicine is not always about curing \u2014 sometimes the most meaningful act is simply bearing witness to someone's suffering with compassion and full presence.",
    skills: ['Patient Care', 'Soft Skills', 'Communication'],
    isMeaningful: true,
    createdAt: '2024-12-14T13:00:00.000Z',
  },
  {
    id: '8',
    title: 'Community Health Research Survey',
    type: 'Research',
    date: '2024-12-06',
    hours: 6,
    location: 'Public Health Department',
    supervisor: 'Dr. Nguyen',
    whatHappened:
      'Conducted structured interviews and surveys with 30 residents about food access and chronic disease management in a low-income neighborhood.',
    whyItMattered:
      'Bridged my research skills with public health realities. The data we collected directly informed a grant application for a mobile health clinic.',
    skills: ['Health Equity', 'Technical Skills', 'Cultural Competency'],
    isMeaningful: true,
    createdAt: '2024-12-06T10:00:00.000Z',
  },
  {
    id: '9',
    title: 'ER Observation Shift',
    type: 'Shadowing',
    date: '2024-12-01',
    hours: 8,
    location: 'City General Hospital ED',
    supervisor: 'Dr. Flores',
    whatHappened:
      'Observed a full ER shift including trauma activations, triage, and discharge planning. Witnessed the team manage a multi-car accident with five simultaneous patients.',
    whyItMattered:
      'Saw how composure under pressure is a teachable skill, not just an innate trait. The teamwork displayed was the most seamless collaboration I have ever witnessed.',
    skills: ['Teamwork', 'Patient Care'],
    isMeaningful: false,
    createdAt: '2024-12-01T07:00:00.000Z',
  },
];
