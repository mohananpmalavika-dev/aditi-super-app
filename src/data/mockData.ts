import {
  ChatConversation,
  HabitItem,
  MatrimonyProfile,
  ProactiveAlert,
  RealEstateProperty,
  SocialPost,
  SocialStory,
  TaskItem,
  TutorProfile,
  UserProfile,
  WalletTransaction
} from '../types/superApp';

export const INITIAL_USER: UserProfile = {
  id: 'usr-main-01',
  name: 'Dhanya Sharma',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  handle: '@dhanya.tech',
  email: 'dhanya@omnilife.ai',
  zodiacSign: 'Leo',
  bio: 'Product Designer, Tech Enthusiast & Lifelong Learner 🚀',
  location: 'San Francisco, CA',
  isVerified: true
};

export const MOCK_PROPERTIES: RealEstateProperty[] = [
  {
    id: 'prop-1',
    title: 'Skyline Azure 3BHK Penthouse',
    type: 'Penthouse',
    listingType: 'Buy',
    price: 850000,
    priceFormatted: '$850,000',
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2200,
    location: '450 Marina Blvd, Marina District',
    city: 'San Francisco',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80'
    ],
    features: ['Panoramic Bay View', 'Infinity Pool Access', 'Private Elevator', 'Smart Home Automation', 'Valet Parking'],
    description: 'Breathtaking 3-bedroom penthouse with floor-to-ceiling glass windows offering unobstructed views of the bay and city skyline. Includes designer Italian marble kitchens and smart climate controls.',
    agent: {
      name: 'Victoria Vance',
      phone: '+1 (415) 890-3421',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      rating: 4.9
    },
    isFeatured: true
  },
  {
    id: 'prop-2',
    title: 'Modern Serenity Luxury Villa',
    type: 'Villa',
    listingType: 'Buy',
    price: 1450000,
    priceFormatted: '$1,450,000',
    bedrooms: 4,
    bathrooms: 4.5,
    areaSqFt: 3800,
    location: '128 Hillcrest Drive, Silicon Valley',
    city: 'Palo Alto',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80'
    ],
    features: ['Solar Powered', 'Private Swimming Pool', 'Wine Cellar', 'Landscaped Zen Garden', '3-Car Garage'],
    description: 'An architectural masterpiece in the heart of Palo Alto featuring seamless indoor-outdoor living, ultra-high ceilings, and eco-friendly solar infrastructure.',
    agent: {
      name: 'Marcus Sterling',
      phone: '+1 (650) 443-9821',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
      rating: 5.0
    },
    isFeatured: true
  },
  {
    id: 'prop-3',
    title: 'Urban Oasis Modern 2BHK Apartment',
    type: 'Apartment',
    listingType: 'Rent',
    price: 3200,
    priceFormatted: '$3,200/mo',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1150,
    location: '720 Mission St, SOMA',
    city: 'San Francisco',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80'
    ],
    features: ['Fully Furnished', 'Gym & Rooftop Lounge', 'Pet Friendly', 'In-Unit Washer/Dryer', 'EV Charging'],
    description: 'Contemporary 2-bedroom rental apartment in prime SOMA district walking distance to tech campuses, gourmet dining, and transit hubs.',
    agent: {
      name: 'Elena Rostova',
      phone: '+1 (415) 554-1122',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      rating: 4.8
    }
  },
  {
    id: 'prop-4',
    title: 'Minimalist Downtown Studio Loft',
    type: 'Studio',
    listingType: 'Rent',
    price: 1950,
    priceFormatted: '$1,950/mo',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 680,
    location: '310 Pine Street, Financial District',
    city: 'San Francisco',
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80'
    ],
    features: ['High Ceilings', 'Exposed Brick', 'Hardwood Floors', 'Fiber Internet Included', '24/7 Security'],
    description: 'Chic urban studio loft with character and historic charm. Perfect for working professionals seeking convenience and style.',
    agent: {
      name: 'Victoria Vance',
      phone: '+1 (415) 890-3421',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      rating: 4.9
    }
  }
];

