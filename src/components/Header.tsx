import React from 'react';
import { Scale, BookOpen, Clock, Hash, GraduationCap, LayoutDashboard, Sparkles, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  completedQuestionsCount: number;
  totalQuestionsCount: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  completedQuestionsCount,
  totalQuestionsCount,
  isDarkMode,
  setIsDarkMode
}) => {
  const progressPercent = totalQuestionsCount > 0 
    ? Math.round((completedQuestionsCount / totalQuestionsCount) * 100) 
    : 0;

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'quiz', label: 'بنك أسئلة QCM', icon: BookOpen },
    { id: 'mindmap', label: 'الخريطة الذهنية 46.21', icon: Scale },
    { id: 'simulator', label: 'محاكي المباراة', icon: Clock },
    { id: 'numbers', label: 'الآجال والأرقام الذهبية', icon: Hash },
    { id: 'previous', label: 'نماذج المباريات', icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 text-right group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
                  دليل المفوض <span className="text-amber-600 dark:text-amber-400 font-black">Pro</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                  مباراة المفوضين القضائيين بالمغرب
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action & Readiness indicator */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <div className="text-right">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">الجاهزية</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums leading-tight">
                  {progressPercent}%
                </div>
              </div>
              <div className="w-14 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="تبديل الوضع الليلي"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick action button */}
            <button
              onClick={() => setActiveTab('simulator')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 rounded-lg shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>بدء محاكاة</span>
            </button>
          </div>

        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-slate-200 dark:border-slate-800 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
