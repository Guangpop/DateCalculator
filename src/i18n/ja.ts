import type { Translations } from './types';

export const ja: Translations = {
  // Head / SEO
  siteTitle: '日付計算：日数差と日付の加減算 | SHINLINK',
  metaDescription: '無料オンライン日付計算ツール。2つの日付間の日数を正確に計算、または年・月・週・日の加減算が可能。うるう年や月の日数差を自動処理します。',
  ogTitle: '日付計算：日数差と日付の加減算',
  ogDescription: '無料オンライン日付計算ツール。2つの日付間の日数を正確に計算、または年・月・週・日の加減算が可能。',
  jsonLdName: '日付計算',
  jsonLdCurrency: 'JPY',

  // Header
  appTitle: '日付計算',
  appDescription: '未来の日付、過去の日付、または2つの日付間の正確な日数を簡単に計算できます。計算結果をワンクリックでカレンダーに追加できます。',

  // Tabs
  tabAddSub: '日付の加減算',
  tabDiff: '日数差を計算',

  // Add/Sub Calculator
  startDate: '開始日',
  operation: '計算方法',
  operationAdd: '加算',
  operationSub: '減算',
  durationLabelAdd: '加算する期間',
  durationLabelSub: '減算する期間',
  unitYear: '年',
  unitMonth: '月',
  unitWeek: '週',
  unitDay: '日',
  result: '計算結果',
  resultDateFormat: 'yyyy年 MM月 dd日',
  invalidDateFormat: '正しい日付形式を入力してください（例: 2024-03-17）',

  // Diff Calculator
  endDate: '終了日',
  timeDifference: '日数差',
  dayUnit: '日',
  equivalentTo: '換算：',
  yearUnit: '年',
  monthUnit: 'ヶ月',
  startAfterEnd: '開始日が終了日より後です',
  invalidStartDate: '有効な開始日を入力してください',
  invalidEndDate: '有効な終了日を入力してください',
  invalidBothDates: '有効な開始日と終了日を入力してください',

  // Advanced Options (Diff Calculator)
  advancedOptions: '詳細設定',
  includeEndDate: '終了日を含む（+1日）',
  excludeWeekdays: '特定曜日を除外',
  weekdayMon: '月',
  weekdayTue: '火',
  weekdayWed: '水',
  weekdayThu: '木',
  weekdayFri: '金',
  weekdaySat: '土',
  weekdaySun: '日',
  totalDays: '合計日数',
  workingDays: '計算日数',
  excludedDays: '除外',

  // Reminder
  addReminder: 'リマインダー追加',
  reminderName: 'リマインダー名',
  reminderPlaceholder: 'リマインダー名を入力...',
  defaultReminderName: '重要リマインダー',
  addToGoogleCalendar: 'Google カレンダーに追加',
  downloadIcs: '.ics ファイルをダウンロード (Apple/Outlook)',
  reminderDescription: '日付計算ツールで作成したリマインダー',

  // Lunar (not displayed for Japanese)
  lunarPrefix: '旧暦',
  lunarMonthSuffix: '月',
  lunarYearSuffix: '年',

  // SEO Content
  seoH2Title: '日付計算：日数差と日付の加減算',
  seoIntro: 'SHINLINK の無料オンラインツールへようこそ。プロジェクト期間の計算、契約満了日の追跡、個人のスケジュール管理など、当ツールは大小の月やうるう年の差異を自動処理し、最も正確な結果を提供します。',
  seoHowToTitle: '2つの日付間の日数を計算するには？',
  seoHowToDesc: '「日数差を計算」モードで「開始日」と「終了日」を選択するだけで、即座に合計日数が算出されます。勤務日数や入社日数の計算、重要な日までのカウントダウンに最適です。',
  seoIncludeEndTitle: '終了日の含有と特定曜日の除外',
  seoIncludeEndDesc: '柔軟な設定が可能です。終了日を計算に含めるかどうか（+1日）を選択でき、週末（土曜・日曜）を除外してビジネスニーズに合わせた計算結果を得ることもできます。',
  seoAddSubTitle: '日付の加減算機能：特定期間後の日付を素早く算出',
  seoAddSubDesc: '「3ヶ月と2週間後」がいつか知りたいですか？加算または減算タブに切り替え、年・月・週・日数を入力すると、SHINLINK 日付計算ツールが正確な目標日と曜日を即座にお知らせします。',
  seoWhyTitle: 'SHINLINK オンライン日付計算を選ぶ理由',
  seoWhyAccurate: '正確無比：',
  seoWhyAccurateDesc: 'うるう年（2/29）や月の日数差を自動処理。',
  seoWhyPrivacy: 'プライバシー保護：',
  seoWhyPrivacyDesc: 'すべての計算はブラウザ上で完結。日付データを記録することはありません。',
  seoWhyCrossPlatform: 'クロスプラットフォーム：',
  seoWhyCrossPlatformDesc: 'スマートフォンでもパソコンでも、ダウンロード不要で即利用可能。',
  seoWhyExperience: '専門チーム開発：',
  seoWhyExperienceDesc: 'SHINLINK 開発チームが、人事担当者・プロジェクトマネージャー・開発者が日付処理で直面する課題を理解して構築しました。',
  seoUseCasesTitle: '多様な活用シーン',
  seoUseCasesDesc: '労務管理の勤続年数計算、産休・育休日数の算出、ソフトウェア開発のスプリント計画、賃貸契約の満了日試算、記念日の追跡など、幅広く活用されています。',

  // Ad
  adSponsor: '広告',

  // Language switcher
  langSwitcherLabel: '言語',
};