export const MOCK_MATRIMONY_PROFILES: MatrimonyProfile[] = [
  {
    id: 'mat-1',
    name: 'Ananya Deshmukh',
    age: 27,
    gender: 'Female',
    height: "5' 6\"",
    profession: 'Senior AI Research Engineer',
    education: 'M.S. in Computer Science (Stanford)',
    city: 'San Francisco',
    state: 'California',
    religion: 'Hindu',
    community: 'Brahmin',
    motherTongue: 'Marathi',
    zodiac: 'Sagittarius',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80'
    ],
    about: 'Curious thinker who loves classical piano, high-altitude trekking, and building autonomous agent models. Looking for an ambitious, kind partner with a great sense of humor.',
    partnerPreferences: 'Tech/Healthcare professional, 27-32 yrs, progressive mindset, values family and intellectual curiosity.',
    annualIncome: '$190,000 - $220,000',
    isVerified: true,
    compatibilityScore: 96
  },
  {
    id: 'mat-2',
    name: 'Dr. Rohan Mehra',
    age: 29,
    gender: 'Male',
    height: "5' 11\"",
    profession: 'Cardiologist',
    education: 'M.D. (Johns Hopkins University)',
    city: 'New York',
    state: 'New York',
    religion: 'Hindu',
    community: 'Khatri',
    motherTongue: 'Hindi',
    zodiac: 'Aries',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80'
    ],
    about: 'Passionate physician who enjoys marathon running, reading history, and gourmet cooking on weekends. Believes in mutual respect and work-life harmony.',
    partnerPreferences: 'Educated professional, empathetic, enjoys traveling and cultural experiences.',
    annualIncome: '$250,000+',
    isVerified: true,
    compatibilityScore: 92
  },
  {
    id: 'mat-3',
    name: 'Pooja Sundaram',
    age: 26,
    gender: 'Female',
    height: "5' 4\"",
    profession: 'Architectural Designer',
    education: 'Master of Architecture (Cornell)',
    city: 'Seattle',
    state: 'Washington',
    religion: 'Hindu',
    community: 'Iyer',
    motherTongue: 'Tamil',
    zodiac: 'Libra',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80'
    ],
    about: 'Creative soul with an eye for sustainable architecture and pottery. Enjoys cozy coffee shops, jazz, and exploring modern art galleries.',
    partnerPreferences: 'Creative or tech professional, values open communication and shared life adventures.',
    annualIncome: '$130,000 - $160,000',
    isVerified: true,
    compatibilityScore: 89
  },
  {
    id: 'mat-4',
    name: 'Vikram Aditya Roy',
    age: 30,
    gender: 'Male',
    height: "6' 0\"",
    profession: 'Fintech Founder & Angel Investor',
    education: 'MBA (Harvard Business School)',
    city: 'Austin',
    state: 'Texas',
    religion: 'Hindu',
    community: 'Kayastha',
    motherTongue: 'Bengali',
    zodiac: 'Leo',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80'
    ],
    about: 'Entrepreneur enthusiastic about decentralization, astrophysics, and playing acoustic guitar. Looking for a partner to build a joyful, impactful life with.',
    partnerPreferences: 'Independent, passionate about her career, warm-hearted, and loves traveling.',
    annualIncome: '$300,000+',
    isVerified: true,
    compatibilityScore: 94
  }
];

export const MOCK_TUTORS: TutorProfile[] = [
  {
    id: 'tut-1',
    name: 'Sarah Chen, M.S.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    category: 'Coding & Tech',
    subjects: ['Python & PyTorch', 'Fullstack React & Next.js', 'Machine Learning', 'Data Structures'],
    hourlyRate: 45,
    rating: 4.98,
    reviewCount: 142,
    experienceYears: 6,
    education: 'M.S. in AI (UC Berkeley)',
    bio: 'Former Google Software Engineer passionate about breaking down complex neural networks and fullstack development into intuitive, practical hands-on projects.',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    timeSlots: ['10:00 AM', '02:00 PM', '04:30 PM', '07:00 PM'],
    verifiedBadge: true,
    studentsTaught: 380
  },
  {
    id: 'tut-2',
    name: 'Prof. Julian Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    category: 'Math & Science',
    subjects: ['Advanced Calculus', 'Linear Algebra', 'Quantum Physics', 'Statistics'],
    hourlyRate: 50,
    rating: 4.95,
    reviewCount: 98,
    experienceYears: 10,
    education: 'Ph.D. in Applied Mathematics (MIT)',
    bio: 'Renowned mathematics mentor who transforms intimidating equations into clear, visual intuition. Specializes in college prep, contest math, and university calculus.',
    availableDays: ['Tue', 'Thu', 'Sat', 'Sun'],
    timeSlots: ['11:00 AM', '03:00 PM', '05:00 PM', '08:00 PM'],
    verifiedBadge: true,
    studentsTaught: 510
  },
  {
    id: 'tut-3',
    name: 'Camille Laurent',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    category: 'Languages',
    subjects: ['French (A1-C2)', 'Conversational Spanish', 'Business French'],
    hourlyRate: 35,
    rating: 4.92,
    reviewCount: 76,
    experienceYears: 5,
    education: 'Sorbonne University (Paris)',
    bio: 'Native French and fluent Spanish speaker. Interactive immersion sessions focusing on natural conversation, pronunciation mastery, and cultural context.',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '01:00 PM', '04:00 PM', '06:30 PM'],
    verifiedBadge: true,
    studentsTaught: 240
  },
  {
    id: 'tut-4',
    name: 'Lucas Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    category: 'Music & Arts',
    subjects: ['Classical & Jazz Piano', 'Music Theory', 'Audio Production & Ableton'],
    hourlyRate: 40,
    rating: 4.89,
    reviewCount: 64,
    experienceYears: 7,
    education: 'Berklee College of Music',
    bio: 'Concert pianist and music producer. Tailored lessons for beginners to advanced players covering improvisation, ear training, and digital music composition.',
    availableDays: ['Wed', 'Fri', 'Sat', 'Sun'],
    timeSlots: ['10:30 AM', '02:30 PM', '06:00 PM'],
    verifiedBadge: true,
    studentsTaught: 180
  }
];

