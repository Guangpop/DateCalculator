import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format, add, sub, intervalToDuration, isValid, parseISO } from 'date-fns';
import { zhTW, enUS, ja as jaLocale } from 'date-fns/locale';
import { Solar } from 'lunar-javascript';
import { Calendar as CalendarIcon, Plus, Minus, ArrowRight, CalendarPlus, Download, ExternalLink, CalendarDays, ArrowLeftRight, AlertCircle, Moon, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import {
  I18nContext,
  useI18n,
  translations,
  localeNames,
  localeHtmlLang,
  localePaths,
  pathToLocale,
  type Locale,
} from './i18n';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'add-sub' | 'diff';
type Operation = 'add' | 'sub';

const BASE_URL = 'https://datecalculator.shinlink.com.tw';

const dateFnsLocales = {
  'zh-Hant': zhTW,
  'en': enUS,
  'ja': jaLocale,
};

export default function App() {
  const location = useLocation();
  const locale = pathToLocale(location.pathname);
  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t }}>
      <SeoHead />
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <AppContent />
        </div>
      </div>
    </I18nContext.Provider>
  );
}

function SeoHead() {
  const { locale, t } = useI18n();
  const htmlLang = localeHtmlLang[locale];
  const canonicalUrl = `${BASE_URL}${localePaths[locale]}`;

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{t.siteTitle}</title>
      <meta name="description" content={t.metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t.ogTitle} />
      <meta property="og:description" content={t.ogDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="SHINLINK" />
      <meta property="og:locale" content={htmlLang.replace('-', '_')} />

      {/* hreflang */}
      <link rel="alternate" hrefLang="zh-Hant" href={`${BASE_URL}/`} />
      <link rel="alternate" hrefLang="en" href={`${BASE_URL}/en/`} />
      <link rel="alternate" hrefLang="ja" href={`${BASE_URL}/ja/`} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/`} />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: t.jsonLdName,
          operatingSystem: 'Web',
          applicationCategory: 'UtilitiesApplication',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: t.jsonLdCurrency,
          },
        })}
      </script>
    </Helmet>
  );
}

function LanguageSwitcher() {
  const { locale } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSwitch = (target: Locale) => {
    setOpen(false);
    navigate(localePaths[target]);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{localeNames[locale]}</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-stone-200 z-20 overflow-hidden min-w-[140px]"
            >
              {(Object.keys(localeNames) as Locale[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleSwitch(loc)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                    loc === locale
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-stone-600 hover:bg-stone-50'
                  )}
                >
                  {localeNames[loc]}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function AppContent() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>('add-sub');

  return (
    <>
      {/* Header */}
      <header className="mb-10 text-center relative">
        <div className="absolute right-0 top-0">
          <LanguageSwitcher />
        </div>
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-stone-200 mb-4">
          <CalendarIcon className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 mb-3">
          {t.appTitle}
        </h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto">
          {t.appDescription}
        </p>
      </header>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-stone-100 p-2 gap-2 bg-stone-50/50">
          <button
            onClick={() => setActiveTab('add-sub')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200',
              activeTab === 'add-sub'
                ? 'bg-white text-indigo-700 shadow-sm border border-stone-200/60'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
            )}
          >
            <CalendarDays className="w-4 h-4" />
            {t.tabAddSub}
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200',
              activeTab === 'diff'
                ? 'bg-white text-indigo-700 shadow-sm border border-stone-200/60'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
            )}
          >
            <ArrowLeftRight className="w-4 h-4" />
            {t.tabDiff}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'add-sub' ? (
              <AddSubCalculator key="add-sub" />
            ) : (
              <DiffCalculator key="diff" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SEO Content Section */}
      <SeoContent />
    </>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700"
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
}

const s2t: Record<string, string> = {
  '龙': '龍',
  '马': '馬',
  '鸡': '雞',
  '猪': '豬',
  '闰': '閏',
  '腊': '臘',
};

function toTraditional(str: string): string {
  return str
    .split('')
    .map((char) => s2t[char] || char)
    .join('');
}

function LunarInfo({ date, className }: { date: Date; className?: string }) {
  const { locale } = useI18n();

  // Only show lunar calendar for Chinese and Japanese
  if (locale === 'en') return null;

  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  const lunarMonth = toTraditional(lunar.getMonthInChinese());
  const lunarDay = toTraditional(lunar.getDayInChinese());
  const shengXiao = toTraditional(lunar.getYearShengXiao());

  const lunarStr = `農曆 ${lunarMonth}月${lunarDay}`;
  const yearStr = `${lunar.getYearInGanZhi()}${shengXiao}年`;

  return (
    <div className={cn('flex items-center gap-2 text-stone-500 text-sm font-medium', className)}>
      <Moon className="w-4 h-4 text-amber-500 fill-amber-500/10" />
      <span>{yearStr}</span>
      <span className="w-1 h-1 rounded-full bg-stone-300" />
      <span>{lunarStr}</span>
    </div>
  );
}

function useDateFnsLocale() {
  const { locale } = useI18n();
  return dateFnsLocales[locale];
}

function AddSubCalculator() {
  const { t } = useI18n();
  const dfLocale = useDateFnsLocale();
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [operation, setOperation] = useState<Operation>('add');
  const [years, setYears] = useState<number | ''>('');
  const [months, setMonths] = useState<number | ''>('');
  const [weeks, setWeeks] = useState<number | ''>('');
  const [days, setDays] = useState<number | ''>('');

  const parsedStartDate = useMemo(() => parseISO(startDate), [startDate]);
  const isValidDate = isValid(parsedStartDate);

  const resultDate = useMemo(() => {
    if (!isValidDate) return null;

    const duration = {
      years: Number(years) || 0,
      months: Number(months) || 0,
      weeks: Number(weeks) || 0,
      days: Number(days) || 0,
    };

    if (operation === 'add') {
      return add(parsedStartDate, duration);
    } else {
      return sub(parsedStartDate, duration);
    }
  }, [parsedStartDate, isValidDate, operation, years, months, weeks, days]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      {/* Inputs Section */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Start Date */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wider">
              {t.startDate}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={cn(
                'w-full px-5 py-4 rounded-2xl border transition-all outline-none text-stone-900 text-lg shadow-sm',
                !isValidDate && startDate !== ''
                  ? 'border-red-300 bg-red-50 focus:ring-red-500/10 focus:border-red-500'
                  : 'border-stone-200 bg-stone-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500'
              )}
            />
            {isValidDate && <LunarInfo date={parsedStartDate} className="mt-1 ml-1" />}
          </div>

          {/* Operation Toggle */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wider">
              {t.operation}
            </label>
            <div className="relative flex bg-stone-100 p-1.5 rounded-full border border-stone-200 w-full h-[60px]">
              <motion.div
                className="absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-md border border-stone-200/50"
                initial={false}
                animate={{
                  left: operation === 'add' ? '6px' : '50%',
                  right: operation === 'add' ? '50%' : '6px',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
              <button
                onClick={() => setOperation('add')}
                className={cn(
                  'relative z-10 flex-1 rounded-full text-base font-bold transition-colors duration-300',
                  operation === 'add' ? 'text-indigo-700' : 'text-stone-500 hover:text-stone-700'
                )}
              >
                {t.operationAdd}
              </button>
              <button
                onClick={() => setOperation('sub')}
                className={cn(
                  'relative z-10 flex-1 rounded-full text-base font-bold transition-colors duration-300',
                  operation === 'sub' ? 'text-indigo-700' : 'text-stone-500 hover:text-stone-700'
                )}
              >
                {t.operationSub}
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isValidDate && startDate !== '' && <ErrorMessage message={t.invalidDateFormat} />}

      {/* Duration Inputs */}
      <div className="space-y-4 pt-4">
        <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wider">
          {operation === 'add' ? t.durationLabelAdd : t.durationLabelSub}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <DurationInput label={t.unitYear} value={years} onChange={setYears} />
          <DurationInput label={t.unitMonth} value={months} onChange={setMonths} />
          <DurationInput label={t.unitWeek} value={weeks} onChange={setWeeks} />
          <DurationInput label={t.unitDay} value={days} onChange={setDays} />
        </div>
      </div>

      {/* Result Section */}
      {resultDate && (
        <div className="mt-8 pt-8 border-t border-stone-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-indigo-600/80 mb-1 uppercase tracking-wider">
                {t.result}
              </p>
              <div className="flex flex-wrap items-baseline gap-3 justify-center md:justify-start">
                <span className="text-3xl md:text-4xl font-semibold text-indigo-950 tracking-tight">
                  {format(resultDate, 'yyyy年 MM月 dd日')}
                </span>
                <span className="text-xl text-indigo-700/70 font-medium">
                  {format(resultDate, 'EEEE', { locale: dfLocale })}
                </span>
              </div>
              <LunarInfo date={resultDate} className="mt-2" />
            </div>

            <ReminderActions date={resultDate} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function DiffCalculator() {
  const { t } = useI18n();
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(add(new Date(), { days: 30 }), 'yyyy-MM-dd'));

  const parsedStart = useMemo(() => parseISO(startDate), [startDate]);
  const parsedEnd = useMemo(() => parseISO(endDate), [endDate]);
  const isValidDates = isValid(parsedStart) && isValid(parsedEnd);

  const result = useMemo(() => {
    if (!isValidDates) return null;

    const start = parsedStart < parsedEnd ? parsedStart : parsedEnd;
    const end = parsedStart < parsedEnd ? parsedEnd : parsedStart;
    const isNegative = parsedStart > parsedEnd;

    const totalDays = Math.abs((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const duration = intervalToDuration({ start, end });

    return { totalDays, duration, isNegative };
  }, [parsedStart, parsedEnd, isValidDates]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Inputs Section */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wider">
            {t.startDate}
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={cn(
              'w-full px-4 py-3 rounded-xl border transition-all outline-none text-stone-900',
              !isValid(parsedStart) && startDate !== ''
                ? 'border-red-300 bg-red-50 focus:ring-red-500/10 focus:border-red-500'
                : 'border-stone-200 bg-stone-50 focus:bg-white focus:ring-indigo-500/20 focus:border-indigo-500'
            )}
          />
          {isValid(parsedStart) && <LunarInfo date={parsedStart} className="mt-1 ml-1" />}
        </div>

        <div className="hidden md:flex justify-center pt-6">
          <ArrowRight className="w-5 h-5 text-stone-300" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wider">
            {t.endDate}
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={cn(
              'w-full px-4 py-3 rounded-xl border transition-all outline-none text-stone-900',
              !isValid(parsedEnd) && endDate !== ''
                ? 'border-red-300 bg-red-50 focus:ring-red-500/10 focus:border-red-500'
                : 'border-stone-200 bg-stone-50 focus:bg-white focus:ring-indigo-500/20 focus:border-indigo-500'
            )}
          />
          {isValid(parsedEnd) && <LunarInfo date={parsedEnd} className="mt-1 ml-1" />}
        </div>
      </div>

      {!isValidDates && (startDate !== '' || endDate !== '') && (
        <ErrorMessage
          message={
            !isValid(parsedStart) && !isValid(parsedEnd)
              ? t.invalidBothDates
              : !isValid(parsedStart)
                ? t.invalidStartDate
                : t.invalidEndDate
          }
        />
      )}

      {/* Result Section */}
      {result && (
        <div className="mt-8 pt-8 border-t border-stone-100">
          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
            <p className="text-sm font-medium text-emerald-600/80 mb-4 uppercase tracking-wider text-center">
              {t.timeDifference}
            </p>

            <div className="flex flex-col items-center justify-center gap-6">
              <div className="text-center">
                <div className="flex flex-wrap items-baseline justify-center gap-2">
                  <span className="text-6xl font-semibold text-emerald-950 tracking-tight">
                    {result.totalDays}
                  </span>
                  <span className="text-xl text-emerald-700/70 font-medium">{t.dayUnit}</span>
                </div>
                {result.isNegative && (
                  <p className="text-sm text-emerald-600 mt-2">{t.startAfterEnd}</p>
                )}
              </div>

              {result.duration.years || result.duration.months || result.duration.days ? (
                <div className="flex items-center gap-4 text-emerald-800 bg-emerald-100/50 px-5 py-2.5 rounded-full text-sm font-medium">
                  <span>{t.equivalentTo}</span>
                  <div className="flex gap-3">
                    {result.duration.years ? (
                      <span>
                        {result.duration.years} {t.yearUnit}
                      </span>
                    ) : null}
                    {result.duration.months ? (
                      <span>
                        {result.duration.months} {t.monthUnit}
                      </span>
                    ) : null}
                    {result.duration.days ? (
                      <span>
                        {result.duration.days} {t.dayUnit}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function DurationInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | '';
  onChange: (val: number | '') => void;
}) {
  const numValue = value === '' ? 0 : value;

  const handleDecrement = () => {
    onChange(Math.max(0, numValue - 1));
  };

  const handleIncrement = () => {
    onChange(numValue + 1);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center bg-stone-50 border border-stone-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all overflow-hidden h-14 group">
        <button
          onClick={handleDecrement}
          className="h-full px-4 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          type="button"
        >
          <Minus className="w-4 h-4 stroke-[3]" />
        </button>

        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === '' ? '' : Math.max(0, parseInt(val, 10)));
          }}
          placeholder="0"
          className="w-full h-full bg-transparent outline-none text-stone-900 text-center text-xl font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          onClick={handleIncrement}
          className="h-full px-4 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          type="button"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
      <span className="text-center text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

function AdPlaceholder() {
  const { t } = useI18n();
  return (
    <div className="my-8 text-center bg-stone-50 border border-dashed border-stone-300 rounded-2xl py-6 px-4">
      {/* 將此區塊替換為 AdSense 廣告代碼 */}
      <p className="text-stone-400 text-xs">{t.adSponsor}</p>
    </div>
  );
}

function SeoContent() {
  const { t } = useI18n();

  return (
    <article className="mt-12 space-y-8 text-stone-600 leading-relaxed">
      <h2 className="text-2xl font-semibold text-stone-900 border-b-2 border-indigo-600 pb-3">
        {t.seoH2Title}
      </h2>
      <p>{t.seoIntro}</p>

      <AdPlaceholder />

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-stone-800">{t.seoHowToTitle}</h3>
        <p>{t.seoHowToDesc}</p>
      </section>

      <section className="space-y-3">
        <h4 className="text-lg font-semibold text-indigo-700">{t.seoIncludeEndTitle}</h4>
        <p>{t.seoIncludeEndDesc}</p>
      </section>

      <hr className="border-stone-200" />

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-stone-800">{t.seoAddSubTitle}</h3>
        <p>{t.seoAddSubDesc}</p>
      </section>

      <AdPlaceholder />

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-stone-800">{t.seoWhyTitle}</h3>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>
            <strong>{t.seoWhyAccurate}</strong>
            {t.seoWhyAccurateDesc}
          </li>
          <li>
            <strong>{t.seoWhyPrivacy}</strong>
            {t.seoWhyPrivacyDesc}
          </li>
          <li>
            <strong>{t.seoWhyCrossPlatform}</strong>
            {t.seoWhyCrossPlatformDesc}
          </li>
          <li>
            <strong>{t.seoWhyExperience}</strong>
            {t.seoWhyExperienceDesc}
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h4 className="text-lg font-semibold text-indigo-700">{t.seoUseCasesTitle}</h4>
        <p>{t.seoUseCasesDesc}</p>
      </section>
    </article>
  );
}

function ReminderActions({ date }: { date: Date }) {
  const { t } = useI18n();
  const [showMenu, setShowMenu] = useState(false);
  const [eventName, setEventName] = useState(t.defaultReminderName);

  const handleDownloadICS = () => {
    const dateStr = format(date, 'yyyyMMdd');
    const nextDateStr = format(add(date, { days: 1 }), 'yyyyMMdd');
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Date Calculator//EN
BEGIN:VEVENT
DTSTART;VALUE=DATE:${dateStr}
DTEND;VALUE=DATE:${nextDateStr}
SUMMARY:${eventName}
DESCRIPTION:${t.reminderDescription}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${eventName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${format(date, 'yyyyMMdd')}/${format(date, 'yyyyMMdd')}&details=${encodeURIComponent(t.reminderDescription)}`;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-indigo-200"
      >
        <CalendarPlus className="w-5 h-5" />
        {t.addReminder}
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 bottom-full mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-100 z-20 overflow-hidden"
            >
              <div className="p-4 border-b border-stone-100 bg-stone-50/50">
                <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider">
                  {t.reminderName}
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={t.reminderPlaceholder}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm transition-all"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="p-2">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowMenu(false)}
                  className="w-full flex items-center gap-3 px-3 py-3 hover:bg-indigo-50 rounded-xl text-left text-sm font-semibold text-stone-700 transition-colors group"
                >
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  {t.addToGoogleCalendar}
                </a>
                <button
                  onClick={handleDownloadICS}
                  className="w-full flex items-center gap-3 px-3 py-3 hover:bg-stone-50 rounded-xl text-left text-sm font-semibold text-stone-700 transition-colors group"
                >
                  <div className="bg-stone-100 text-stone-600 p-2 rounded-lg group-hover:bg-stone-600 group-hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </div>
                  {t.downloadIcs}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
