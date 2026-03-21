import type { Translations } from './types';

export const zhHant: Translations = {
  // Head / SEO
  siteTitle: '日期計算機：計算天數差距與加減日期 | SHINLINK',
  metaDescription: '免費線上日期計算機，精準計算兩個日期之間的天數差距，或加減年、月、週、天。自動處理閏年與大小月，支援農曆顯示，一鍵加入行事曆提醒。',
  ogTitle: '日期計算機：計算天數差距與加減日期',
  ogDescription: '免費線上日期計算機，精準計算兩個日期之間的天數差距，或加減年、月、週、天。自動處理閏年與大小月，支援農曆顯示。',
  jsonLdName: '日期計算機',
  jsonLdCurrency: 'TWD',

  // Header
  appTitle: '日期計算機',
  appDescription: '輕鬆計算未來的日期、過去的日期，或是兩個日期之間的精確天數。計算完成後，一鍵加入行事曆提醒自己。',

  // Tabs
  tabAddSub: '加減日期',
  tabDiff: '計算天數差',

  // Add/Sub Calculator
  startDate: '開始日期',
  operation: '運算方式',
  operationAdd: '加上',
  operationSub: '減去',
  durationLabelAdd: '需要加上的時間長度',
  durationLabelSub: '需要減去的時間長度',
  unitYear: '年',
  unitMonth: '月',
  unitWeek: '週',
  unitDay: '天',
  result: '計算結果',
  resultDateFormat: 'yyyy年 MM月 dd日',
  invalidDateFormat: '請輸入正確的日期格式 (例如: 2024-03-17)',

  // Diff Calculator
  endDate: '結束日期',
  timeDifference: '相差時間',
  dayUnit: '天',
  equivalentTo: '相當於：',
  yearUnit: '年',
  monthUnit: '個月',
  startAfterEnd: '開始日期晚於結束日期',
  invalidStartDate: '請輸入有效的開始日期',
  invalidEndDate: '請輸入有效的結束日期',
  invalidBothDates: '請輸入有效的開始與結束日期',

  // Advanced Options (Diff Calculator)
  advancedOptions: '進階設定',
  includeEndDate: '包含結束日期（+1 天）',
  excludeWeekdays: '排除特定星期',
  weekdayMon: '一',
  weekdayTue: '二',
  weekdayWed: '三',
  weekdayThu: '四',
  weekdayFri: '五',
  weekdaySat: '六',
  weekdaySun: '日',
  totalDays: '總天數',
  workingDays: '計算天數',
  excludedDays: '已排除',

  // Reminder
  addReminder: '加入提醒',
  reminderName: '提醒事項名稱',
  reminderPlaceholder: '輸入提醒名稱...',
  defaultReminderName: '重要提醒',
  addToGoogleCalendar: '加入 Google 行事曆',
  downloadIcs: '下載 .ics 檔案 (Apple/Outlook)',
  reminderDescription: '由日期計算機建立的提醒',

  // Lunar
  lunarPrefix: '農曆',
  lunarMonthSuffix: '月',
  lunarYearSuffix: '年',

  // SEO Content
  seoH2Title: '日期計算機：計算天數差距與加減日期',
  seoIntro: '歡迎使用 SHINLINK 免費線上工具。無論您是需要計算專案工期、追蹤合約到期日，還是規劃個人行程，我們的日期計算器都能為您提供最精準的結果，自動處理大月、小月及閏年差異。',
  seoHowToTitle: '如何計算兩個日期之間相差幾天？',
  seoHowToDesc: '在「計算天數」模式下，您只需選取「開始日期」與「結束日期」，系統便會即時算出總天數。這對於計算工作天、入職天數或距離重要日期的倒數非常實用。',
  seoIncludeEndTitle: '包含結束日期與排除特定星期',
  seoIncludeEndDesc: '我們的工具支援彈性設定，您可以選擇是否將結束日期納入計算（+1 天），甚至能根據需求排除週末（週六、週日），讓計算結果更符合職場實務需求。',
  seoAddSubTitle: '日期加減功能：快速算出特定時間後的日期',
  seoAddSubDesc: '想要知道「三個月又兩週後」是哪一天嗎？切換至「添加天數」或「減去天數」標籤，輸入您想加減的年、月、週、天數，SHINLINK 日期計算機將立即告知您準確的目標日期與星期。',
  seoWhyTitle: '為什麼選擇 SHINLINK 線上日期計算器？',
  seoWhyAccurate: '精準無誤：',
  seoWhyAccurateDesc: '自動過濾閏年（2/29）與大小月天數差異。',
  seoWhyPrivacy: '隱私安全：',
  seoWhyPrivacyDesc: '所有的計算均在您的瀏覽器端完成，我們不會記錄您的個人日期資料。',
  seoWhyCrossPlatform: '跨平台支援：',
  seoWhyCrossPlatformDesc: '無論是手機還是電腦，均可免下載、即開即用。',
  seoWhyExperience: '整合顧問經驗：',
  seoWhyExperienceDesc: '由 SHINLINK 開發團隊打造，我們深知 HR、專案經理與開發者在處理時間節點時的痛點。',
  seoUseCasesTitle: '多樣化的應用場景',
  seoUseCasesDesc: '本工具廣泛應用於：計算勞基法年資、產假/育嬰假天數、軟體開發 Sprint 週期規劃、租約到期日試算以及個人重要紀念日追蹤。',

  // Ad
  adSponsor: '廣告贊助',

  // Language switcher
  langSwitcherLabel: '語言',
};
