import React from 'react';
import { 
  Scale, 
  BookOpen, 
  Clock, 
  Hash, 
  GraduationCap, 
  Award, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck2,
  BookmarkCheck,
  TrendingUp,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { ProgressDashboard } from './ProgressDashboard';
import { MissionsSummarySection } from './MissionsSummarySection';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onStartCategoryPractice?: (catId: string) => void;
  questionsCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNavigate, 
  onStartCategoryPractice = () => onNavigate('quiz'),
  questionsCount 
}) => {
  const essentialArticles = [
    { num: '3', title: 'شروط المترشح (السن والشواهد والسوابق)' },
    { num: '6', title: 'إعفاءات كتابة الضبط والكتاب المحلفين (10 سنوات و 25%)' },
    { num: '7', title: 'مدة التمرين (6 أشهر تكوين + 6 أشهر تدريب بمكتب)' },
    { num: '8', title: 'حالات التنافي مع المهنة والوظائف المحظورة' },
    { num: '11', title: 'النطاق الإقليمي بدائرة محكمة الاستئناف' },
    { num: '15', title: 'صيغة اليمين القانونية وأداؤها بالاستئناف' },
    { num: '20', title: 'أتعاب المفوض وعدم سقوطها بالصلح' },
    { num: '35', title: 'أجل 48 ساعة لإيداع أموال التنفيذ بالصندوق' },
    { num: '36', title: 'موانع المزايدة والإجراءات للأقارب حتى الدرجة 4' },
    { num: '43', title: 'مهام واختصاصات المفوض القضائي الحصرية' },
    { num: '44', title: 'رخصة الإفراغات والبيوع العقارية (5 سنوات ممارسة)' },
    { num: '48', title: 'إنجاز الإجراءات والتبليغات في 3 نظائر' },
    { num: '49', title: 'إرجاع شهادات التسليم قبل الجلسة بـ 3 أيام' },
    { num: '52', title: 'الاستعانة بالقوة العمومية بإذن وكيل الملك' },
    { num: '54', title: 'عقد المشاركة (نفس الابتدائية وحد أقصى 4 مفوضين)' },
    { num: '65-66', title: 'شروط الكاتب المحلف وحصر نيابته في التبليغ' },
    { num: '69', title: 'توقيع وتأشيرة المفوض على أصول التبليغ تحت طائلة البطلان' },
    { num: '81', title: 'التوقيف المؤقت حتى شهرين بإذن وزير العدل' },
    { num: '89', title: 'ترتيب العقوبات التأديبية (الإنذار إلى العزل)' },
    { num: '93', title: 'أجل استئناف المقرر التأديبي (15 يوماً بالاستئناف)' },
    { num: '122', title: 'رئيس الهيئة الوطنية (15 سنة أقدمية وولاية 4 سنوات)' },
    { num: '169', title: 'جميع آجال القانون 46.21 هي آجال كاملة' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>محينة وفق الجريدة الرسمية 2025 - 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            المنصة الذكية لمراجعة مباراة المفوضين القضائيين بالمغرب
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            منظومة مراجعة تفاعلية شاملة مصممة خصيصاً للمترشحين، تعتمد على القانون الجديد رقم <strong className="text-amber-400">46.21</strong>، والمرسوم التطبيقي رقم <strong className="text-amber-400">2.25.885</strong>، ومستجدات قانون المسطرة المدنية رقم <strong className="text-amber-400">58.25</strong>، ونماذج الاختبارات الكتابية السابقة.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('quiz')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>بدء تدريب QCM فوري</span>
            </button>

            <button
              onClick={() => onNavigate('simulator')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-xs flex items-center gap-2 transition-colors border border-white/10"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>محاكاة الامتحان (60 دقيقة)</span>
            </button>

            <button
              onClick={() => onNavigate('mindmap')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-xs flex items-center gap-2 transition-colors border border-white/10"
            >
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>الخريطة الذهنية التفاعلية</span>
            </button>
          </div>
        </div>
      </div>

      {/* ProgressDashboard Component (نسبة التقدم، معدل الإنجاز، ومواضيع الضعف) */}
      <ProgressDashboard
        onStartCategoryPractice={onStartCategoryPractice}
        onStartExam={() => onNavigate('simulator')}
      />

      {/* Concise & Comprehensive Judicial Officer Missions Summary (مهام المفوض القضائي استنادا للمصادر) */}
      <MissionsSummarySection 
        onStartQuizMissions={() => onNavigate('quiz')}
      />

      {/* 4 Feature Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: QCM */}
        <div 
          onClick={() => onNavigate('quiz')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600/50 shadow-xs cursor-pointer group transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 transition-colors">
            بنك أسئلة QCM تفاعلي
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            بنك غني يشمل كافة القوانين والأنظمة مع التصحيح الفوري والسند القانوني ورقم المادة بالجريدة الرسمية.
          </p>
          <div className="flex items-center text-xs font-bold text-amber-600 gap-1">
            <span>تصفح الأسئلة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Mind Map */}
        <div 
          onClick={() => onNavigate('mindmap')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600/50 shadow-xs cursor-pointer group transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
            الخريطة الذهنية 46.21
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            مخطط بصري منظم يغطي 15 محوراً رئيسياً للقانون الجديد لتسهيل الحفظ والاستيعاب السريع.
          </p>
          <div className="flex items-center text-xs font-bold text-blue-600 gap-1">
            <span>استكشاف الخريطة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Exam Simulator */}
        <div 
          onClick={() => onNavigate('simulator')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600/50 shadow-xs cursor-pointer group transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 transition-colors">
            محاكي المباراة التجريبي
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            اختبار زمني من 35 سؤالاً في 60 دقيقة مع خصم ربع نقطة للخطأ وسلم تنقيط رسمي من 20.
          </p>
          <div className="flex items-center text-xs font-bold text-emerald-600 gap-1">
            <span>خوض المحاكاة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: Golden Numbers */}
        <div 
          onClick={() => onNavigate('numbers')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600/50 shadow-xs cursor-pointer group transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Hash className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">
            الآجال والأرقام الذهبية
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            بطاقات فلاش للحفظ السريع لكافة الآجال (48 ساعة، 5 سنوات، 21-45 سنة، مليون درهم، إلخ).
          </p>
          <div className="flex items-center text-xs font-bold text-purple-600 gap-1">
            <span>مراجعة الأرقام</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Essential Articles for Revision */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>المواد القانونية الأكثر حساسية ووروداً في المباراة</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              أكدت دراسة الامتحانات ونصوص القانون 46.21 أن هذه المواد تشكل صلب أكثر من 80% من أسئلة المباراة:
            </p>
          </div>
          <button
            onClick={() => onNavigate('quiz')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
          >
            التدرب عليها في الـ QCM ←
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {essentialArticles.map((art) => (
            <div 
              key={art.num}
              onClick={() => onNavigate('quiz')}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-amber-300 dark:hover:border-amber-600/40 transition-colors flex items-start gap-3 cursor-pointer"
            >
              <span className="w-9 h-9 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                م {art.num}
              </span>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                  {art.title}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">القانون 46.21</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Legal Texts References */}
      <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          المراجع التشريعية والتنظيمية المعتمدة في المنصة:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-100 block">القانون رقم 46.21</span>
            <span className="text-[11px] text-slate-500 block">الظهير 1.25.49 (6 يونيو 2025)</span>
            <span className="text-[10px] text-amber-600 font-semibold">تنظيم مهنة المفوضين القضائيين</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-100 block">المرسوم رقم 2.25.885</span>
            <span className="text-[11px] text-slate-500 block">16 أبريل 2026 (ج.ر عدد 7506)</span>
            <span className="text-[10px] text-amber-600 font-semibold">تطبيق أحكام القانون 46.21</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-100 block">قانون المسطرة المدنية 58.25</span>
            <span className="text-[11px] text-slate-500 block">الظهير 1.26.07 (11 فبراير 2026)</span>
            <span className="text-[10px] text-amber-600 font-semibold">أحكام التبليغ والتنفيذ والحجوز</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-100 block">مدونة تحصيل الديون 15.97</span>
            <span className="text-[11px] text-slate-500 block">الظهير 1.00.175 (محينة 2024)</span>
            <span className="text-[10px] text-amber-600 font-semibold">التحصيل الجبري وموانع الحجز</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-100 block">نماذج المباريات السابقة</span>
            <span className="text-[11px] text-slate-500 block">دورات 2015 و 2017</span>
            <span className="text-[10px] text-amber-600 font-semibold">ق.ل.ع والمسطرة المدنية</span>
          </div>
        </div>
      </div>
    </div>
  );
};
