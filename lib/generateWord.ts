import {
  CheckupSummary,
  InvestmentSummary,
  IntroSummary,
  MeetingType,
  Section,
  AnySummary
} from './types';

const contentToHtml = (content: string): string =>
  (content || '')
    .split('\n\n')
    .map(p => p.trim() ? `<p style="margin:0 0 9pt 0;line-height:1.65;">${p.replace(/\n/g, '<br>')}</p>` : '')
    .join('');

const sectionHtml = (s: Section): string =>
  `<h2 style="color:#00a651;font-size:13pt;font-weight:bold;margin:20pt 0 4pt 0;">${s.title}</h2>${contentToHtml(s.content)}`;

const processHtml = (stage1Price: string, ongoingRange: string): string => `
<h2 style="color:#00a651;font-size:13pt;font-weight:bold;margin:22pt 0 4pt 0;">מבנה תהליך התכנון הפיננסי שהצעתי</h2>
<ol dir="rtl" style="padding-right:18pt;padding-left:0;margin:0 0 12pt 0;">
  <li style="margin-bottom:7pt;">שלב בניית התשתית - הגדרת מטרות ויעדים לכל טווח זמן, ניהול סיכונים, תכנון עצמאות כלכלית, ובניית אסטרטגיית ההשקעות.</li>
  <li style="margin-bottom:7pt;">שלב היישום בפועל - חשיפה לאפיקי ההשקעה, פתיחת חשבונות, פגישות עם גופים, והקמת ההוראות ליישום.</li>
  <li style="margin-bottom:7pt;">שלב הליווי המתמשך - וידוא שתיק ההשקעות תואם את המטרות, הסיכונים והשינויים בחיים האישיים שלכם לאורך זמן.</li>
</ol>
<p><u><b>שלב 1 - בניית התשתית:</b></u><br>נגדיר יחד את התמונה הגדולה של החיים הכלכליים שלכם: מטרות ויעדים לטווח הקצר, הבינוני והארוך, נמדוד את הפער מהמצב הקיים, ונבנה תוכנית פעולה שמחברת בין החזון שלכם לבין המציאות. נכלול ניהול סיכונים, תכנון עצמאות כלכלית, ואסטרטגיית השקעות.</p>
${stage1Price ? `<p><u><b>סה"כ עלות לשלב בניית התשתית - ${stage1Price}</b></u></p>` : ''}
<p><u><b>שלב 2 - יישום בפועל:</b></u><br>שלב היישום יוגדר ויתומחר לאחר גיבוש האסטרטגיה, כשנחליט אילו השקעות יתאימו להון ולחיסכון החודשי שלכם, בהתאם למסלול שתבחרו: לעשות את זה בעצמכם, שנעשה את זה ביחד, או שנעשה את זה עבורכם.</p>
<p><u><b>שלב 3 - הליווי המתמשך:</b></u><br>אחרי שנסיים את תהליך היישום, נעבור לליווי המתמשך שכולל פגישה תקופית, זמינות ושירות שוטף לכל שאלה, גישה למערכת הדיגיטלית, פיקוח אקטיבי על תיק ההשקעות, ו-FUTURE HUB שמרכז את כל הנכסים שלכם במקום אחד.<br>העלות ${ongoingRange || '94-658'} ₪ לחודש, ללא התחייבות, כ-WIN WIN.</p>`;

const ongoingHtml = (ongoingRange: string): string => `
<h2 style="color:#00a651;font-size:13pt;font-weight:bold;margin:22pt 0 4pt 0;">שלב 3 - הליווי המתמשך</h2>
<p>אחרי שנסיים את תהליך היישום בפועל, נעבור לליווי המתמשך שעובד בצורה הבאה.</p>
<ol dir="rtl" style="padding-right:18pt;padding-left:0;">
  <li style="margin-bottom:6pt;">פגישה תקופית: רבעונית, חצי שנתית או שנתית בהתאם למורכבות התיק.</li>
  <li style="margin-bottom:6pt;">חווית שירות: זמינות, תפעול ושירות לכל שאלה בין לבין.</li>
  <li style="margin-bottom:6pt;">ידע מקצועי: גישה מתמשכת למערכת הדיגיטלית להדרכות כלכליות בנושאים השונים.</li>
  <li style="margin-bottom:6pt;">אסטרטגיית השקעות: פיקוח אקטיבי על תיק ההשקעות ועדכון האסטרטגיה בהתאם לצורך.</li>
  <li style="margin-bottom:6pt;">טכנולוגיה: FUTURE HUB - מערכת שמרכזת את כל הנכסים שלכם במקום אחד ומקפיצה תובנות והתרעות בהתאם.</li>
