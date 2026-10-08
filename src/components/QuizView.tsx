import React, { useState, useMemo } from 'react';
import { questionsBank, categories } from '../data/legalQuestions';
import { Question } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  BookOpen, 
  Sparkles, 
  Check, 
  X,
  Filter,
  Eye,
  Search
} from 'lucide-react';

interface QuizViewProps {
  initialCategory?: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ initialCategory = 'all' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mofawid_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [filterMode, setFilterMode] = useState<'all' | 'bookmarked' | 'incorrect'>('all');
  const [isInstantReveal, setIsInstantReveal] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Save bookmarks
  const toggleBookmark = (id: string) => {
    const next = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id) 
      : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem('mofawid_bookmarks', JSON.stringify(next));
  };

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questionsBank.filter(q => {
      // Category filter
      if (selectedCategory !== 'all' && q.category !== selectedCategory) {
        return false;
      }
      // Bookmark filter
      if (filterMode === 'bookmarked' && !bookmarks.includes(q.id)) {
        return false;
      }
      // Incorrect filter
      if (filterMode === 'incorrect') {
        const ans = selectedAnswers[q.id];
        if (ans === undefined || ans === q.correctIndex) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.question.toLowerCase().includes(query) ||
          q.legalReference.toLowerCase().includes(query) ||
          q.explanation.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedCategory, filterMode, bookmarks, selectedAnswers, searchQuery]);

  const currentQuestion: Question | undefined = filteredQuestions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));

    try {
      const existingQStats = JSON.parse(localStorage.getItem('mofawid_question_stats') || '{}');
      existingQStats[currentQuestion.id] = {
        isCorrect: optionIndex === currentQuestion.correctIndex,
        selectedOption: optionIndex,
        lastAnswered: Date.now()
      };
      localStorage.setItem('mofawid_question_stats', JSON.stringify(existingQStats));
    } catch (e) {
      console.error('Failed to update question stats in localStorage', e);
    }
  };

  const currentAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;
  const isAnswered = currentAnswer !== undefined;
  const isCorrect = isAnswered && currentAnswer === currentQuestion?.correctIndex;

  // Stats
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(([qId, ans]) => {
    const q = questionsBank.find(item => item.id === qId);
    return q && q.correctIndex === ans;
  }).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Category Selection Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">محاور الأسئلة والتأصيل القانوني:</span>
          </div>
          <div className="text-xs text-slate-500 tabular-nums">
            إجمالي بنك الأسئلة: {questionsBank.length} سؤالاً
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? questionsBank.length 
              : questionsBank.filter(q => q.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${isSelected ? 'bg-amber-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Modes & Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterMode === 'all' 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            الكل ({filteredQuestions.length})
          </button>
          <button
            onClick={() => setFilterMode('bookmarked')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterMode === 'bookmarked' 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>المفضلة ({bookmarks.length})</span>
          </button>
          <button
            onClick={() => setFilterMode('incorrect')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterMode === 'incorrect' 
                ? 'bg-rose-600 text-white' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <XCircle className="w-3 h-3" />
            <span>الخاطئة</span>
          </button>
        </div>

        {/* Search input & Instant Mode toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              placeholder="بحث في الأسئلة والمواد..."
              className="w-full pl-2 pr-8 py-1 text-xs rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={() => setIsInstantReveal(!isInstantReveal)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              isInstantReveal
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title="إظهار التصحيح والشرح فور النقر على الخيار"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>كشف فوري</span>
          </button>

          <button
            onClick={() => {
              if (confirm('هل تريد إعادة تعيين الإجابات المسجلة في هذه الجلسة؟')) {
                setSelectedAnswers({});
                setCurrentIndex(0);
              }
            }}
            className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="إعادة تعيين الإجابات"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            لا توجد أسئلة تطابق الفلتر الحالي
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            يرجى تبديل التصنيف أو إزالة كلمة البحث للاطلاع على كافة الأسئلة.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setFilterMode('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : currentQuestion ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Question Header & Tracker */}
          <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                السؤال {currentIndex + 1} من {filteredQuestions.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                {currentQuestion.categoryTitle}
              </span>
              {currentQuestion.examYear && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                  دورة {currentQuestion.examYear}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(currentQuestion.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  bookmarks.includes(currentQuestion.id)
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-600'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
                title="حفظ السؤال في المفضلة"
              >
                {bookmarks.includes(currentQuestion.id) ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = currentAnswer === idx;
                const isThisCorrect = idx === currentQuestion.correctIndex;
                
                let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40';
                
                if (isAnswered && isInstantReveal) {
                  if (isThisCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500/40';
                  } else if (isSelected) {
                    optionStyle = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500/40';
                  } else {
                    optionStyle = 'border-slate-200 dark:border-slate-800 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 ring-1 ring-amber-500';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-right p-4 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3.5 select-none ${optionStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                      isAnswered && isInstantReveal && isThisCorrect
                        ? 'bg-emerald-600 text-white'
                        : isAnswered && isInstantReveal && isSelected
                        ? 'bg-rose-600 text-white'
                        : isSelected
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {isAnswered && isInstantReveal && isThisCorrect && (
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isInstantReveal && isSelected && !isThisCorrect && (
                      <X className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box (when answered and instant reveal enabled) */}
            {isAnswered && isInstantReveal && (
              <div className={`p-5 rounded-2xl border transition-all ${
                isCorrect 
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center gap-2 mb-2 font-bold text-xs">
                  {isCorrect ? (
                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>إجابة صحيحة! أحسنت.</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                      <XCircle className="w-4 h-4" />
                      <span>إجابة غير صحيحة. راجع السند القانوني:</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  {currentQuestion.explanation}
                </p>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>المصدر: {currentQuestion.legalReference}</span>
                  </div>
                  {currentQuestion.lawTextExcerpt && (
                    <span className="italic text-[11px] text-slate-400 hidden sm:inline">نص المادة معتمد بالجريدة الرسمية</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {/* Quick navigator dots or number */}
            <div className="text-xs font-semibold text-slate-500 tabular-nums">
              {currentIndex + 1} / {filteredQuestions.length}
            </div>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
              disabled={currentIndex === filteredQuestions.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
            >
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
