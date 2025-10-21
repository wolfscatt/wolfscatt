export type ProjectCategory = 'mobile' | 'games' | 'desktop' | 'web' | 'ai';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  fullDescription: string;
  icon: string;
  coverImage?: string;
  images?: string[];
  tags: string[];
  downloadUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  version?: string;
}

export const projects: Project[] = [
  // Mobile Apps
  {
    id: 'finance-tracker',
    title: 'Finance Tracker',
    category: 'mobile',
    description: 'Cross-platform mobile app for personal finance management',
    fullDescription: 'A comprehensive personal finance management application built with Flutter. Features include expense tracking, budget planning, investment monitoring, and financial analytics with beautiful charts and insights.',
    icon: '💰',
    tags: ['Flutter', 'Dart', 'Firebase', 'Material Design'],
    downloadUrl: '#',
    githubUrl: 'https://github.com/wolfscatt',
    version: 'v2.1.0',
  },
  {
    id: 'health-monitor',
    title: 'Health Monitor',
    category: 'mobile',
    description: 'Track your health metrics and fitness goals',
    fullDescription: 'A health and fitness tracking application with real-time data synchronization, workout planning, nutrition tracking, and integration with wearable devices.',
    icon: '❤️',
    tags: ['Flutter', 'HealthKit', 'Firebase'],
    downloadUrl: '#',
    version: 'v1.5.2',
  },
  {
    id: 'task-master',
    title: 'Task Master',
    category: 'mobile',
    description: 'Advanced task management with AI prioritization',
    fullDescription: 'Smart task management app that uses machine learning to help prioritize your tasks, set realistic deadlines, and optimize your productivity.',
    icon: '✓',
    tags: ['Flutter', 'ML Kit', 'SQLite'],
    downloadUrl: '#',
    version: 'v1.2.0',
  },

  // Games
  {
    id: 'space-odyssey',
    title: 'Space Odyssey',
    category: 'games',
    description: '2D space exploration game with procedural generation',
    fullDescription: 'An immersive 2D space exploration game featuring procedurally generated galaxies, resource management, and engaging combat mechanics built with Unity.',
    icon: '🚀',
    tags: ['Unity', 'C#', '2D', 'Procedural'],
    downloadUrl: '#',
    githubUrl: 'https://github.com/wolfscatt',
    version: 'v0.9.0',
  },
  {
    id: 'puzzle-realm',
    title: 'Puzzle Realm',
    category: 'games',
    description: 'Mind-bending puzzle game with 100+ levels',
    fullDescription: 'A challenging puzzle game that combines logic, strategy, and creativity. Features over 100 handcrafted levels with increasing difficulty.',
    icon: '🧩',
    tags: ['Unity', 'C#', 'Puzzle', 'Mobile'],
    downloadUrl: '#',
    version: 'v1.0.0',
  },
  {
    id: 'rpg-adventure',
    title: 'RPG Adventure',
    category: 'games',
    description: 'Classic RPG with modern mechanics',
    fullDescription: 'A role-playing game featuring turn-based combat, character progression, and an engaging storyline set in a fantasy world.',
    icon: '⚔️',
    tags: ['Unity', 'C#', 'RPG', '3D'],
    downloadUrl: '#',
    version: 'v0.7.5',
  },

  // Desktop Apps
  {
    id: 'code-analyzer',
    title: 'Code Analyzer',
    category: 'desktop',
    description: 'Static code analysis tool with pattern detection',
    fullDescription: 'A powerful desktop application for analyzing code quality, detecting design patterns, identifying anti-patterns, and suggesting architectural improvements.',
    icon: '📊',
    tags: ['Electron', 'TypeScript', 'AST', 'Analysis'],
    downloadUrl: '#',
    githubUrl: 'https://github.com/wolfscatt',
    version: 'v3.2.1',
  },
  {
    id: 'media-manager',
    title: 'Media Manager',
    category: 'desktop',
    description: 'Organize and manage your media library',
    fullDescription: 'A comprehensive media management solution for organizing photos, videos, and music with AI-powered tagging and smart collections.',
    icon: '🎬',
    tags: ['Electron', 'React', 'FFmpeg'],
    downloadUrl: '#',
    version: 'v2.0.3',
  },

  // Web Apps
  {
    id: 'portfolio-builder',
    title: 'Portfolio Builder',
    category: 'web',
    description: 'Create stunning portfolios in minutes',
    fullDescription: 'A web-based portfolio builder with drag-and-drop interface, customizable templates, and one-click deployment.',
    icon: '🎨',
    tags: ['React', 'TypeScript', 'Tailwind', 'Vite'],
    demoUrl: '#',
    githubUrl: 'https://github.com/wolfscatt',
  },
  {
    id: 'real-time-collab',
    title: 'Real-Time Collaboration',
    category: 'web',
    description: 'Collaborative workspace with live editing',
    fullDescription: 'A real-time collaborative platform for teams to work together on documents, whiteboards, and projects with WebSocket-based synchronization.',
    icon: '👥',
    tags: ['React', 'WebSocket', 'Node.js', 'MongoDB'],
    demoUrl: '#',
    githubUrl: 'https://github.com/wolfscatt',
  },

  // AI & ML
  {
    id: 'sentiment-analyzer',
    title: 'Sentiment Analyzer',
    category: 'ai',
    description: 'NLP-based sentiment analysis system',
    fullDescription: 'A machine learning system for analyzing sentiment in text data using transformer models. Supports multiple languages and provides detailed emotional analysis.',
    icon: '🤖',
    tags: ['Python', 'TensorFlow', 'NLP', 'BERT'],
    githubUrl: 'https://github.com/wolfscatt',
  },
  {
    id: 'image-classifier',
    title: 'Image Classifier',
    category: 'ai',
    description: 'Deep learning image classification model',
    fullDescription: 'A convolutional neural network for image classification trained on custom datasets with transfer learning and data augmentation techniques.',
    icon: '🖼️',
    tags: ['Python', 'PyTorch', 'CNN', 'Computer Vision'],
    githubUrl: 'https://github.com/wolfscatt',
  },
  {
    id: 'predictive-analytics',
    title: 'Predictive Analytics',
    category: 'ai',
    description: 'Time series forecasting with ML',
    fullDescription: 'A machine learning pipeline for time series forecasting using LSTM networks and statistical models for business intelligence and data-driven decision making.',
    icon: '📈',
    tags: ['Python', 'TensorFlow', 'LSTM', 'FastAPI'],
    githubUrl: 'https://github.com/wolfscatt',
  },
];

export const getCategoryName = (category: ProjectCategory): string => {
  const names = {
    mobile: 'Mobile Apps',
    games: 'Games',
    desktop: 'Desktop Apps',
    web: 'Web Apps',
    ai: 'AI & Machine Learning',
  };
  return names[category];
};

export const getProjectsByCategory = (category: ProjectCategory) => {
  return projects.filter(p => p.category === category);
};

export const getProjectById = (id: string) => {
  return projects.find(p => p.id === id);
};
