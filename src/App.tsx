import React, { useState, useMemo } from 'react';
import { format, add, sub, intervalToDuration, isValid, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus, Minus, ArrowRight, CalendarPlus, Download, ExternalLink, CalendarDays, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'add-sub' | 'diff';
type Operation = 'add' | 'sub';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('add-sub');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-stone-200 mb-4">
            <CalendarIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-900 mb-3">
            日期計算機
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            輕鬆計算未來的日期、過去的日期，或是兩個日期之間的精確天數。計算完成後，一鍵加入行事曆提醒自己。
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-stone-100 p-2 gap-2 bg-stone-50/50">
            <button
              onClick={() => setActiveTab('add-sub')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === 'add-sub' 
                  ? "bg-white text-indigo-700 shadow-sm border border-stone-200/60" 
                  : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
              )}
            >
              <CalendarDays className="w-4 h-4" />
              加減日期
            </button>
            <button
              onClick={() => setActiveTab('diff')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === 'diff' 
                  ? "bg-white text-indigo-700 shadow-sm border border-stone-200/60" 
                  : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
              )}
            >
              <ArrowLeftRight className="w-4 h-4" />
              計算天數差
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
      </div>
    </div>
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

function AddSubCalculator() {
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
            <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wider">開始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={cn(
                "w-full px-5 py-4 rounded-2xl border transition-all outline-none text-stone-900 text-lg shadow-sm",
                !isValidDate && startDate !== '' 
                  ? "border-red-300 bg-red-50 focus:ring-red-500/10 focus:border-red-500" 
                  : "border-stone-200 bg-stone-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
              )}
            />
          </div>

          {/* Operation Toggle */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wider">運算方式</label>
            <div className="relative flex bg-stone-100 p-1.5 rounded-full border border-stone-200 w-full h-[60px]">
              {/* Animated Background Slider */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-md border border-stone-200/50"
                initial={false}
                animate={{
                  left: operation === 'add' ? '6px' : '50%',
                  right: operation === 'add' ? '50%' : '6px',
                }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
              <button
                onClick={() => setOperation('add')}
                className={cn(
                  "relative z-10 flex-1 rounded-full text-base font-bold transition-colors duration-300",
                  operation === 'add' ? "text-indigo-700" : "text-stone-500 hover:text-stone-700"
                )}
              >
                加上
              </button>
              <button
                onClick={() => setOperation('sub')}
                className={cn(
                  "relative z-10 flex-1 rounded-full text-base font-bold transition-colors duration-300",
                  operation === 'sub' ? "text-indigo-700" : "text-stone-500 hover:text-stone-700"
                )}
              >
                減去
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isValidDate && startDate !== '' && (
        <ErrorMessage message="請輸入正確的日期格式 (例如: 2024-03-17)" />
      )}

      {/* Duration Inputs */}
        <div className="space-y-4 pt-4">
          <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wider">
            需要{operation === 'add' ? '加上' : '減去'}的時間長度
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <DurationInput label="年" value={years} onChange={setYears} />
            <DurationInput label="月" value={months} onChange={setMonths} />
            <DurationInput label="週" value={weeks} onChange={setWeeks} />
            <DurationInput label="天" value={days} onChange={setDays} />
          </div>
        </div>

      {/* Result Section */}
      {resultDate && (
        <div className="mt-8 pt-8 border-t border-stone-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-indigo-600/80 mb-1 uppercase tracking-wider">計算結果</p>
              <div className="flex flex-wrap items-baseline gap-3 justify-center md:justify-start">
                <span className="text-3xl md:text-4xl font-semibold text-indigo-950 tracking-tight">
                  {format(resultDate, 'yyyy年 MM月 dd日')}
                </span>
                <span className="text-xl text-indigo-700/70 font-medium">
                  {format(resultDate, 'EEEE', { locale: zhTW })}
                </span>
              </div>
            </div>
            
            <ReminderActions date={resultDate} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function DiffCalculator() {
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(add(new Date(), { days: 30 }), 'yyyy-MM-dd'));

  const parsedStart = useMemo(() => parseISO(startDate), [startDate]);
  const parsedEnd = useMemo(() => parseISO(endDate), [endDate]);
  const isValidDates = isValid(parsedStart) && isValid(parsedEnd);

  const result = useMemo(() => {
    if (!isValidDates) return null;
    
    // Ensure start is before end for duration calculation
    const start = parsedStart < parsedEnd ? parsedStart : parsedEnd;
    const end = parsedStart < parsedEnd ? parsedEnd : parsedStart;
    const isNegative = parsedStart > parsedEnd;

    // Calculate total days
    // We use Math.abs to handle if start > end, though we already swapped them above.
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
          <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wider">開始日期</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={cn(
              "w-full px-4 py-3 rounded-xl border transition-all outline-none text-stone-900",
              !isValid(parsedStart) && startDate !== '' 
                ? "border-red-300 bg-red-50 focus:ring-red-500/10 focus:border-red-500" 
                : "border-stone-200 bg-stone-50 focus:bg-white focus:ring-indigo-500/20 focus:border-indigo-500"
            )}
          />
        </div>

        <div className="hidden md:flex justify-center pt-6">
          <ArrowRight className="w-5 h-5 text-stone-300" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wider">結束日期</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={cn(
              "w-full px-4 py-3 rounded-xl border transition-all outline-none text-stone-900",
              !isValid(parsedEnd) && endDate !== '' 
                ? "border-red-300 bg-red-50 focus:ring-red-500/10 focus:border-red-500" 
                : "border-stone-200 bg-stone-50 focus:bg-white focus:ring-indigo-500/20 focus:border-indigo-500"
            )}
          />
        </div>
      </div>

      {(!isValidDates && (startDate !== '' || endDate !== '')) && (
        <ErrorMessage 
          message={
            !isValid(parsedStart) && !isValid(parsedEnd) 
              ? "請輸入有效的開始與結束日期" 
              : !isValid(parsedStart) 
                ? "請輸入有效的開始日期" 
                : "請輸入有效的結束日期"
          } 
        />
      )}

      {/* Result Section */}
      {result && (
        <div className="mt-8 pt-8 border-t border-stone-100">
          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
            <p className="text-sm font-medium text-emerald-600/80 mb-4 uppercase tracking-wider text-center">相差時間</p>
            
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="text-center">
                <div className="flex flex-wrap items-baseline justify-center gap-2">
                  <span className="text-6xl font-semibold text-emerald-950 tracking-tight">
                    {result.totalDays}
                  </span>
                  <span className="text-xl text-emerald-700/70 font-medium">天</span>
                </div>
                {result.isNegative && (
                  <p className="text-sm text-emerald-600 mt-2">開始日期晚於結束日期</p>
                )}
              </div>

              {(result.duration.years || result.duration.months || result.duration.days) ? (
                <div className="flex items-center gap-4 text-emerald-800 bg-emerald-100/50 px-5 py-2.5 rounded-full text-sm font-medium">
                  <span>相當於：</span>
                  <div className="flex gap-3">
                    {result.duration.years ? <span>{result.duration.years} 年</span> : null}
                    {result.duration.months ? <span>{result.duration.months} 個月</span> : null}
                    {result.duration.days ? <span>{result.duration.days} 天</span> : null}
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

function DurationInput({ label, value, onChange }: { label: string, value: number | '', onChange: (val: number | '') => void }) {
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
      <span className="text-center text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

function ReminderActions({ date }: { date: Date }) {
  const [showMenu, setShowMenu] = useState(false);
  const [eventName, setEventName] = useState('重要提醒');

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
DESCRIPTION:由日期計算機建立的提醒
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

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${format(date, 'yyyyMMdd')}/${format(date, 'yyyyMMdd')}&details=${encodeURIComponent('由日期計算機建立的提醒')}`;

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
        加入提醒
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 bottom-full mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-100 z-20 overflow-hidden"
            >
              <div className="p-4 border-b border-stone-100 bg-stone-50/50">
                <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider">
                  提醒事項名稱
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="輸入提醒名稱..."
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
                  加入 Google 行事曆
                </a>
                <button
                  onClick={handleDownloadICS}
                  className="w-full flex items-center gap-3 px-3 py-3 hover:bg-stone-50 rounded-xl text-left text-sm font-semibold text-stone-700 transition-colors group"
                >
                  <div className="bg-stone-100 text-stone-600 p-2 rounded-lg group-hover:bg-stone-600 group-hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </div>
                  下載 .ics 檔案 (Apple/Outlook)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
