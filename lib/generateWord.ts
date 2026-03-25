import { Summary, Section } from './types';

const contentToHtml = (content: string): string =>
  (content || '')
    .split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      // Handle bullet points
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        const items = trimmed.split('\n')
          .map(line => line.replace(/^[•\-]\s*/, '').trim())
          .filter(Boolean)
          .map(item => `<li style="margin-bottom:6pt;">${item}</li>`)
          .join('');
        return `<ul dir="rtl" style="padding-right:18pt;padding-left:0;margin:0 0 12pt 0;">${items}</ul>`;
      }
      return `<p style="margin:0 0 9pt 0;line-height:1.65;">${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');

const sectionHtml = (s: Section): string => {
  const title = s.title
    ? `<h2 style="color:#00a651;font-size:13pt;font-weight:bold;margin:20pt 0 4pt 0;">${s.title}</h2>`
    : '';
  return `${title}${contentToHtml(s.content)}`;
};

export function buildWordHtml(summary: Summary, clientNameOverride?: string, dateOverride?: string): string {
  const name = clientNameOverride || summary.clientName || 'לקוח';
  const date = dateOverride || summary.date || '';
  const title = summary.meetingTitle || `סיכום פגישה - ${name}`;

  const body = (summary.sections || []).map(sectionHtml).join('');

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${title}</title>
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
<h1>${title}</h1>
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