export const MOCK_STORIES: SocialStory[] = [
  {
    id: 'st-1',
    user: { name: 'Dhanya', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    hasUnseen: false
  },
  {
    id: 'st-2',
    user: { name: 'Victoria', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    hasUnseen: true
  },
  {
    id: 'st-3',
    user: { name: 'Sarah AI', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    hasUnseen: true
  },
  {
    id: 'st-4',
    user: { name: 'Julian M', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    hasUnseen: true
  }
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    author: {
      name: 'Sarah Chen, M.S.',
      handle: '@sarah.ai',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      isVerified: true
    },
    content: 'Just deployed our new multi-agent neural pipeline in Python! 🚀 The latency dropped by 45% using streaming token generators. Sharing the complete code breakdown in our upcoming tutoring masterclass!',
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesCount: 148,
    isLiked: false,
    commentsCount: 24,
    sharesCount: 18,
    timestamp: '2 hours ago',
    tags: ['#MachineLearning', '#Python', '#TechEducation'],
    comments: [
      {
        id: 'c-1',
        author: 'Dhanya Sharma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        content: 'This architecture is so clean! Excited for our session tomorrow.',
        timestamp: '1 hour ago'
      }
    ]
  },
  {
    id: 'post-2',
    author: {
      name: 'Victoria Vance Luxury Estates',
      handle: '@vance.estates',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      isVerified: true
    },
    content: 'Sunset views from the top floor of Skyline Azure Penthouse in San Francisco. 🌆 Floor-to-ceiling glass and panoramic views of the Golden Gate bridge. Virtual 3D tours now open in the Real Estate tab!',
    mediaUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesCount: 312,
    isLiked: true,
    commentsCount: 42,
    sharesCount: 56,
    timestamp: '4 hours ago',
    tags: ['#LuxuryRealEstate', '#SanFrancisco', '#SkylineViews'],
    comments: []
  }
];

export const MOCK_CHATS: ChatConversation[] = [
  {
    id: 'chat-brain',
    participantName: '🧠 Aditi Brain AI',
    participantAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    roleOrContext: 'Autonomous Central Core',
    lastMessage: 'I have summarized today\'s high-priority items and verified property alerts.',
    lastMessageTime: 'Just now',
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        senderId: 'brain',
        senderName: 'Aditi Brain AI',
        text: 'Hello Dhanya! I have organized your day. You have 3 tasks due today, a Python tutoring session at 4:30 PM, and 2 new 3BHK listings matching your wishlist.',
        timestamp: '10:00 AM',
        isUser: false
      }
    ]
  },
  {
    id: 'chat-agent-victoria',
    participantName: 'Victoria Vance',
    participantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    roleOrContext: 'Real Estate Listing Agent',
    lastMessage: 'The penthouse viewing is confirmed for Saturday at 2:00 PM!',
    lastMessageTime: '11:45 AM',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'mv1',
        senderId: 'victoria',
        senderName: 'Victoria Vance',
        text: 'Hi Dhanya, thank you for your interest in the Skyline Azure 3BHK Penthouse. Would you like to schedule a private in-person walkthrough or a live virtual tour?',
        timestamp: '11:30 AM',
        isUser: false
      },
      {
        id: 'mv2',
        senderId: 'user',
        senderName: 'Dhanya',
        text: 'Hi Victoria, Saturday at 2 PM works best for me!',
        timestamp: '11:40 AM',
        isUser: true
      },
      {
        id: 'mv3',
        senderId: 'victoria',
        senderName: 'Victoria Vance',
        text: 'The penthouse viewing is confirmed for Saturday at 2:00 PM! Looking forward to meeting you.',
        timestamp: '11:45 AM',
        isUser: false
      }
    ]
  },
  {
    id: 'chat-tutor-sarah',
    participantName: 'Sarah Chen, M.S.',
    participantAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    roleOrContext: 'Python & AI Mentor',
    lastMessage: 'I\'ve uploaded the starter notebook for PyTorch embeddings.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'ms1',
        senderId: 'sarah',
        senderName: 'Sarah Chen',
        text: 'Great work on the previous homework! I\'ve uploaded the starter notebook for PyTorch embeddings for our session.',
        timestamp: 'Yesterday 5:20 PM',
        isUser: false
      }
    ]
  }
];

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    type: 'debit',
    title: 'Python Tutoring Session (Sarah Chen)',
    category: 'Tutor',
    amount: 45.00,
    recipientOrSender: 'Sarah Chen, M.S.',
    timestamp: 'Today, 11:30 AM',
    status: 'Completed'
  },
  {
    id: 'tx-2',
    type: 'credit',
    title: 'Freelance Design Milestone',
    category: 'Services',
    amount: 850.00,
    recipientOrSender: 'Starlight Media Studios',
    timestamp: 'Yesterday, 04:15 PM',
    status: 'Completed'
  },
  {
    id: 'tx-3',
    type: 'debit',
    title: 'Whole Foods Market',
    category: 'Food',
    amount: 68.40,
    recipientOrSender: 'Whole Foods SOMA',
    timestamp: '25 Aug, 07:10 PM',
    status: 'Completed'
  },
  {
    id: 'tx-4',
    type: 'debit',
    title: 'Monthly High-Speed Fiber Internet',
    category: 'Bills',
    amount: 70.00,
    recipientOrSender: 'Sonic Gigabit Fiber',
    timestamp: '24 Aug, 09:00 AM',
    status: 'Completed'
  }
];

