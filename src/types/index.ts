export type SubjectId = 'physics' | 'mathematics' | 'chemistry' | 'biology';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Equation {
  name: string;
  formula: string;
  explanation: string;
}

export interface Experiment {
  id: string;
  title: string;
  subjectId: SubjectId;
  difficulty: DifficultyLevel;
  description: string;
  shortDescription: string;
  learningObjectives: string[];
  assumptions: string[];
  equations: Equation[];
  tags: string[];
  featured: boolean;
  status: 'active' | 'upcoming';
  estimatedMinutes: number;
}

export interface Laboratory {
  id: SubjectId;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  accentColor: string;
  badgeColor: string;
  gradient: string;
  activeCount: number;
  upcomingCount: number;
}

export interface UserProgress {
  bookmarkedIds: string[];
  completedExperimentIds: string[];
  recentExperimentIds: string[];
  lastVisitedExperimentId?: string;
  experimentNotes: Record<string, string>;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  source: 'gemini' | 'offline';
  suggestedActions?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
