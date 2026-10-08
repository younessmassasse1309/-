import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Sparkles,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

interface PreviousExamsViewProps {
  onStartPracticeTopic?: (category: string) => void;
}

export const PreviousExamsView: React.FC<PreviousExamsViewProps> = ({ onStartPracticeTopic }) => {
  const [selectedExamYear, setSelectedExamYear] = useState<'2015' | '2017'>('2015');
  const [expandedSubject, setExpandedSubject] = useState<string | null>('2015-1');

  const examsData = {
    '2015': {
      date: 'الاختبار الكتابي: 26 يوليوز 2015',
      source: 'وزارة العدل والحريات - مجلة قانونك',
      subjects: [
        {
          id: '2015-1',
          title: 'بطلان الالتزامات وإبطالها',
          field: 'قانون الالتزامات والعقود (ق.ل.ع)',
          duration: 'ساعتان (2h)',
          coefficient: 'معامل 2',
          problematique: 'ما هي الفروق الجوهرية بين نظامي البطلان والإبطال في القانون المغربي من حيث الأسباب والآثار والتقادم والإجازة؟',
          planOutline: [
            {
              title: 'المطلب الأول: أسباب البطلان والإبطال والتمييز بينهما',
              subpoints: [
                'الفقرة 1: أسباب بطلان الالتزام (الفصل 306 ق.ل.ع: انعدام المحل أو مشروعيته، انعدام السبب، انعدام الأهلية، ما قرره القانون صراحة).',
                'الفقرة 2: أسباب القابلية للإبطال (الفصل 311 ق.ل.ع: عيوب الرضا كالغلط والتدليس والإكراه والغبن، ونقصان أهلية الملتزم).'
              ]
            },
            {
              title: 'المطلب الثاني: الآثار القانونية المترتبة وقواعد الإجازة والتقادم',
              subpoints: [
                'الفقرة 1: إمكانية الإجازة والتقادم (البطلان لا تلحقه الإجازة ولا يتقادم بمرور الزمن؛ الإبطال تلحقه الإجازة الصريحة أو الضمنية ويسقط بالتقادم بسنة واحدة بمقتضى الفصل 311).',
                'الفقرة 2: الأثر الرجعي وإعادة الأطراف للحالة السابقة، واستثناءات حماية الغير حسن النية.'
              ]
            }
          ],
          qcmQuestions: [
            {
              q: 'ما هو الأجل العام لتقادم دعوى إبطال الالتزام وفق الفصل 311 من ق.ل.ع؟',
              options: ['سنة واحدة (1)', 'خمس سنوات', 'خمس عشرة سنة', 'لا تتقادم أبداً'],
              ans: 0,
              exp: 'تنص المادة 311 على تقادم دعوى الإبطال بسنة واحدة تبدأ من تاريخ زوال الإكراه أو كشف الغلط أو التدليس أو بلوغ سن الرشد.'
            },
            {
              q: 'هل تلحق الإجازة الالتزام الباطل بقوة القانون؟',
              options: ['نعم، إذا اتفق المتعاقدان كتابة', 'لا، الباطل لا تلحقه الإجازة بحكم الفصل 306', 'نعم، بإذن من القاضي', 'نعم، بمرور 5 سنوات'],
              ans: 1,
              exp: 'الالتزام الباطل معدوم قانوناً ولا يمكن تصحيحه بالإجازة أو التصديق.'
            }
          ]
        },
        {
          id: '2015-2',
          title: 'طرق التبليغ القضائي',
          field: 'قانون المسطرة المدنية',
          duration: 'ساعتان (2h)',
          coefficient: 'معامل 2',
          problematique: 'ما هي الآليات القانونية المقررة لتبليغ الاستدعاءات والأحكام القضائية، وما هو دور المفوض القضائي في تحقيق ضمانات المحاكمة العادلة وحجية شهادة التسليم؟',
          planOutline: [
            {
              title: 'المطلب الأول: قنوات التبليغ المعتمدة في التنظيم الإجرائي المغربي',
              subpoints: [
                'الفقرة 1: مؤسسة المفوضين القضائيين كأصل عام ورئيسي في إنجاز التبليغات القضائية.',
                'الفقرة 2: الطرق الاستثنائية والبديلة (التبليغ عن طريق كتابة الضبط، الطريقة الدبلوماسية، التبليغ الإلكتروني بموجب المسطرة المدنية الجديدة 58.25، والتبليغ عبر البريد المضمون).'
              ]
            },
            {
              title: 'المطلب الثاني: شكليات التبليغ وآثاره وحجية شهادة التسليم',
              subpoints: [
                'الفقرة 1: بيانات شهادة التسليم وقواعد التبليغ للشخص نفسه أو في موطنه أو لأقاربه (المواد 82-87 من ق.م.م 58.25).',
                'الفقرة 2: آثار رفض التسلم، وقاعدة سريان الأثر في اليوم العاشر الموالي لتاريخ الرفض، وبطلان التبليغ المعيب.'
              ]
            }
          ],
          qcmQuestions: [
            {
              q: 'في أي وقت يجوز قانوناً تبليغ الاستدعاءات وفق المسطرة المدنية الجديدة 58.25؟',
              options: ['في أي وقت ليلاً ونهاراً', 'من 7:00 صباحاً إلى 22:00 ليلاً', 'من 8:30 إلى 16:30', 'قبل غروب الشمس فقط'],
              ans: 1,
              exp: 'المادة 82 من ق.م.م 58.25 حظرت التبليغ قبل 7 صباحاً وبعد 10 ليلاً إلا بإذن قضائي معلل للضرورة.'
            }
          ]
        }
      ]
    },
    '2017': {
      date: 'الاختبار الكتابي: 9 يوليوز 2017',
      source: 'وزارة العدل - مجلة قانونك',
      subjects: [
        {
          id: '2017-1',
          title: 'التعويض المستحق للدائن في حالة تأخر المدين عن تنفيذ مبلغ مالي (الفصلان 263 و 264 ق.ل.ع)',
          field: 'قانون الالتزامات والعقود',
          duration: 'ساعتان (2h)',
          coefficient: 'معامل 2',
          problematique: 'ما هي الشروط الموضوعية والإجرائية لاستحقاق الدائن للتعويض عن تأخر المدين في الوفاء بمبلغ مالي، وكيف يحدد القانون نطاق هذا التعويض؟',
          planOutline: [
            {
              title: 'المطلب الأول: شروط استحقاق التعويض عن التأخر في تنفيذ الالتزام المالي',
              subpoints: [
                'الفقرة 1: حلول أجل الوفاء ووجود المدين في حالة مطل (الإنذار الرسمي بواسطة مفوض قضائي طبقاً للفصل 255 ق.ل.ع أو حلول الأجل الحتمي).',
                'الفقرة 2: ثبوت الضرر اللاحق بالدائن ورابطة السببية بين مطل المدين والضرر الحاصل.'
              ]
            },
            {
              title: 'المطلب الثاني: نطاق التعويض وسلطة القضاء التقديرية',
              subpoints: [
                'الفقرة 1: عناصر التعويض بموجب الفصل 264 (الخسارة التي لحقت الدائن والمصروفات الضرورية وما فاته من كسب).',
                'الفقرة 2: التمييز بين الفوائد التأخيرية القانونية والتعويض التكميلي عن سوء نية المدين ومماطلته.'
              ]
            }
          ],
          qcmQuestions: [
            {
              q: 'بماذا يتحقق مطل المدين في الالتزامات المالية كقاعدة عامة وفق الفصل 255 ق.ل.ع؟',
              options: ['تلقائياً بمرور سنة', 'بحلول الأجل المحدد أو بإنذار رسمي يوجهه الدائن للمدين', 'برفع دعوى في الموضوع فقط', 'بإشعار شفوي بحضور شاهدين'],
              ans: 1,
              exp: 'الفصل 255 ق.ل.ع يقرر تحقق المطل إما بحلول الأجل الصريح للالتزام أو بتوجيه إنذار رسمي صريح بالوفاء.'
            }
          ]
        },
        {
          id: '2017-2',
          title: 'إجراءات التنفيذ على المنقولات المادية',
          field: 'قانون المسطرة المدنية وقانون المفوضين القضائيين',
          duration: 'ساعتان (2h)',
          coefficient: 'معامل 2',
          problematique: 'كيف نظم المشرع المغربي مسطرة الحجز التنفيذي على المنقولات المادية، وما هي صلاحيات المفوض القضائي وضمانات المنفذ عليه؟',
          planOutline: [
            {
              title: 'المطلب الأول: الإجراءات التمهيدية ومسطرة إيقاع الحجز التنفيذي',
              subpoints: [
                'الفقرة 1: وجود سند تنفيذي واستيفاء شكليات التبليغ والإعذار بالوفاء الاختياري (المادة 485 من ق.م.م 58.25).',
                'الفقرة 2: انتقال المكلف بالتنفيذ (المفوض القضائي) وإحصاء المنقولات ووصفها بدقة، وتعيين الحارس القضائي عليها (المادتان 509 و 510).'
              ]
            },
            {
              title: 'المطلب الثاني: إجراءات الإشهار، البيع بالمزاد العلني، وتوزيع الحصيلة',
              subpoints: [
                'الفقرة 1: الإشهار القانوني، تحديد موعد ومكان المزاد في أقرب سوق عمومي أو منصة إلكترونية (المادة 513).',
                'الفقرة 2: رسو المزاد، استخلاص الثمن وإيداعه بصندوق المحكمة داخل 48 ساعة (المادة 35 من القانون 46.21)، وتوزيع الحصيلة بين الدائنين الحاجزين.'
              ]
            }
          ],
          qcmQuestions: [
            {
              q: 'ما هو الأجل الذي يمنحه المشرع لإجراء البيع بالمزاد للمنقولات المحجوزة بعد الحجز كأصل عام؟',
              options: ['في نفس يوم الحجز', 'في أجل أقصاه 8 أيام من تاريخ الحجز ما لم يتفق الأطراف على خلافه', 'بعد شهرين كاملين', 'بعد سنة من تاريخ الحجز'],
              ans: 1,
              exp: 'المادة 512 من ق.م.م 58.25 تنص على وقوع البيع في أجل أقصاه 8 أيام من تاريخ الحجز ما لم يتفق الدائن والمدين على تحديد أجل آخر.'
            }
          ]
        }
      ]
    }
  };

  const activeExam = examsData[selectedExamYear];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>أرشيف الاختبارات الكتابية الرسمية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            نماذج مواضيع مباريات المفوضين القضائيين
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            استعراض الأسئلة المطروحة رسمياً في دورات 2015 و2017، مع المنهجية القانونية المعتمدة للتصميم الثنائي، وتحويلها إلى أسئلة QCM تدريبية مركزة.
          </p>
        </div>

        {/* Year Selectors */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setSelectedExamYear('2015')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedExamYear === '2015'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            دورة 26 يوليوز 2015
          </button>
          <button
            onClick={() => setSelectedExamYear('2017')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedExamYear === '2017'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            دورة 9 يوليوز 2017
          </button>
        </div>
      </div>

      {/* Exam metadata */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-3">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>{activeExam.date}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>المصدر: {activeExam.source}</span>
        </span>
      </div>

      {/* Subjects Accordion / Cards */}
      <div className="space-y-6">
        {activeExam.subjects.map((subj, index) => {
          const isExpanded = expandedSubject === subj.id;

          return (
            <div
              key={subj.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div
                onClick={() => setExpandedSubject(isExpanded ? null : subj.id)}
                className="p-5 sm:p-6 cursor-pointer select-none bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      الموضوع {index + 1}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {subj.field}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      • {subj.duration} • {subj.coefficient}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    نص الموضوع: "{subj.title}"
                  </h3>
                </div>

                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-amber-600' : ''}`} />
              </div>

              {/* Body */}
              {isExpanded && (
                <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
                  {/* Problematic */}
                  <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>الإشكالية القانونية المطروحة:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {subj.problematique}
                    </p>
                  </div>

                  {/* Model Outline */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>التصميم القانوني الأكاديمي النموذجي (خطة البحث):</span>
                    </h4>

                    <div className="space-y-3">
                      {subj.planOutline.map((part, pIdx) => (
                        <div key={pIdx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                          <h5 className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">
                            {part.title}
                          </h5>
                          <ul className="space-y-1.5 pr-2">
                            {part.subpoints.map((sp, spIdx) => (
                              <li key={spIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{sp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive QCM questions on this topic */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>أسئلة تدريبية تفاعلية حول جزئيات هذا الموضوع:</span>
                    </h4>

                    <div className="space-y-3">
                      {subj.qcmQuestions.map((item, qIdx) => (
                        <div key={qIdx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                            {item.q}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {item.options.map((opt, oIdx) => {
                              const isCorrect = oIdx === item.ans;
                              return (
                                <div
                                  key={oIdx}
                                  className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                                    isCorrect
                                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 font-bold'
                                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                    isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                                  }`}>
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg leading-relaxed">
                            <span className="font-bold text-amber-600">التعليل: </span>
                            {item.exp}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