export const MOCK_TASKS: TaskItem[] = [
  {
    id: 'tsk-1',
    title: 'Review Python PyTorch Starter Notebook',
    description: 'Go over tensor shapes and multi-head attention layers before tutor session.',
    status: 'in_progress',
    priority: 'high',
    dueDate: 'Today, 4:00 PM',
    category: 'Study'
  },
  {
    id: 'tsk-2',
    title: 'Calculate Mortgage & EMI for Skyline Penthouse',
    description: 'Compare 30-year fixed vs 15-year fixed interest rates in Real Estate tool.',
    status: 'todo',
    priority: 'urgent',
    dueDate: 'Today, 6:00 PM',
    category: 'Personal'
  },
  {
    id: 'tsk-3',
    title: 'Review 3 Matrimony Match Profiles',
    description: 'Send icebreaker connect requests to shortlisted matches.',
    status: 'todo',
    priority: 'medium',
    dueDate: 'Tomorrow',
    category: 'Personal'
  },
  {
    id: 'tsk-4',
    title: 'Finish UI Mockups for Super App Release',
    description: 'Complete Figma responsive specs for mobile and desktop screens.',
    status: 'done',
    priority: 'high',
    dueDate: 'Yesterday',
    category: 'Work'
  }
];

export const MOCK_HABITS: HabitItem[] = [
  {
    id: 'hab-1',
    name: 'Hydration (2.5L Water)',
    category: 'Health',
    streak: 12,
    completedDays: [true, true, true, true, true, true, true],
    color: '#00f0ff'
  },
  {
    id: 'hab-2',
    name: 'Daily 30-min Coding / Study',
    category: 'Productivity',
    streak: 8,
    completedDays: [true, true, false, true, true, true, true],
    color: '#6366f1'
  },
  {
    id: 'hab-3',
    name: '10-min Mindfulness Meditation',
    category: 'Mindset',
    streak: 5,
    completedDays: [false, true, true, true, true, true, true],
    color: '#ec4899'
  }
];

export const MOCK_ALERTS: ProactiveAlert[] = [
  {
    id: 'alt-1',
    category: 'realestate',
    title: 'Price Drop Alert (-$25,000)',
    message: 'Skyline Azure 3BHK Penthouse in Marina District just adjusted listing price.',
    actionMiniApp: 'realestate',
    timestamp: '15m ago',
    priority: 'important'
  },
  {
    id: 'alt-2',
    category: 'astrology',
    title: 'Favorable Planetary Transit Today',
    message: 'Sun and Jupiter alignment in Leo fosters high creative clarity and wealth expansion.',
    actionMiniApp: 'astrology',
    timestamp: '1h ago',
    priority: 'info'
  },
  {
    id: 'alt-3',
    category: 'matrimony',
    title: 'New High-Compatibility Match (96%)',
    message: 'Ananya Deshmukh (AI Researcher at Stanford) matched your partner preferences.',
    actionMiniApp: 'matrimony',
    timestamp: '2h ago',
    priority: 'important'
  },
  {
    id: 'alt-4',
    category: 'tutor',
    title: 'Upcoming Session in 4 Hours',
    message: '1-on-1 PyTorch and Fullstack session with Sarah Chen at 4:30 PM.',
    actionMiniApp: 'tutor',
    timestamp: '3h ago',
    priority: 'info'
  }
];
