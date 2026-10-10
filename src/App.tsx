import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { QuizView } from './components/QuizView';
import { MindMapView } from './components/MindMapView';
import { ExamSimulatorView } from './components/ExamSimulatorView';
import { GoldenNumbersView } from './components/GoldenNumbersView';
import { PreviousExamsView } from './components/PreviousExamsView';
import { PdfExportView } from './components/PdfExportView';
import { questionsBank } from './data/legalQuestions';
import { Scale, Heart, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedQuizCategory, setSelectedQuizCategory] = useState<string>('all');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mofawid_theme') === 'dark';
    } catch {
      return false;
    }
  });

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mofawid_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mofawid_theme', 'light');
    }
  }, [isDarkMode]);

  const handleStartCategoryQuiz = (categoryId: string) => {
    setSelectedQuizCategory(categoryId);
    setActiveTab('quiz');
  };

  const [completedCount, setCompletedCount] = useState<number>(0);

  useEffect(() => {
    try {
      const stats = JSON.parse(localStorage.getItem('mofawid_question_stats') || '{}');
      setCompletedCount(Object.keys(stats).length);
    } catch {
      setCompletedCount(0);
    }
  }, [activeTab]);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200`}>
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        completedQuestionsCount={completedCount}
        totalQuestionsCount={questionsBank.length}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={setActiveTab}
            onStartCategoryPractice={handleStartCategoryQuiz}
            questionsCount={questionsBank.length}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView initialCategory={selectedQuizCategory} />
        )}

        {activeTab === 'mindmap' && (
          <MindMapView onStartQuizCategory={handleStartCategoryQuiz} />
        )}

        {activeTab === 'simulator' && (
          <ExamSimulatorView onBackToDashboard={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'numbers' && (
          <GoldenNumbersView />
        )}

        {activeTab === 'previous' && (
          <PreviousExamsView onStartPracticeTopic={handleStartCategoryQuiz} />
        )}

        {activeTab === 'pdf' && (
          <PdfExportView onBack={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              دليل المفوض Pro
            </span>
            <span>— المرجع الشامل لمباراة المفوضين القضائيين بالمغرب</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>وفق القانون رقم 46.21 والمرسوم 2.25.885 وق.م.م 58.25</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-400">جميع الآجال كاملة وفق المادة 169</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
