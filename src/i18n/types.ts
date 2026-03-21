export type Locale = 'zh-Hant' | 'en' | 'ja';

export interface Translations {
  // Head / SEO
  siteTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  jsonLdName: string;
  jsonLdCurrency: string;

  // Header
  appTitle: string;
  appDescription: string;

  // Tabs
  tabAddSub: string;
  tabDiff: string;

  // Add/Sub Calculator
  startDate: string;
  operation: string;
  operationAdd: string;
  operationSub: string;
  durationLabelAdd: string;
  durationLabelSub: string;
  unitYear: string;
  unitMonth: string;
  unitWeek: string;
  unitDay: string;
  result: string;
  resultDateFormat: string;
  invalidDateFormat: string;

  // Diff Calculator
  endDate: string;
  timeDifference: string;
  dayUnit: string;
  equivalentTo: string;
  yearUnit: string;
  monthUnit: string;
  startAfterEnd: string;
  invalidStartDate: string;
  invalidEndDate: string;
  invalidBothDates: string;

  // Advanced Options (Diff Calculator)
  advancedOptions: string;
  includeEndDate: string;
  excludeWeekdays: string;
  weekdayMon: string;
  weekdayTue: string;
  weekdayWed: string;
  weekdayThu: string;
  weekdayFri: string;
  weekdaySat: string;
  weekdaySun: string;
  totalDays: string;
  workingDays: string;
  excludedDays: string;

  // Reminder
  addReminder: string;
  reminderName: string;
  reminderPlaceholder: string;
  defaultReminderName: string;
  addToGoogleCalendar: string;
  downloadIcs: string;
  reminderDescription: string;

  // Lunar (only for zh-Hant)
  lunarPrefix: string;
  lunarMonthSuffix: string;
  lunarYearSuffix: string;

  // SEO Content
  seoH2Title: string;
  seoIntro: string;
  seoHowToTitle: string;
  seoHowToDesc: string;
  seoIncludeEndTitle: string;
  seoIncludeEndDesc: string;
  seoAddSubTitle: string;
  seoAddSubDesc: string;
  seoWhyTitle: string;
  seoWhyAccurate: string;
  seoWhyAccurateDesc: string;
  seoWhyPrivacy: string;
  seoWhyPrivacyDesc: string;
  seoWhyCrossPlatform: string;
  seoWhyCrossPlatformDesc: string;
  seoWhyExperience: string;
  seoWhyExperienceDesc: string;
  seoUseCasesTitle: string;
  seoUseCasesDesc: string;

  // Ad
  adSponsor: string;

  // Language switcher
  langSwitcherLabel: string;
}
