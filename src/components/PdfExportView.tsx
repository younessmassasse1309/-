import React, { useState } from 'react';
import { questionsBank } from '../data/legalQuestions';
import { mindMapSections } from '../data/mindMapData';
import { goldenNumbers } from '../data/goldenNumbers';
import { 
  Printer, 
  ArrowRight, 
  CheckSquare, 
  Square, 
  FileText, 
  Scale, 
  BookOpen, 
  Hash, 
  GraduationCap, 
  HelpCircle,
  Sparkles,
  Info,
  Download,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface PdfExportViewProps {
  onBack: () => void;
}

export const PdfExportView: React.FC<PdfExportViewProps> = ({ onBack }) => {
  const [includeCover, setIncludeCover] = useState(true);
  const [includeMissions, setIncludeMissions] = useState(true);
  const [includeMindMap, setIncludeMindMap] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [includePreviousExams, setIncludePreviousExams] = useState(true);
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // 1. Direct Client-side PDF File Generation & Download (.pdf)
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setStatusMessage('جاري تحضير وتوليد ملف PDF... يرجى الانتظار بضع لحظات');

    try {
      const element = document.getElementById('printable-booklet');
      if (!element) {
        throw new Error('لم يتم العثور على محتوى الكتيب. جاري إعادة المحاولة...');
      }

      // Safe retrieval of html2pdf library function
      const html2pdfLib = typeof html2pdf === 'function' ? html2pdf : (html2pdf as any)?.default || (window as any).html2pdf;
      if (!html2pdfLib) {
        throw new Error('مكتبة PDF غير متاحة، سيتم التبديل إلى الطباعة المباشرة');
      }

      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: 'دليل_المفوض_القضائي_Pro.pdf',
        image: { type: 'jpeg' as const, quality: 0.95 },
        html2canvas: { 
          scale: 1.15, 
          useCORS: true, 
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as const 
        },
        pagebreak: { 
          mode: ['css', 'legacy'] 
        }
      };

      await html2pdfLib().set(opt).from(element).save();
      setStatusMessage('تم تنزيل ملف PDF بنجاح إلى جهازك!');
      setTimeout(() => setStatusMessage(''), 6000);
    } catch (err) {
      console.error('PDF generation error:', err);
      setStatusMessage('جاري استخدام محرك الطباعة والحفظ الفوري كـ PDF كخيار بديل موثوق...');
      // Fallback to print engine
      setTimeout(() => {
        handlePrint();
      }, 500);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. Standalone HTML Offline Document Download (works 100% in any browser without limits)
  const handleDownloadHtmlDocument = () => {
    const element = document.getElementById('printable-booklet');
    if (!element) {
      setStatusMessage('تعذر العثور على عنصر المحتوى');
      return;
    }

    const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>دليل المفوض Pro - الكتيب الشامل للمباراة</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 24px;
      direction: rtl;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    @media print {
      @page { size: A4; margin: 12mm 15mm; }
      body { background: #fff; padding: 0; }
      .container { box-shadow: none; padding: 0; border: none; max-width: 100%; }
      .page-break-before { page-break-before: always; break-before: page; }
      .page-break-avoid { page-break-inside: avoid; break-inside: avoid; }
      .no-print { display: none !important; }
    }
    .print-bar {
      margin-bottom: 20px;
      text-align: center;
      background: #f1f5f9;
      padding: 12px;
      border-radius: 12px;
    }
    .print-btn {
      background: #d97706;
      color: #fff;
      border: none;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      font-family: inherit;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <button class="print-btn" onclick="window.print()">🖨️ طباعة أو حفظ كـ PDF الآن (Ctrl + P)</button>
  </div>
  <div class="container">
    ${element.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'كتيب_دليل_المفوض_القضائي_الشامل.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage('تم تنزيل النسخة المستقلة بنجاح! يمكنك فتحها في أي متصفح وحفظها كـ PDF');
    setTimeout(() => setStatusMessage(''), 5000);
  };

  // 3. Ultra-Crisp Native Print to PDF (isolated iframe vector engine)
  const handlePrint = () => {
    try {
      const element = document.getElementById('printable-booklet');
      if (!element) {
        window.print();
        return;
      }

      // Check or create isolated printing iframe to prevent printing application shell
      let iframe = document.getElementById('print-isolation-frame') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'print-isolation-frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.zIndex = '-999';
        document.body.appendChild(iframe);
      }

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        return;
      }

      doc.open();
      doc.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>دليل المفوض Pro - الكتيب المرجعي الشامل</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 10mm;
      background: #ffffff;
      color: #0f172a;
      direction: rtl;
    }
    @page {
      size: A4;
      margin: 12mm 15mm;
    }
    .page-break-before {
      page-break-before: always;
      break-before: page;
    }
    .page-break-avoid {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #cbd5e1; padding: 7px; text-align: right; }
    th { background: #0f172a; color: #ffffff; }
    /* Essential layout helpers */
    .border { border: 1px solid #e2e8f0; }
    .border-2 { border: 2px solid; }
    .border-4 { border: 4px solid; }
    .border-double { border-style: double; }
    .rounded-xl { border-radius: 0.75rem; }
    .rounded-2xl { border-radius: 1rem; }
    .rounded-3xl { border-radius: 1.5rem; }
    .bg-white { background-color: #ffffff; }
    .bg-slate-50 { background-color: #f8fafc; }
    .bg-amber-50 { background-color: #fffbeb; }
    .bg-emerald-50 { background-color: #ecfdf5; }
    .text-slate-900 { color: #0f172a; }
    .text-slate-800 { color: #1e293b; }
    .text-slate-700 { color: #334155; }
    .text-slate-600 { color: #475569; }
    .text-slate-500 { color: #64748b; }
    .text-amber-700 { color: #b45309; }
    .text-amber-800 { color: #92400e; }
    .text-amber-900 { color: #78350f; }
    .font-bold { font-weight: 700; }
    .font-black { font-weight: 900; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
  </style>
</head>
<body>
  ${element.innerHTML}
</body>
</html>`);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          window.print();
        }
      }, 400);
    } catch (e) {
      console.warn('Iframe print error, falling back to window.print():', e);
      window.print();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Control Action Toolbar - Hidden during print */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="رجوع"
            >
              <ArrowRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span>كتيب المراجعة الشامل جاهز للتحميل والطباعة كـ PDF</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                اختر الصيغة المناسبة: حفظ كـ PDF فوري، أو تحميل مباشر لملف PDF، أو نسخة أوفلاين
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Primary Action 1: Instant Native Print & Save as PDF (Best Vector Quality) */}
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-black rounded-xl shadow-md shadow-amber-600/30 text-xs flex items-center gap-2 transition-all cursor-pointer"
              title="يفتح نافذة الطباعة لاختيار حفظ بتنسيق PDF بجودة فيكتور فائقة الوضوح"
            >
              <Printer className="w-4 h-4" />
              <span>حفظ كـ PDF / طباعة فورية</span>
            </button>

            {/* Primary Action 2: Direct Client-side .pdf file download */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-800 dark:border-slate-700"
              title="توليد وتنزيل ملف .pdf مباشرة إلى جهازك"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>جاري التوليد...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>تنزيل ملف PDF (.pdf)</span>
                </>
              )}
            </button>

            {/* Offline HTML Backup */}
            <button
              onClick={handleDownloadHtmlDocument}
              className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
              title="تنزيل نسخة HTML للفتح والطباعة من أي متصفح خارج التطبيق بدون إنترنت"
            >
              <FileCode className="w-4 h-4 text-amber-600" />
              <span>نسخة HTML أوفلاين</span>
            </button>
          </div>
        </div>

        {/* Status Notification Message */}
        {statusMessage && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Section toggles & Quick Presets */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              الأقسام المضمنة في ملف الـ PDF:
            </span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setIncludeCover(true);
                  setIncludeMissions(true);
                  setIncludeMindMap(true);
                  setIncludeNumbers(true);
                  setIncludeQuestions(true);
                  setIncludePreviousExams(true);
                }}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold"
              >
                تحديد الكل (الكتيب كاملاً)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIncludeCover(false);
                  setIncludeMissions(true);
                  setIncludeMindMap(false);
                  setIncludeNumbers(false);
                  setIncludeQuestions(false);
                  setIncludePreviousExams(false);
                }}
                className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-semibold"
              >
                دليل المهام فقط
              </button>
              <button
                type="button"
                onClick={() => {
                  setIncludeCover(false);
                  setIncludeMissions(false);
                  setIncludeMindMap(false);
                  setIncludeNumbers(true);
                  setIncludeQuestions(false);
                  setIncludePreviousExams(false);
                }}
                className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-semibold"
              >
                الأرقام والآجال فقط
              </button>
              <button
                type="button"
                onClick={() => {
                  setIncludeCover(false);
                  setIncludeMissions(false);
                  setIncludeMindMap(false);
                  setIncludeNumbers(false);
                  setIncludeQuestions(true);
                  setIncludePreviousExams(false);
                }}
                className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-semibold"
              >
                بنك QCM فقط
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includeCover} 
                onChange={(e) => setIncludeCover(e.target.checked)} 
                className="w-4 h-4 text-amber-600 rounded-sm"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">الغلاف والفهرس</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includeMissions} 
                onChange={(e) => setIncludeMissions(e.target.checked)} 
                className="w-4 h-4 text-amber-600 rounded-sm"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">دليل المهام</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includeMindMap} 
                onChange={(e) => setIncludeMindMap(e.target.checked)} 
                className="w-4 h-4 text-amber-600 rounded-sm"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">الخريطة 46.21</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includeNumbers} 
                onChange={(e) => setIncludeNumbers(e.target.checked)} 
                className="w-4 h-4 text-amber-600 rounded-sm"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">الأرقام والآجال</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includeQuestions} 
                onChange={(e) => setIncludeQuestions(e.target.checked)} 
                className="w-4 h-4 text-amber-600 rounded-sm"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">بنك QCM (60 س)</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includePreviousExams} 
                onChange={(e) => setIncludePreviousExams(e.target.checked)} 
                className="w-4 h-4 text-amber-600 rounded-sm"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">المباريات السابقة</span>
            </label>
          </div>
        </div>

        {/* Browser instructions note */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>نصيحة لحفظ الملف كـ PDF:</strong> عند النقر على الزر بالأعلى، ستفتح نافذة الطباعة الخاصة بمتصفحك؛ اختر من قائمة <em>الوجهة (Destination)</em> خيار <strong>«حفظ بتنسيق PDF» (Save as PDF)</strong>، وتأكد من تفعيل خيار <em>رسومات الخلفية (Background graphics)</em> ليتم تنزيل الكتيب كاملاً بألوانه وترويساته الرسمية.
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRINTABLE DOCUMENT CONTAINER (Booklet Layout)
         ========================================================================= */}
      <div id="printable-booklet" className="bg-white text-slate-900 p-6 sm:p-12 rounded-3xl shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto space-y-12">
        
        {/* 1. COVER PAGE */}
        {includeCover && (
          <div className="page-break-avoid border-4 border-double border-slate-800 p-8 sm:p-12 text-center rounded-2xl space-y-8 my-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-700 tracking-widest uppercase">
                المملكة المغربية • وزارة العدل
              </div>
              <div className="text-xs text-slate-500 font-serif">
                مباراة ولوج مهنة المفوضين القضائيين
              </div>
            </div>

            <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg my-6">
              <Scale className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                دليل المفوض Pro
              </h1>
              <h2 className="text-lg sm:text-xl font-bold text-amber-700">
                الكتيب المرجعي الشامل للاستعداد والنجاح في المباراة
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
                ملخص القوانين المعتمدة، الخرائط الذهنية، معجم الآجال والأرقام الذهبية، بنك الأسئلة المتعددة الاختيارات (QCM) مع التعليل والتأصيل القانوني، ونماذج الاختبارات السابقة.
              </p>
            </div>

            {/* Legal References Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 border-t border-slate-200 text-right text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold block text-slate-900">القانون 46.21</span>
                <span className="text-[10px] text-slate-500 block">ظهير 1.25.49 (2025)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold block text-slate-900">المرسوم 2.25.885</span>
                <span className="text-[10px] text-slate-500 block">ج.ر 7506 (2026)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold block text-slate-900">المسطرة المدنية 58.25</span>
                <span className="text-[10px] text-slate-500 block">ج.ر 7485 (2026)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold block text-slate-900">تحصيل الديون 15.97</span>
                <span className="text-[10px] text-slate-500 block">محينة (2024)</span>
              </div>
            </div>

            <div className="pt-4 text-[11px] text-slate-400 font-mono">
              صيغة محينة للطباعة والتصدير • جميع الآجال الواردة آجال كاملة (المادة 169)
            </div>
          </div>
        )}

        {/* 2. TABLE OF CONTENTS / SUMMARY */}
        {includeCover && (
          <div className="page-break-before border border-slate-200 p-6 rounded-2xl bg-slate-50 space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-300 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>فهرس المحتويات الرئيسية للكتيب</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <li className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                <span className="font-bold">1. الدليل الموجز لمهام واختصاصات المفوض القضائي</span>
                <span className="text-slate-400">القسم الأول</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                <span className="font-bold">2. المخطط الذهني الشامل لمحاور القانون 46.21</span>
                <span className="text-slate-400">القسم الثاني</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                <span className="font-bold">3. معجم الآجال والأرقام والنسب الذهبية للحفظ</span>
                <span className="text-slate-400">القسم الثالث</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                <span className="font-bold">4. بنك أسئلة QCM الشامل مع التعليلات الرسمية</span>
                <span className="text-slate-400">القسم الرابع</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                <span className="font-bold">5. نماذج المباريات السابقة (2015 و2017) والمنهجية</span>
                <span className="text-slate-400">القسم الخامس</span>
              </li>
            </ul>
          </div>
        )}

        {/* 3. MISSIONS SUMMARY SECTION */}
        {includeMissions && (
          <div className="page-break-before space-y-6">
            <div className="border-b-2 border-amber-600 pb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">القسم الأول</span>
              <h2 className="text-xl font-black text-slate-950">
                الدليل الموجز والشامل لمهام واختصاصات المفوض القضائي
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                تأصيل تركيبي استناداً إلى القانون 46.21، القانون 15.97، قانون المسطرة المدنية 58.25، والمرسوم 2.25.885
              </p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              {/* Mission 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 page-break-avoid">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <span>مهام التبليغ والإشعار (المادة 43 من القانون 46.21 + المواد 82-87 من ق.م.م 58.25)</span>
                </h4>
                <p className="text-slate-700">
                  • تبليغ المقالات والعرائض والمذكرات والاستدعاءات الصادرة عن مختلف المحاكم والإدارات والمؤسسات العمومية.<br/>
                  • تبليغ الإشعارات والإنذارات بطلب مباشر من المعني بالأمر دون حاجة لدعوى مسبقة.<br/>
                  • <strong>الضوابط الحاسمة:</strong> التبليغ بين 7:00 صباحاً و 22:00 ليلاً، إرجاع شهادة التسليم قبل الجلسة بـ 3 أيام على الأقل (م 49)، واعتبار التبليغ صحيحاً ومنتجاً لآثاره في اليوم العاشر من رفض الاستلام (م 85 من ق.م.م 58.25).
                </p>
              </div>

              {/* Mission 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 page-break-avoid">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                  <span>مهام التنفيذ الجبري والمدني (المادتان 43 و 44 من القانون 46.21)</span>
                </h4>
                <p className="text-slate-700">
                  • تبليغ وتنفيذ المقررات القضائية والسندات التنفيذية وإيقاع الحجوز والرجوع إلى القضاء عند وجود أي صعوبة.<br/>
                  • <strong>إيداع الأموال:</strong> وجوب وضع المبالغ والقيم المتحصلة بصندوق المحكمة داخل أجل لا يتعدى <strong>48 ساعة</strong> (المادة 35).<br/>
                  • <strong>الإفراغات والبيوع العقارية (المادة 44):</strong> اختصاص مقيد يستلزم قضاء 5 سنوات على الأقل من الممارسة الفعلية + عدم التعرض لعقوبة الإيقاف + إذن مسبق من وزير العدل يسحب وجوباً عند عقوبة الإيقاف.<br/>
                  • <strong>القوة العمومية:</strong> الاستعانة بها مشروطة بالحصول على إذن كتابي من وكيل الملك المختص (المادة 52).
                </p>
              </div>

              {/* Mission 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 page-break-avoid">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                  <span>تحصيل الديون العمومية والخاصة (المادة 34 من القانون 15.97 والمادة 43 من القانون 46.21)</span>
                </h4>
                <p className="text-slate-700">
                  • <strong>التحصيل الجبري للديون العمومية:</strong> يباشر المفوض القضائي إجراءات التحصيل الجبري للضرائب والرسوم في جميع درجاته (الإنذار، الحجز، البيع بالمزاد) بطلب من المحاسب وسند تنفيذي.<br/>
                  • <strong>موانع الحجز (المادة 46 من القانون 15.97):</strong> منع حجز السكنى الرئيسية العائلية حتى 200.000 درهم، فراش النوم، أدوات المهنة، ومؤونة شهر.<br/>
                  • <strong>جزاء العزل:</strong> منع المفوض من اقتناء أي شيء من المحجوزات لنفسه أو للغير تحت طائلة العزل (المادة 64 ق 15.97).<br/>
                  • التحصيل الودي للديون الخاصة الحالة الأداء بمقتضى سند تنفيذي مقابل تسليم وصل قانوني.
                </p>
              </div>

              {/* Mission 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 page-break-avoid">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
                  <span>المعاينات المادية، عروض الوفاء، والمهام الخاصة (المادة 43)</span>
                </h4>
                <p className="text-slate-700">
                  • <strong>المعاينات المادية:</strong> يجب أن تكون مجردة من كل رأي، بأمر قضائي أو بطلب مباشر من المعني بالأمر.<br/>
                  • <strong>عروض الوفاء والإيداع:</strong> بأمر قضائي أو بطلب مباشر، وإيداع المبالغ بصندوق المحكمة داخل 15 يوماً من رفض الدائن.<br/>
                  • <strong>مهام مشروطة بأمر قضائي حصراً:</strong> إنجاز محاضر الاستجواب ومحاضر حضور الجموع العامة للشركات والجمعيات.<br/>
                  • <strong>البيوع بالمزاد العلني:</strong> إنجاز المحاضر، مع وجوب ارتداء البذلة المهنية أثناء المزاد (المادة 22 من المرسوم 2.25.885).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. MIND MAP SUMMARY */}
        {includeMindMap && (
          <div className="page-break-before space-y-6">
            <div className="border-b-2 border-amber-600 pb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">القسم الثاني</span>
              <h2 className="text-xl font-black text-slate-950">
                المخطط الذهني الشامل لمحاور القانون رقم 46.21
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                استعراض المحاور الـ 15 المنظمة للمهنة مع القواعد الذهبية لكل محور
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {mindMapSections.map((sec) => (
                <div key={sec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 page-break-avoid">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-black text-amber-700">المحور {sec.number}: {sec.title}</span>
                    <span className="text-[10px] font-bold text-slate-500">{sec.articles}</span>
                  </div>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    {sec.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  {sec.vitalRule && (
                    <div className="pt-2 border-t border-slate-200 text-[10px] font-bold text-amber-900 bg-amber-50/70 p-1.5 rounded-md">
                      قاعدة ذهبية: {sec.vitalRule}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. GOLDEN NUMBERS & DEADLINES */}
        {includeNumbers && (
          <div className="page-break-before space-y-6">
            <div className="border-b-2 border-amber-600 pb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">القسم الثالث</span>
              <h2 className="text-xl font-black text-slate-950">
                معجم الآجال والأرقام والنسب الذهبية للحفظ السريع
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                المدد والسنوات والنسب والسقوف المالية التي تتكرر باستمرار في أسئلة المباراة
              </p>
            </div>

            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-2.5 border border-slate-800">الرقم / الأجل</th>
                  <th className="p-2.5 border border-slate-800">الدلالة القانونية والتطبيق</th>
                  <th className="p-2.5 border border-slate-800">المادة والسند الرسمي</th>
                </tr>
              </thead>
              <tbody>
                {goldenNumbers.map((gn, idx) => (
                  <tr key={gn.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-2.5 border border-slate-200 font-black text-amber-700 whitespace-nowrap">
                      {gn.number} {gn.unit}
                    </td>
                    <td className="p-2.5 border border-slate-200 text-slate-800 leading-relaxed">
                      <strong>{gn.label}:</strong> {gn.explanation}
                    </td>
                    <td className="p-2.5 border border-slate-200 text-slate-500 whitespace-nowrap text-[11px]">
                      {gn.articleRef} ({gn.lawName})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. COMPLETE QUESTION BANK (QCM) */}
        {includeQuestions && (
          <div className="page-break-before space-y-6">
            <div className="border-b-2 border-amber-600 pb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">القسم الرابع</span>
              <h2 className="text-xl font-black text-slate-950">
                بنك أسئلة QCM الشامل مع عناصر الإجابة والتأصيل القانوني ({questionsBank.length} سؤالاً)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                أسئلة اختبارية مع الإجابة الصحيحة وشرح السند من الجريدة الرسمية لكل سؤال
              </p>
            </div>

            <div className="space-y-4">
              {questionsBank.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 page-break-avoid text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-amber-800">السؤال {idx + 1}: {q.categoryTitle}</span>
                    <span className="font-semibold text-slate-500 text-[11px]">{q.legalReference}</span>
                  </div>

                  <p className="font-bold text-slate-950 text-xs sm:text-sm leading-relaxed">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctIndex;
                      return (
                        <div 
                          key={optIdx} 
                          className={`p-2 rounded-lg border text-[11px] flex items-center gap-2 ${
                            isCorrect 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' 
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-black ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isCorrect && <span className="text-[10px] text-emerald-700 font-black">✓ (صحيح)</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-slate-800 leading-relaxed">
                    <strong className="text-amber-800">التعليل القانوني: </strong>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. PREVIOUS WRITTEN EXAMS & METHODOLOGY */}
        {includePreviousExams && (
          <div className="page-break-before space-y-6">
            <div className="border-b-2 border-amber-600 pb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">القسم الخامس</span>
              <h2 className="text-xl font-black text-slate-950">
                نماذج المباريات السابقة والتصاميم القانونية المعتمدة
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                عناصر الإجابة لمواضيع دورات 2015 و 2017 المنشورة بمجلة قانونك
              </p>
            </div>

            <div className="space-y-5 text-xs">
              {/* 2015 Subjects */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 page-break-avoid">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    مباراة 26 يوليوز 2015 - الموضوع 1: بطلان الالتزامات وإبطالها (ق.ل.ع)
                  </h3>
                  <span className="text-slate-500 text-[11px]">ساعتان • معامل 2</span>
                </div>
                <div className="space-y-1.5 text-slate-700">
                  <p><strong>الإشكالية:</strong> التمييز بين البطلان المطلق والقابلية للإبطال من حيث الأسباب، الآثار، والإجازة والتقادم.</p>
                  <p><strong>التصميم النموذجي:</strong></p>
                  <ul className="pr-4 space-y-1 text-slate-600">
                    <li>• المطلب الأول: أسباب البطلان والإبطال (الفصل 306 ق.ل.ع لانعدام ركن جوهري مقابل الفصل 311 لعيب الرضا ونقص الأهلية).</li>
                    <li>• المطلب الثاني: الآثار القانونية وقواعد الإجازة والتقادم (البطلان لا يجاز ولا يتقادم بمرور الزمن؛ الإبطال يجاز ويتقادم بسنة واحدة).</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 page-break-avoid">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    مباراة 26 يوليوز 2015 - الموضوع 2: طرق التبليغ القضائي (المسطرة المدنية)
                  </h3>
                  <span className="text-slate-500 text-[11px]">ساعتان • معامل 2</span>
                </div>
                <div className="space-y-1.5 text-slate-700">
                  <p><strong>الإشكالية:</strong> الآليات الإجرائية لتبليغ الاستدعاءات والأحكام وحجية شهادة التسليم ودور المفوض القضائي.</p>
                  <p><strong>التصميم النموذجي:</strong></p>
                  <ul className="pr-4 space-y-1 text-slate-600">
                    <li>• المطلب الأول: قنوات التبليغ (المفوض القضائي كأصل عام، التبليغ الإداري، والتبليغ الإلكتروني في ق.م.م 58.25).</li>
                    <li>• المطلب الثاني: شكليات شهادة التسليم والآثار المترتبة على رفض الاستلام وسريان الميعاد في اليوم العاشر.</li>
                  </ul>
                </div>
              </div>

              {/* 2017 Subjects */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 page-break-avoid">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    مباراة 9 يوليوز 2017 - الموضوع 1: التعويض عن تأخر تنفيذ التزام مالي (ف 263 و 264 ق.ل.ع)
                  </h3>
                  <span className="text-slate-500 text-[11px]">ساعتان • معامل 2</span>
                </div>
                <div className="space-y-1.5 text-slate-700">
                  <p><strong>الإشكالية:</strong> شروط استحقاق الدائن للتعويض عن تأخر المدين في الوفاء بمبلغ مالي ومشتملات الضرر.</p>
                  <p><strong>التصميم النموذجي:</strong></p>
                  <ul className="pr-4 space-y-1 text-slate-600">
                    <li>• المطلب الأول: شروط استحقاق التعويض (حلول الأجل، مطل المدين بإعذار رسمي بواسطة مفوض قضائي، ورابطة السببية).</li>
                    <li>• المطلب الثاني: عناصر التعويض بموجب الفصل 264 (الخسارة الواقعة وما فات من كسب والفوائد التأخيرية القانونية).</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 page-break-avoid">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    مباراة 9 يوليوز 2017 - الموضوع 2: إجراءات التنفيذ على المنقولات المادية
                  </h3>
                  <span className="text-slate-500 text-[11px]">ساعتان • معامل 2</span>
                </div>
                <div className="space-y-1.5 text-slate-700">
                  <p><strong>الإشكالية:</strong> مسطرة الحجز التنفيذي للمنقولات، حراستها، وبيعها بالمزاد العلني وإيداع الحصيلة.</p>
                  <p><strong>التصميم النموذجي:</strong></p>
                  <ul className="pr-4 space-y-1 text-slate-600">
                    <li>• المطلب الأول: الإعذار بالوفاء الاختياري وإيقاع الحجز وتعيين الحارس القضائي بموجب ق.م.م 58.25.</li>
                    <li>• المطلب الثاني: الإشهار القانوني، البيع بالمزاد العلني، وإيداع الأموال بصندوق المحكمة خلال 48 ساعة وتوزيع الحصيلة.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer info of the printable sheet */}
        <div className="pt-8 border-t border-slate-300 text-center text-slate-500 text-xs page-break-avoid">
          <p className="font-bold text-slate-800">
            تم إعداد هذا الكتيب اعتماداً على الوثائق والمصادر الرسمية الصادرة بالجريدة الرسمية للمملكة المغربية
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            دليل المفوض Pro • منصة المراجعة لمباراة المفوضين القضائيين
          </p>
        </div>

      </div>
    </div>
  );
};
