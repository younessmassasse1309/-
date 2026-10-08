export interface Question {
  id: string;
  category: string; // 'conditions' | 'incompatibility' | 'duties' | 'missions' | 'evictions_sales' | 'clerks_partnership' | 'discipline' | 'national_council' | 'civil_procedure' | 'previous_exams' | 'public_debt';
  categoryTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  legalReference: string; // e.g. "المادة 34 من القانون 15.97"
  lawTextExcerpt?: string; // Direct text from official law
  difficulty: 'easy' | 'medium' | 'hard';
  examYear?: string; // e.g. "2015", "2017", "مباراة 2026 متوقعة"
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  lawSource: string;
  questionCount?: number;
}

export interface GoldenNumber {
  id: string;
  number: string;
  unit: string;
  label: string;
  explanation: string;
  articleRef: string;
  lawName: string;
  importance: 'critical' | 'high';
  category: string;
}

export interface MindMapSection {
  id: number;
  number: string;
  title: string;
  icon: string;
  color: string;
  articles: string;
  summary: string;
  keyPoints: string[];
  vitalRule?: string;
}

export interface ExamAttempt {
  id: string;
  date: string;
  score: number; // Raw score
  scoreOutOf20: number; // Scaled note out of 20
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  percentage: number;
  timeSpentSeconds: number;
  passed: boolean;
  categoryScores: Record<string, { correct: number; total: number; title: string }>;
}

export interface WeakTopic {
  categoryId: string;
  categoryTitle: string;
  errorRate: number; // 0 to 100
  totalAttempted: number;
  wrongCount: number;
  correctCount: number;
  recommendation: string;
}

