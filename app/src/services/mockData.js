export const INITIAL_EVENTS = [
  {
    id: 'evt_cse_fest_2026',
    title: 'RUET CSE Fest 2026: National Hackathon',
    category: 'Academic',
    description: 'The flagship national programming hackathon and technology symposium hosted by the Department of Computer Science & Engineering at RUET.',
    date: '2026-11-15',
    time: '09:00 AM',
    venue: 'CSE Seminar Hall & Lab 3, RUET',
    capacity: 100,
    registeredCount: 84,
    organizer: 'Dept of CSE & RUET Computer Club',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    speaker: 'Dr. Md. Al-Mamun (Professor & Head, Dept of CSE)',
    prerequisites: 'RUET student ID required; Laptop with IDE installed',
    tags: ['Competitive Programming', 'Hackathon', 'AI', 'RUET'],
    createdAt: '2026-10-20T10:00:00.000Z'
  },
  {
    id: 'evt_ai_workshop',
    title: 'Hands-on Generative AI & LLM Systems Workshop',
    category: 'Workshop',
    description: 'Practical 2-day bootcamp covering Transformer architectures, fine-tuning open models, and building agentic AI workflows with Python and PyTorch.',
    date: '2026-11-20',
    time: '02:30 PM',
    venue: 'Software Engineering Lab, Academic Building 2',
    capacity: 45,
    registeredCount: 38,
    organizer: 'RUET Machine Learning Research Group',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    materialsRequired: ['Personal Laptop', 'Python 3.10+ installed', 'Hugging Face account'],
    certificateProvided: true,
    tags: ['Machine Learning', 'GenAI', 'Python', 'Hands-on'],
    createdAt: '2026-10-22T14:30:00.000Z'
  },
  {
    id: 'evt_football_cup',
    title: 'Inter-Department Football Tournament 2026',
    category: 'Sports',
    description: 'The grand annual soccer tournament featuring teams from CSE, EEE, ME, CE, and IPE competing for the prestigious Vice-Chancellor Trophy.',
    date: '2026-11-25',
    time: '03:45 PM',
    venue: 'RUET Central Playground',
    capacity: 250,
    registeredCount: 195,
    organizer: 'RUET Physical Education Center',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
    teamSize: 11,
    tournamentType: 'Double Elimination',
    tags: ['Sports', 'Football', 'Campus Spirit'],
    createdAt: '2026-10-24T08:00:00.000Z'
  },
  {
    id: 'evt_cultural_night',
    title: 'Aronno: Grand Cultural Eve & Music Fest',
    category: 'Cultural',
    description: 'An enchanting evening of acoustic performances, folk drama, and classical musical renditions celebrating the rich heritage of Bangladesh.',
    date: '2026-12-02',
    time: '06:00 PM',
    venue: 'RUET Central Auditorium',
    capacity: 350,
    registeredCount: 310,
    organizer: 'Anuranan - RUET Cultural Club',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    performers: ['Anuranan Musical Band', 'RUET Drama Society', 'Guest Acoustic Troupe'],
    dressCode: 'Bengali Traditional / Festive',
    tags: ['Music', 'Drama', 'Acoustic', 'Festival'],
    createdAt: '2026-10-25T12:00:00.000Z'
  },
  {
    id: 'evt_ieee_talk',
    title: 'IEEE Distinguished Lecture: Future of Renewable Smart Grids',
    category: 'Academic',
    description: 'Special symposium featuring IEEE fellow guest lecturers discussing decentralized micro-grids and modern power electronics automation.',
    date: '2026-12-10',
    time: '11:00 AM',
    venue: 'ECE Auditorium, RUET',
    capacity: 80,
    registeredCount: 42,
    organizer: 'IEEE RUET Student Branch',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    speaker: 'Prof. Dr. Shamim Rezwan (IEEE Senior Member)',
    prerequisites: 'Basic knowledge of Power Systems / Electronics',
    tags: ['IEEE', 'Smart Grid', 'Electrical', 'Seminar'],
    createdAt: '2026-10-26T16:00:00.000Z'
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann_1',
    title: 'CSE Fest Hackathon Venue Shift',
    message: 'Due to lab maintenance, the preliminary round will commence in Lab 3 at 9:00 AM sharp.',
    timestamp: '2 hours ago',
    category: 'Urgent'
  },
  {
    id: 'ann_2',
    title: 'AI Workshop Registration Quota',
    message: 'Only 7 lab seats remaining for the GenAI bootcamp. Registration closes tomorrow!',
    timestamp: '5 hours ago',
    category: 'Info'
  }
];
