import React, { useState } from 'react';
import { goldenNumbers } from '../data/goldenNumbers';
import { GoldenNumber } from '../types';
import { 
  Hash, 
  Search, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  RotateCw, 
  CheckCircle2, 
  Bookmark, 
  Award,
  BookOpen
} from 'lucide-react';

export const GoldenNumbersView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFlashcardMode, setIsFlashcardMode] = useState<boolean>(false);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const categories = ['all', 'الولوج والشروط', 'المهام والاختصاص', 'الواجبات والمالية', 'التأديب والمسؤولية', 'الهيئة والمجالس', 'المسطرة المدنية والتبليغ'];

  const filteredNumbers = goldenNumbers.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = 
      item.number.includes(searchQuery) ||
      item.unit.includes(searchQuery) ||
      item.label.includes(searchQuery) ||
      item.explanation.includes(searchQuery) ||
      item.articleRef.includes(searchQuery);
    return matchesCat && matchesQuery;
  });

  const currentFlashcard: GoldenNumber | undefined = filteredNumbers[flashcardIndex];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مفتاح الأسئلة الدقيقة في المباراة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            معجم الأرقام والآجال والنسب الذهبية
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            المدد الزمنية، الآجال الإلزامية، أقدميات الترشح، نسب الإعفاءات، وسقوف الغرامات والتأمينات المقررة في القانون 46.21 والمرسوم 2.25.885 وقانون المسطرة المدنية 58.25.
          </p>
        </div>

        {/* Mode Toggle Button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => {
              setIsFlashcardMode(!isFlashcardMode);
              setIsFlipped(false);
              setFlashcardIndex(0);
            }}
            className="px-4 py-2 bg-white text-amber-900 rounded-xl text-xs font-bold shadow-md hover:bg-amber-50 transition-colors flex items-center gap-2"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlashcardMode ? 'العودة لجدول الأرقام' : 'تشغيل بطاقات التذكر السريع (Flashcards)'}</span>
          </button>
        </div>
      </div>

      {/* FLASHCARD MODE */}
      {isFlashcardMode ? (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>البطاقة {flashcardIndex + 1} من {filteredNumbers.length}</span>
            <span>انقر على البطاقة لقلبها وكشف الشرح والسند</span>
          </div>

          {currentFlashcard && (
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[280px] bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-amber-300 dark:border-amber-700/60 shadow-lg cursor-pointer flex flex-col justify-between text-center select-none hover:shadow-xl transition-all"
            >
              {!isFlipped ? (
                <div className="my-auto space-y-4">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full">
                    {currentFlashcard.category}
                  </span>
                  
                  <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                    {currentFlashcard.number} <span className="text-2xl text-slate-400 font-bold">{currentFlashcard.unit}</span>
                  </div>

                  <p className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">
                    ماذا يعني هذا الرقم / الأجل في مباراة المفوضين القضائيين؟
                  </p>

                  <span className="text-xs text-slate-400 block pt-4">
                    انقر للتحقق من جوابك ↺
                  </span>
                </div>
              ) : (
                <div className="my-auto space-y-4 animate-fadeIn">
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>الدلالة القانونية:</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {currentFlashcard.label}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-right bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    {currentFlashcard.explanation}
                  </p>

                  <div className="pt-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                    السند: {currentFlashcard.articleRef} ({currentFlashcard.lawName})
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Flashcard navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setFlashcardIndex(prev => Math.max(0, prev - 1));
                setIsFlipped(false);
              }}
              disabled={flashcardIndex === 0}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40"
            >
              السابقة
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              قلب البطاقة ↺
            </button>

            <button
              onClick={() => {
                setFlashcardIndex(prev => Math.min(filteredNumbers.length - 1, prev + 1));
                setIsFlipped(false);
              }}
              disabled={flashcardIndex === filteredNumbers.length - 1}
              className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold disabled:opacity-40"
            >
              التالية
            </button>
          </div>
        </div>
      ) : (
        /* CATALOG TABLE / GRID MODE */
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'جميع الأرقام' : cat}
                </button>
              ))}
            </div>

            <div className="relative sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث برقم أو كلمة (مثلاً: 48، 5 سنوات)..."
                className="w-full pl-3 pr-9 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNumbers.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600/50 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                      {item.number} <span className="text-xs font-bold text-slate-400">{item.unit}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {item.label}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {item.explanation}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">{item.articleRef}</span>
                  <span className="truncate max-w-[140px] text-slate-400">{item.lawName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
