import React, { useState, useEffect } from 'react';
import { questionsBank } from '../data/legalQuestions';
import { Question, ExamAttempt } from '../types';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  Flag, 
  Check, 
  X,
  Play,
  Pause,
  BarChart3,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface ExamSimulatorViewProps {
  onBackToDashboard?: () => void;
}

export const ExamSimulatorView: React.FC<ExamSimulatorViewProps> = ({ onBackToDashboard }) => {
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examCompleted, setExamCompleted] = useState<boolean>(false);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(3600); // 60 mins
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [penaltyEnabled, setPenaltyEnabled] = useState<boolean>(true); // -0.25 for wrong

  // Start exam
  const handleStartExam = (totalQ = 35) => {
    // Shuffle and pick questions across categories
    const shuffled = [...questionsBank].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(totalQ, shuffled.length));
    setExamQuestions(selected);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions([]);
    setTimeLeftSeconds(60 * 60); // 60 minutes
    setExamStarted(true);
    setExamCompleted(false);
    setIsPaused(false);
  };

  // Timer effect
  useEffect(() => {
    if (!examStarted || examCompleted || isPaused) return;

    if (timeLeftSeconds <= 0) {
      handleFinishExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examCompleted, isPaused, timeLeftSeconds]);

  const toggleFlag = (id: string) => {
    setFlaggedQuestions(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSelectOption = (idx: number) => {
    if (!currentQuestion || examCompleted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: idx
    }));
  };

  const handleFinishExam = () => {
    setExamCompleted(true);
    
    // Calculate score
    const totalQ = examQuestions.length;
    let rawScore = 0;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    const catScores: Record<string, { correct: number; total: number; title: string }> = {};

    examQuestions.forEach(q => {
      if (!catScores[q.category]) {
        catScores[q.category] = { correct: 0, total: 0, title: q.categoryTitle };
      }
      catScores[q.category].total += 1;

      const userAns = selectedAnswers[q.id];
      if (userAns !== undefined) {
        if (userAns === q.correctIndex) {
          rawScore += 1;
          correct += 1;
          catScores[q.category].correct += 1;
        } else {
          if (penaltyEnabled) {
            rawScore -= 0.25;
          }
          wrong += 1;
        }
      } else {
        unanswered += 1;
      }
    });

    const finalScore = Math.max(0, rawScore);
    const scoreOutOf20 = Number(((finalScore / totalQ) * 20).toFixed(2));
    const passed = scoreOutOf20 >= 10;

    // Save attempt to localStorage for ProgressDashboard
    try {
      const newAttempt: ExamAttempt = {
        id: `attempt-${Date.now()}`,
        date: new Date().toLocaleDateString('ar-MA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        score: finalScore,
        scoreOutOf20,
        totalQuestions: totalQ,
        correctCount: correct,
        wrongCount: wrong,
        unansweredCount: unanswered,
        percentage: Math.round((correct / totalQ) * 100),
        timeSpentSeconds: 3600 - timeLeftSeconds,
        passed,
        categoryScores: catScores
      };

      const existingAttempts = JSON.parse(localStorage.getItem('mofawid_exam_attempts') || '[]');
      existingAttempts.push(newAttempt);
      localStorage.setItem('mofawid_exam_attempts', JSON.stringify(existingAttempts));

      // Also update question stats
      const existingQStats = JSON.parse(localStorage.getItem('mofawid_question_stats') || '{}');
      examQuestions.forEach(q => {
        const userAns = selectedAnswers[q.id];
        if (userAns !== undefined) {
          existingQStats[q.id] = {
            isCorrect: userAns === q.correctIndex,
            lastAnswered: Date.now()
          };
        }
      });
      localStorage.setItem('mofawid_question_stats', JSON.stringify(existingQStats));
    } catch (e) {
      console.error('Failed to save exam attempt', e);
    }

    if (scoreOutOf20 >= 10) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = examQuestions[currentIndex];

  // Scoring results
  const calculateResults = () => {
    const totalQ = examQuestions.length;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    examQuestions.forEach(q => {
      const userAns = selectedAnswers[q.id];
      if (userAns === undefined) {
        unanswered++;
      } else if (userAns === q.correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const rawScore = correct - (penaltyEnabled ? wrong * 0.25 : 0);
    const scoreOutOf20 = Number(Math.max(0, (rawScore / totalQ) * 20).toFixed(2));
    const isPassed = scoreOutOf20 >= 10;

    return { totalQ, correct, wrong, unanswered, scoreOutOf20, isPassed };
  };

  // Pre-start screen
  if (!examStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Clock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            محاكي المباراة الرسمية للمفوضين القضائيين
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            اختبار تجريبي واقعي يحاكي ظروف الامتحان الفعلي وفق نظام الأسئلة متعددة الاختيارات، مع ضبط دقيق للوقت وسلم التنقيط المعتمد رسمياً بوزارة العدل.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-right">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400 block mb-1">المدة الزمنية</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-100 block">60 دقيقة</span>
              <span className="text-[11px] text-slate-500">ساعة كاملة بدون انقطاع</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400 block mb-1">عدد الأسئلة</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-100 block">35 سؤالاً</span>
              <span className="text-[11px] text-slate-500">منتقاة من كافة القوانين</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400 block mb-1">نظام التنقيط</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-100 block">+1 / -0.25</span>
              <span className="text-[11px] text-slate-500">خصم ربع نقطة للخطأ</span>
            </div>
          </div>

          {/* Settings */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-right mb-8">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={penaltyEnabled}
                onChange={(e) => setPenaltyEnabled(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                  تطبيق جزاء الخطأ (-0.25 نقطة لكل إجابة خاطئة)
                </span>
                <span className="text-[11px] text-amber-700 dark:text-amber-400">
                  يوصى بتفعيله لتدريب النفس على تجنب التخمين العشوائي كما في الاختبار الرسمي.
                </span>
              </div>
            </label>
          </div>

          <button
            onClick={() => handleStartExam(35)}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold rounded-xl shadow-md shadow-amber-600/30 text-sm transition-all"
          >
            بدء الاختبار التجريبي الآن
          </button>
        </div>
      </div>
    );
  }

  // Result screen after finish
  if (examCompleted) {
    const { totalQ, correct, wrong, unanswered, scoreOutOf20, isPassed } = calculateResults();

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* Score Card */}
        <div className={`p-8 rounded-3xl border shadow-lg text-center ${
          isPassed 
            ? 'bg-gradient-to-b from-emerald-500/10 via-white to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border-emerald-500/30' 
            : 'bg-gradient-to-b from-rose-500/10 via-white to-white dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-900 border-rose-500/30'
        }`}>
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white shadow-md bg-gradient-to-tr from-amber-600 to-amber-500">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            {isPassed ? 'مبارك! اجتزت الاختبار بنجاح' : 'نتيجة دون عتبة النجاح، واصل المراجعة'}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            عتبة النجاح القانونية هي 10.00 / 20.00
          </p>

          <div className="inline-block px-6 py-4 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 mb-8 shadow-inner">
            <div className="text-xs text-slate-400 font-semibold mb-1">معدل الاختبار الرسمي</div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-amber-400 tabular-nums">
              {scoreOutOf20} <span className="text-xl text-slate-400">/ 20</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center mb-8">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">إجابات صحيحة</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{correct}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">إجابات خاطئة</span>
              <span className="text-xl font-black text-rose-600 dark:text-rose-400 tabular-nums">{wrong}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">بدون جواب</span>
              <span className="text-xl font-black text-slate-600 dark:text-slate-400 tabular-nums">{unanswered}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleStartExam(35)}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار بنموذج جديد</span>
            </button>
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
              >
                العودة للرئيسية
              </button>
            )}
          </div>
        </div>

        {/* Detailed Correction Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <span>المراجعة التفصيلية لكافة الأسئلة والسندات القانونية:</span>
          </h3>

          <div className="space-y-4">
            {examQuestions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isAnsCorrect = userAns === q.correctIndex;
              const isUnanswered = userAns === undefined;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 transition-colors ${
                    isAnsCorrect
                      ? 'border-emerald-200 dark:border-emerald-800/40'
                      : isUnanswered
                      ? 'border-slate-200 dark:border-slate-800'
                      : 'border-rose-200 dark:border-rose-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {q.categoryTitle}
                      </span>
                    </div>

                    <div>
                      {isAnsCorrect ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>صحيحة (+1)</span>
                        </span>
                      ) : isUnanswered ? (
                        <span className="text-xs font-bold text-slate-400">لم يُجب (0)</span>
                      ) : (
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>خاطئة ({penaltyEnabled ? '-0.25' : '0'})</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4 leading-relaxed">
                    {q.question}
                  </p>

                  <div className="space-y-2 mb-4">
                    {q.options.map((opt, optIdx) => {
                      const isCorrectChoice = optIdx === q.correctIndex;
                      const isUserChoice = optIdx === userAns;

                      let rowClass = 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400';
                      if (isCorrectChoice) {
                        rowClass = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 font-bold';
                      } else if (isUserChoice) {
                        rowClass = 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300';
                      }

                      return (
                        <div key={optIdx} className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${rowClass}`}>
                          <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isCorrectChoice && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {isUserChoice && !isCorrectChoice && <X className="w-4 h-4 text-rose-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <div className="font-bold text-amber-700 dark:text-amber-400">
                      السند القانوني: {q.legalReference}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active ongoing exam view
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Sticky Countdown Header */}
      <div className="sticky top-20 z-40 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center gap-2 ${
            timeLeftSeconds < 300 
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 animate-pulse' 
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="text-base sm:text-lg font-black tabular-nums tracking-wider">
              {formatTime(timeLeftSeconds)}
            </span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isPaused ? 'استئناف' : 'إيقاف مؤقت'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          تمت الإجابة: <span className="font-bold text-amber-600 tabular-nums">{Object.keys(selectedAnswers).length}</span> من <span className="tabular-nums">{examQuestions.length}</span>
        </div>

        <button
          onClick={() => {
            if (confirm('هل أنت متأكد من تسليم ورقة الامتحان وإنهاء الاختبار؟')) {
              handleFinishExam();
            }
          }}
          className="px-4 py-2 bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm"
        >
          إنهاء وتسليم الاختبار
        </button>
      </div>

      {isPaused && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-center text-xs font-bold text-amber-800 dark:text-amber-300">
          تم إيقاف الوقت مؤقتاً. انقر على زر التشغيل بالأعلى لمواصلة الاختبار.
        </div>
      )}

      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
                السؤال {currentIndex + 1} من {examQuestions.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentQuestion.categoryTitle}
              </span>
            </div>

            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                flaggedQuestions.includes(currentQuestion.id)
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>تعليم للمراجعة</span>
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-right p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-bold ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
              disabled={currentIndex === examQuestions.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 dark:bg-amber-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-amber-500 transition-colors shadow-xs"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Grid Jump Palette */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
          لوحة الأسئلة للتنقل السريع:
        </div>
        <div className="flex flex-wrap gap-2">
          {examQuestions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isFlagged = flaggedQuestions.includes(q.id);
            const isCurrent = idx === currentIndex;

            let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
            if (isCurrent) {
              badgeStyle = 'ring-2 ring-amber-500 font-bold';
            }
            if (isAnswered) {
              badgeStyle += ' bg-amber-600 text-white border-amber-600';
            }
            if (isFlagged) {
              badgeStyle += ' ring-2 ring-rose-500';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold border flex items-center justify-center transition-all ${badgeStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
