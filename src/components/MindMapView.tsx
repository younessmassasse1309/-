import React, { useState } from 'react';
import { mindMapSections } from '../data/mindMapData';
import { 
  Scale, 
  Search, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  ExternalLink,
  ChevronDown,
  Layers,
  Info
} from 'lucide-react';

interface MindMapViewProps {
  onStartQuizCategory?: (categoryId: string) => void;
}

export const MindMapView: React.FC<MindMapViewProps> = ({ onStartQuizCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'essential' | 'procedures' | 'org'>('all');

  const filteredSections = mindMapSections.filter(sec => {
    const matchesSearch = 
      sec.title.includes(searchQuery) ||
      sec.summary.includes(searchQuery) ||
      sec.articles.includes(searchQuery) ||
      sec.keyPoints.some(pt => pt.includes(searchQuery));
    
    if (!matchesSearch) return false;

    if (selectedFilter === 'essential') {
      return [1, 2, 3, 4, 8].includes(sec.id);
    } else if (selectedFilter === 'procedures') {
      return [9, 10, 11, 12].includes(sec.id);
    } else if (selectedFilter === 'org') {
      return [13, 14, 15].includes(sec.id);
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner for Mind Map */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خريطة الاستيعاب الشاملة للقانون 46.21</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            المخطط الذهني الشامل لقانون المفوضين القضائيين
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            استيعاب بصري وهيكلي منظم لـ 15 محوراً رئيسياً، بدءاً من شروط الولوج والتنافي، مروراً بمهام التبليغ والتنفيذ والإفراغات، وصولاً إلى هياكل الهيئة الوطنية والمجالس الجهوية والمساطر التأديبية.
          </p>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-center">
          <div className="p-2.5 rounded-xl bg-white/5 backdrop-blur-xs">
            <span className="text-xl sm:text-2xl font-black text-amber-400 block tabular-nums">15</span>
            <span className="text-xs text-slate-300">محوراً شاملاً</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 backdrop-blur-xs">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 block tabular-nums">175</span>
            <span className="text-xs text-slate-300">مادة قانونية</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 backdrop-blur-xs">
            <span className="text-xl sm:text-2xl font-black text-cyan-400 block tabular-nums">48 س</span>
            <span className="text-xs text-slate-300">أجل صندوق المحكمة</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 backdrop-blur-xs">
            <span className="text-xl sm:text-2xl font-black text-purple-400 block tabular-nums">5 سنوات</span>
            <span className="text-xs text-slate-300">أقدمية التنفيذ العقاري</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === 'all'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            كل المحاور (15)
          </button>
          <button
            onClick={() => setSelectedFilter('essential')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === 'essential'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            الشروط والتنافي (1-4)
          </button>
          <button
            onClick={() => setSelectedFilter('procedures')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === 'procedures'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            الإجراءات والتنفيذ (8-12)
          </button>
          <button
            onClick={() => setSelectedFilter('org')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === 'org'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            التأديب والهيئة (13-15)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في محاور الخريطة..."
              className="w-full pl-3 pr-9 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="طباعة الملخص"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Interactive Mind Map Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSections.map((sec) => {
          const isExpanded = expandedId === sec.id;
          return (
            <div
              key={sec.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 flex flex-col ${
                isExpanded 
                  ? 'border-amber-500 dark:border-amber-500 shadow-md ring-1 ring-amber-500/20' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
              }`}
            >
              {/* Card Header */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : sec.id)}
                className="p-5 cursor-pointer select-none border-b border-slate-100 dark:border-slate-800/80"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 tracking-wider">
                    المحور {sec.number}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {sec.articles}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {sec.title}
                  </h3>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-amber-600' : ''}`} />
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {sec.summary}
                </p>
              </div>

              {/* Card Body: Key points */}
              <div className={`p-5 space-y-4 flex-1 flex flex-col justify-between ${isExpanded ? 'block' : 'hidden md:block'}`}>
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    عناصر الضبط والحفظ الأساسية:
                  </div>
                  <ul className="space-y-2">
                    {sec.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vital Rule Highlight */}
                {sec.vitalRule && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-300 text-[11px] font-semibold flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">قاعدة ذهبية: {sec.vitalRule}</span>
                  </div>
                )}

                {/* Practice link */}
                {onStartQuizCategory && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartQuizCategory('all');
                      }}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 transition-colors"
                    >
                      <span>تدرب على أسئلة هذا المحور</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            لا توجد محاور مطابقة لبحثك
          </h3>
          <p className="text-xs text-slate-500">جرب كتابة مصطلح آخر مثل "اليمين" أو "التنفيذ" أو "المشاركة".</p>
        </div>
      )}
    </div>
  );
};