</ol>
<p>העלות של הליווי המתמשך נגבית חודש בחודשו, ללא התחייבות, כ-WIN WIN. תנוע בין ${ongoingRange || '94-658'} ₪ בחודש בהתאם למורכבות התיק.</p>`;

export function buildWordHtml(summary: AnySummary, meetingType: MeetingType, clientNameOverride?: string, dateOverride?: string): string {
  const titles: Record<MeetingType, string> = {
    checkup: "צ'ק אפ פיננסי",
    investment: 'אסטרטגיית השקעות',
    intro: 'היכרות'
  };

  const name = clientNameOverride || summary.clientName || 'לקוח';
  const date = dateOverride || summary.date || '';
  let body = '';

  if (meetingType === 'checkup') {
    const s = summary as CheckupSummary;
    const allSections = [...(s.sections || []), ...(s.dynamicSections || []), ...(s.sections2 || [])];
    const opening = s.openingSentence
      ? `<p style="margin:0 0 16pt 0;line-height:1.65;">${s.openingSentence}</p>`
      : '';
    body = opening + allSections.map(sectionHtml).join('') + processHtml(s.stage1Price, s.ongoingPriceRange);

  } else if (meetingType === 'investment') {
    const s = summary as InvestmentSummary;
    const fs = s.financialSummary || {};
    const steps = (s.implementationSteps || [])
      .map(step => `<li style="margin-bottom:7pt;">${step}</li>`)
      .join('');
    const cfRows = (fs.cashflowBreakdown || [])
      .map(i => `<p style="margin:0 0 6pt 0;"><b>${i.label}</b> - ${i.amount} - <b>${i.vehicle}</b></p>`)
      .join('');
    const capRows = (fs.capitalAllocation || [])
      .map(i => `<p style="margin:0 0 6pt 0;">${i.amount} ${i.purpose} - <b>${i.vehicle}</b></p>`)
      .join('');

    body = contentToHtml(s.narrative)
      + `<h2 style="color:#00a651;font-size:13pt;font-weight:bold;margin:20pt 0 4pt 0;">שלב היישום בפועל</h2>`
      + `<ol dir="rtl" style="padding-right:18pt;padding-left:0;">${steps}</ol>`
      + `<p style="margin:10pt 0;"><u><b>הערך בשלב הזה הוא לא רק ידע: הוא מניעת טעויות יקרות. הוא קיצור עקומת למידה. הוא חיבור בין החלטות גדולות למספרים אמיתיים. והוא בעיקר יצירת שקט.</b></u></p>`
      + (s.implementationPrice ? `<p><u><b>סה"כ העלות לשלב היישום בפועל - ${s.implementationPrice}</b></u></p>` : '')
      + ongoingHtml(s.ongoingPriceRange)
      + `<h2 style="color:#00a651;font-size:13pt;font-weight:bold;margin:20pt 0 4pt 0;">סיכום התוכנית הפיננסית</h2>`
      + (fs.monthlyRequired ? `<p><u><b>תזרים מזומנים חודשי דרוש:</b></u><br>${fs.monthlyRequired}</p>` : '')
      + (fs.currentSavings ? `<p><u><b>חיסכון חודשי קיים:</b></u><br>${fs.currentSavings}</p>` : '')
      + (cfRows ? `<p><u><b>סך הכל תזרים המזומנים הדרוש:</b></u></p>${cfRows}` : '')
      + (fs.ownCapital ? `<p><u><b>הון עצמי פנוי ונזיל:</b></u><br>${fs.ownCapital}</p>` : '')
      + (capRows ? `<p><u><b>חלוקת ההון העצמי בין אפיקי ההשקעה השונים:</b></u></p>${capRows}` : '');

  } else {
    const s = summary as IntroSummary;
    const opening = s.openingSentence
      ? `<p style="margin:0 0 16pt 0;line-height:1.65;">${s.openingSentence}</p>`
      : '';
    body = opening
      + (s.sections || []).map(sectionHtml).join('')
      + (s.checkupPrice ? `<p style="margin-top:16pt;"><b>מחיר פגישת הצ'ק אפ: ${s.checkupPrice}</b></p>` : '');
  }

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>סיכום - ${name}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Normal</w:View></w:WordDocument></xml><![endif]-->
<style>
  @page { margin: 2.5cm; }
  body { font-family: David, Arial, sans-serif; font-size: 12pt; direction: rtl; text-align: right; color: #222; line-height: 1.6; }
  h1 { font-size: 15pt; font-weight: bold; text-align: center; color: #00a651; margin: 0 0 6pt 0; }
  h2 { font-size: 13pt; font-weight: bold; color: #00a651; margin: 20pt 0 4pt 0; }
  p { font-size: 12pt; margin: 0 0 9pt 0; line-height: 1.6; }
  ol, ul { direction: rtl; padding-right: 18pt; padding-left: 0; }
  li { margin-bottom: 6pt; }
</style>
</head>
<body dir="rtl">
${date ? `<p style="text-align:left;color:#888;font-size:11pt;margin:0 0 4pt 0;">תאריך: ${date}</p>` : ''}
<h1>סיכום פגישת ${titles[meetingType]} - ${name}</h1>
<br>
${body}
</body>
</html>`;
}

export function downloadWord(html: string, name: string, date: string): void {
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `סיכום_${name.replace(/[\s/\\:*?"<>|]/g, '_')}_${date || 'FUTURE'}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
