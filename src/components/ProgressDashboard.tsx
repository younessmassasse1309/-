import React, { useMemo } from 'react';
import { questionsBank, categories } from '../data/legalQuestions';
import { ExamAttempt, WeakTopic } from '../types';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Clock, 
  BookOpen, 
  ArrowLeft, 
  RotateCcw,
  Sparkles,
  Flame,
  Target
} from 'lucide-react';

interface ProgressDashboardProps {
  onStartCategoryPractice: (categoryId: string) => void;
  onStartExam: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  onStartCategoryPractice,
  onStartExam
}) => {
  // Load saved exam attempts from localStorage
  const examAttempts: ExamAttempt[] = useMemo(() => {
    try {
      const saved = localStorage.getItem('mofawid_exam_attempts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Load practiced question IDs and their correctness from localStorage
  const questionStats = useMemo(() => {
    try {
      const saved = localStorage.getItem('mofawid_question_stats');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, []);

  // 1. Overall Question Solving Progress
  const totalQuestionsInBank = questionsBank.length;
  const answeredQuestionIds = Object.keys(questionStats);
  const totalAnsweredCount = answeredQuestionIds.length;
  const overallProgressPercent = totalQuestionsInBank > 0
    ? Math.round((totalAnsweredCount / totalQuestionsInBank) * 100)
    : 0;

  // 2. Exam Completion & Performance Metrics
  const totalExamsCount = examAttempts.length;
  const passedExamsCount = examAttempts.filter(a => a.passed || a.scoreOutOf20 >= 10).length;
  const examPassRate = totalExamsCount > 0 
    ? Math.round((passedExamsCount / totalExamsCount) * 100) 
    : 0;
  
  const averageExamScore = totalExamsCount > 0
    ? Number((examAttempts.reduce((acc, curr) => acc + curr.scoreOutOf20, 0) / totalExamsCount).toFixed(2))
    : 0;

  const latestAttempt = examAttempts[examAttempts.length - 1];

  // 3. Weak Topics Calculation
  const weakTopics: WeakTopic[] = useMemo(() => {
    const categoryAggregates: Record<string, { total: number; wrong: number; correct: number; title: string }> = {};

    // Initialize categories (excluding 'all')
    categories.filter(c => c.id !== 'all').forEach(c => {
      categoryAggregates[c.id] = { total: 0, wrong: 0, correct: 0, title: c.title };
    });

    // Feed from individual question practice
    Object.entries(questionStats).forEach(([qId, stat]: [string, any]) => {
      const q = questionsBank.find(item => item.id === qId);
      if (q && categoryAggregates[q.category]) {
        categoryAggregates[q.category].total += 1;
        if (stat.isCorrect) {
          categoryAggregates[q.category].correct += 1;
        } else {
          categoryAggregates[q.category].wrong += 1;
        }
      }
    });

    // Also feed from exam attempts history
    examAttempts.forEach(attempt => {
      if (attempt.categoryScores) {
        Object.entries(attempt.categoryScores).forEach(([catId, scoreObj]) => {
          if (categoryAggregates[catId]) {
            categoryAggregates[catId].total += scoreObj.total;
            categoryAggregates[catId].correct += scoreObj.correct;
            categoryAggregates[catId].wrong += (scoreObj.total - scoreObj.correct);
          }
        });
      }
    });

    // Build Weak Topics list for categories that have at least 1 wrong answer or attempted questions
    const list: WeakTopic[] = [];
    Object.entries(categoryAggregates).forEach(([catId, data]) => {
      if (data.total > 0) {
        const errorRate = Math.round((data.wrong / data.total) * 100);
        let recommendation = 'أداء جيد، واصل تثبيت المكتسبات';
        if (errorRate >= 50) {
          recommendation = 'يحتاج إلى تركيز عاجل ومراجعة نصوص المواد';
        } else if (errorRate >= 25) {
          recommendation = 'مستوى متوسط، يفضل حل المزيد من الأسئلة';
        }

        list.push({
          categoryId: catId,
          categoryTitle: data.title,
          errorRate,
          totalAttempted: data.total,
          wrongCount: data.wrong,
          correctCount: data.correct,
          recommendation
        });
      }
    });

    // Sort descending by error rate
    return list.sort((a, b) => b.errorRate - a.errorRate);
  }, [questionStats, examAttempts]);

  // Handler to clear history
  const handleResetHistory = () => {
    if (confirm('هل ترغب في إعادة ضبط سجل الاختبارات والإحصائيات والبدء من جديد؟')) {
      localStorage.removeItem('mofawid_exam_attempts');
      localStorage.removeItem('mofawid_question_stats');
      window.location.reload();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      
      {/* Header bar of Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full mb-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>لوحة تقدم المترشح والجاهزية الفردية (ProgressDashboard)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            مؤشرات الإنجاز وتشخيص مواطن الضعف
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {totalExamsCount > 0 && (
            <button
              onClick={handleResetHistory}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              title="إعادة ضبط السجل"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط السجل</span>
            </button>
          )}

          <button
            onClick={onStartExam}
            className="px-4 py-2 bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>اختبار جديد</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Questions Solved */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>نسبة حل بنك الأسئلة</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {overallProgressPercent}%
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{totalAnsweredCount} من أصل {totalQuestionsInBank} سؤالاً</span>
            <span className="font-bold text-amber-600 tabular-nums">+{totalAnsweredCount} منجز</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-500" 
              style={{ width: `${overallProgressPercent}%` }} 
            />
          </div>
        </div>

        {/* Metric 2: Exam Completion Rate */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>عدد الاختبارات المجتازة</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {totalExamsCount} <span className="text-xs font-semibold text-slate-400">امتحان</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>نسبة النجاح (10+/20)</span>
            <span className="font-bold text-emerald-600 tabular-nums">{examPassRate}%</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${examPassRate}%` }} 
            />
          </div>
        </div>

        {/* Metric 3: Average Exam Note */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>متوسط النقطة (من 20)</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {averageExamScore} <span className="text-xs font-normal text-slate-400">/ 20</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>العتبة الرسمية: 10/20</span>
            <span className={`font-bold ${averageExamScore >= 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {averageExamScore >= 10 ? 'مؤهل' : 'بحاجة لتعزيز'}
            </span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${averageExamScore >= 10 ? 'bg-purple-500' : 'bg-amber-500'}`} 
              style={{ width: `${Math.min(100, (averageExamScore / 20) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Metric 4: Latest Attempt */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>آخر نتيجة مسجلة</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {latestAttempt ? (
              <>
                {latestAttempt.scoreOutOf20} <span className="text-xs font-normal text-slate-400">/ 20</span>
              </>
            ) : (
              <span className="text-sm font-bold text-slate-400">لا يوجد بعد</span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{latestAttempt ? latestAttempt.date : 'ابدأ أول امتحان'}</span>
            {latestAttempt && (
              <span className={`font-bold text-[10px] px-1.5 py-0.2 rounded-md ${
                latestAttempt.scoreOutOf20 >= 10 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {latestAttempt.scoreOutOf20 >= 10 ? 'مستوفٍ' : 'غير مستوفٍ'}
              </span>
            )}
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-500 rounded-full transition-all duration-500" 
              style={{ width: `${latestAttempt ? Math.min(100, (latestAttempt.scoreOutOf20 / 20) * 100) : 0}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Weak Topics Analysis Section (تشخيص مواطن الضعف) */}
      <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                تشخيص مواضيع الضعف بناءً على تاريخ الاختبارات والحلول السابقة
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                يقوم النظام تلقائياً بتحليل إجاباتك ورصد المحاور التي ترتفع فيها نسبة الخطأ لتصويبها:
              </p>
            </div>
          </div>
        </div>

        {weakTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {weakTopics.map((item) => {
              const isHighPriority = item.errorRate >= 40;
              return (
                <div
                  key={item.categoryId}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.categoryTitle}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full tabular-nums ${
                        isHighPriority
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}>
                        نسبة الخطأ: {item.errorRate}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.recommendation} ({item.wrongCount} أخطاء من {item.totalAttempted} محاولة)
                    </p>

                    {/* Progress bar of errors vs correct */}
                    <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${100 - item.errorRate}%` }} 
                        title={`صحيح: ${100 - item.errorRate}%`}
                      />
                      <div 
                        className="h-full bg-rose-500" 
                        style={{ width: `${item.errorRate}%` }} 
                        title={`خطأ: ${item.errorRate}%`}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onStartCategoryPractice(item.categoryId)}
                    className="w-full mt-2 py-1.5 px-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>تمرن على هذا المحور الآن</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            لم تسجل أية أخطاء بعد. قم بحل أسئلة في بنك الـ QCM أو خوض اختبار تجريبي لبدء تشخيص نقاط الضعف وتحديد الأولويات بدقة!
          </div>
        )}
      </div>

      {/* Past Exam History Snippet */}
      {examAttempts.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            سجل آخر المحاولات الامتحانية المجتازة:
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {examAttempts.slice(-4).reverse().map((attempt) => (
              <div 
                key={attempt.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                    attempt.scoreOutOf20 >= 10
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {attempt.scoreOutOf20 >= 10 ? 'ناجح' : 'راسب'}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      امتحان تجريبي: {attempt.scoreOutOf20} / 20
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {attempt.date} • صحيحة: {attempt.correctCount} • خاطئة: {attempt.wrongCount}
                    </span>
                  </div>
                </div>

                <div className="text-left font-mono tabular-nums text-slate-500">
                  {Math.floor(attempt.timeSpentSeconds / 60)} دقيقة
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
