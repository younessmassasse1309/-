import React, { useState } from 'react';
import { 
  Briefcase, 
  Send, 
  Eye, 
  Banknote, 
  Gavel, 
  Building2, 
  Receipt, 
  ShieldCheck, 
  FileCheck, 
  Scale, 
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface MissionsSummarySectionProps {
  onStartQuizMissions?: () => void;
}

export const MissionsSummarySection: React.FC<MissionsSummarySectionProps> = ({
  onStartQuizMissions
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'notif' | 'exec' | 'debt' | 'special'>('all');

  const missionCategories = [
    {
      id: 'notif',
      title: 'مهام التبليغ والإشعار',
      icon: Send,
      badge: 'المادة 43 ق 46.21 + ق.م.م 58.25',
      color: 'blue',
      items: [
        {
          title: 'تبليغ الاستدعاءات والوثائق القضائية والإدارية',
          desc: 'تبليغ المقالات، العرائض، المذكرات، والاستدعاءات الصادرة عن المحاكم ومختلف الإدارات والمؤسسات العمومية، وفق الشروط المقررة في ق.م.م 58.25 وقانون المسطرة الجنائية.',
          vitalRule: 'مراعاة أوقات التبليغ (من 7:00 إلى 22:00 وفق م 82 ق.م.م 58.25) وإرجاع شهادة التسليم قبل الجلسة بثلاثة أيام على الأقل (م 49 ق 46.21).'
        },
        {
          title: 'تبليغ الإشعارات والإنذارات بطلب مباشر',
          desc: 'توجيه وتبليغ الإنذارات والإشعارات المدنية والتجارية بطلب مباشر من المعني بالأمر دون حاجة لرفع دعوى أو استصدار أمر قضائي مسبق.',
          vitalRule: 'تحرير التبليغ في 3 نظائر رسمية وتضمينه البيانات الجوهرية وهوية المتسلم.'
        }
      ]
    },
    {
      id: 'exec',
      title: 'مهام التنفيذ الجبري والمدني',
      icon: Gavel,
      badge: 'المادة 43 و 44 ق 46.21 + ق.م.م 58.25',
      color: 'amber',
      items: [
        {
          title: 'تبليغ وتنفيذ المقررات القضائية والسندات التنفيذية',
          desc: 'مباشرة تنفيذ الأحكام والقرارات والأوامر القضائية والسندات الحاملة للصيغة التنفيذية، وإيقاع الحجوز التنفيذية على المنقولات المادية، مع الرجوع لقاضي التنفيذ عند وجود أي صعوبة.',
          vitalRule: 'إيداع أموال التنفيذ بصندوق المحكمة داخل أجل لا يتعدى 48 ساعة تحت طائلة المساءلة (المادة 35 ق 46.21).'
        },
        {
          title: 'التنفيذ في الإفراغات والبيوع العقارية (اختصاص مقيد)',
          desc: 'مباشرة مساطر إفراغ المحلات السكنية والتجارية، والبيوع العقارية بالمزاد العلني بالمحكمة.',
          vitalRule: 'شرط مقيد: 5 سنوات ممارسة فعلية + انعدام عقوبة الإيقاف + ترخيص صريح من وزير العدل يسحب وجوباً عند الإيقاف (المادة 44 ق 46.21).'
        },
        {
          title: 'الاستعانة بالقوة العمومية',
          desc: 'طلب مساعدة القوة العمومية لمؤازرة المفوض القضائي أثناء ممارسة مهام التنفيذ عند الاقتضاء أو مقاومة المنفذ عليه.',
          vitalRule: 'الحصول الإلزامي على إذن كتابي من وكيل الملك الذي تباشر الإجراءات في دائرة نفوذه (المادة 52 ق 46.21).'
        }
      ]
    },
    {
      id: 'debt',
      title: 'تحصيل الديون العمومية والخاصة',
      icon: Receipt,
      badge: 'المادة 34 ق 15.97 + المادة 43 ق 46.21',
      color: 'emerald',
      items: [
        {
          title: 'التحصيل الجبري للديون العمومية (القانون 15.97)',
          desc: 'يباشر المفوض القضائي (بصفته عوناً قضائياً) التحصيل الجبري للضرائب والرسوم وديون الدولة والجماعات بطلب من المحاسب في كافة درجاته: تبليغ الإنذار، إيقاع الحجز، وإجراء البيع بالمزاد.',
          vitalRule: 'مراعاة الأموال غير القابلة للحجز (السكنى الرئيسية العائلية حتى 200 ألف درهم ومؤونة شهر م 46)، ومنع شراء أي محجوز تحت طائلة العزل (م 64 ق 15.97).'
        },
        {
          title: 'التحصيل الودي للديون الخاصة الحالة الأداء',
          desc: 'استخلاص الديون الثابتة والمستحقة الأداء للخواص والشركات رضائياً بمقتضى سند تنفيذي ودون اللجوء الفوري للتدابير القسرية.',
          vitalRule: 'تسليم وصوالت رسمية من كناش ذي أرومات أو بطريقة إلكترونية مرخصة (المادة 20 ق 46.21).'
        }
      ]
    },
    {
      id: 'special',
      title: 'المعاينات، العروض، والمهام الخاصة',
      icon: Eye,
      badge: 'المادة 43 ق 46.21 + ق.م.م 58.25',
      color: 'purple',
      items: [
        {
          title: 'المعاينات المادية المجردة من كل رأي',
          desc: 'إثبات الوقائع وحالة الأمكنة والأشياء مادياً إما بناء على أمر قضائي استعجالي (م 225 ق.م.م 58.25) أو بطلب مباشر من المعني بالأمر.',
          vitalRule: 'وجوب تجرد المعاينة من أي حكم قيمة أو استنتاج فني أو رأي قانوني تفادياً لبطلان المحضر.'
        },
        {
          title: 'عروض الوفاء الحقيقي والإيداع',
          desc: 'عرض المبالغ المالية أو الأشياء المنقولة رسمياً على الدائن لإبراء ذمة المدين، وإيداعها بصندوق المحكمة عند رفض العرض.',
          vitalRule: 'إيداع المبالغ بصندوق المحكمة داخل أجل 15 يوماً من رفض الدائن للعرض (المادة 252 ق.م.م 58.25).'
        },
        {
          title: 'محاضر الاستجواب ومحاضر الجموع العامة (مشروطة بأمر)',
          desc: 'استجواب الأشخاص لإثبات أقوالهم أو حضور الجموع العامة للشركات والجمعيات وتوثيق مجرياتها.',
          vitalRule: 'لا يمكن إنجاز محضر الاستجواب أو حضور الجمع العام إلا بناء على أمر قضائي صريح مسبق.'
        },
        {
          title: 'محاضر البيوع بالمزاد العلني للإدارات والخواص',
          desc: 'إجراء البيوع بالمزاد العلني للمنقولات المصادرة أو المحجوزة، وتوثيق رسو المزاد واستخلاص المبالغ.',
          vitalRule: 'ارتداء البذلة المهنية وجوباً أثناء البيوع بالمزاد العلني (المادة 22 من المرسوم 2.25.885).'
        }
      ]
    }
  ];

  const filteredCategories = activeTab === 'all' 
    ? missionCategories 
    : missionCategories.filter(c => c.id === activeTab);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      
      {/* Header of Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
            <Briefcase className="w-3.5 h-3.5" />
            <span>الدليل الموجز والشامل للاختصاصات المهنية</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            مهام واختصاصات المفوض القضائي وفق المنظومة القانونية المتكاملة
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            تأصيل تركيبي دقيق يجمع بين نصوص القانون رقم <strong className="text-slate-700 dark:text-slate-300">46.21</strong>، مدونة تحصيل الديون العمومية رقم <strong className="text-slate-700 dark:text-slate-300">15.97</strong>، قانون المسطرة المدنية رقم <strong className="text-slate-700 dark:text-slate-300">58.25</strong>، والمرسوم التطبيقي رقم <strong className="text-slate-700 dark:text-slate-300">2.25.885</strong>.
          </p>
        </div>

        {onStartQuizMissions && (
          <button
            onClick={onStartQuizMissions}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-center"
          >
            <span>اختبر معلوماتك في المهام</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          كافة المهام (4 محاور)
        </button>
        <button
          onClick={() => setActiveTab('notif')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'notif'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          التبليغ والإشعار
        </button>
        <button
          onClick={() => setActiveTab('exec')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'exec'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          التنفيذ والإفراغات
        </button>
        <button
          onClick={() => setActiveTab('debt')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'debt'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          الديون العمومية (15.97)
        </button>
        <button
          onClick={() => setActiveTab('special')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'special'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          المعاينات والمهام الخاصة
        </button>
      </div>

      {/* Structured Category Blocks */}
      <div className="space-y-6">
        {filteredCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-white shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {cat.title}
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {cat.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {cat.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{item.title}</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-[11px] text-amber-900 dark:text-amber-300 font-semibold leading-relaxed">
                      ⚖️ <strong>الضابط الجوهري: </strong> {item.vitalRule}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
