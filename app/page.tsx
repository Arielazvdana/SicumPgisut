'use client';
import { useState } from 'react';
import { MeetingType, AnySummary, CheckupSummary, InvestmentSummary, IntroSummary, Section } from '@/lib/types';
import { buildWordHtml, downloadWord } from '@/lib/generateWord';

const GREEN = '#00a651';
const LIGHT_GREEN = '#f0faf4';

const MEETING_TYPES = [
  { id: 'checkup' as MeetingType, icon: '📊', label: "צ'ק אפ", sub: 'בדיקת מצב שוטפת' },
  { id: 'investment' as MeetingType, icon: '📈', label: 'אסטרטגיית השקעות', sub: 'סיכום וחלוקת הון' },
  { id: 'intro' as MeetingType, icon: '🤝', label: 'היכרות', sub: 'פגישה ראשונה' },
];

function SectionCard({ section }: { section: Section }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ fontWeight: 'bold', color: GREEN, fontSize: '14px', borderBottom: `2px solid ${LIGHT_GREEN}`, paddingBottom: '4px', marginBottom: '8px' }}>
        {section.title}
      </div>
      <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.7', direction: 'rtl', textAlign: 'right' }}>
        {(section.content || '').split('\n\n').map((p, i) => (
          <p key={i} style={{ margin: '0 0 8px 0' }}>{p}</p>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [meetingType, setMeetingType] = useState<MeetingType>('checkup');
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnySummary | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!transcript.trim()) { setError('יש להדביק תמלול לפני יצירת הסיכום'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingType, transcript, clientName, date })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'שגיאה');
      setResult(data.summary);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'שגיאה');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const name = clientName || result.clientName || 'לקוח';
    const d = date || result.date || '';
    const html = buildWordHtml(result, meetingType, name, d);
    downloadWord(html, name, d);
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit',
    direction: 'rtl', textAlign: 'right', boxSizing: 'border-box', outline: 'none'
  };

  const getPreviewSections = (): Section[] => {
    if (!result) return [];
    if (meetingType === 'checkup') {
      const s = result as CheckupSummary;
      return [...(s.sections || []), ...(s.dynamicSections || []), ...(s.sections2 || [])];
    }
    if (meetingType === 'intro') return (result as IntroSummary).sections || [];
    return [];
  };

  return (
    <div dir="rtl" style={{ background: 'transparent', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 18px' }}>
        {/* Form */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '26px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: '18px' }}>
          {/* Meeting type */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>סוג הפגישה</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {MEETING_TYPES.map(t => (
                <button key={t.id} onClick={() => { setMeetingType(t.id); setResult(null); setError(''); }}
                  style={{ flex: 1, padding: '13px 10px', border: `2px solid ${meetingType === t.id ? GREEN : '#e0e0e0'}`, borderRadius: '10px', background: meetingType === t.id ? LIGHT_GREEN : '#fff', cursor: 'pointer', textAlign: 'right', direction: 'rtl', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: '20px', marginBottom: '3px' }}>{t.icon}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '13px', color: meetingType === t.id ? '#007a3d' : '#333' }}>{t.label}</div>
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '1px' }}>{t.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Name + Date */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '5px', display: 'block' }}>שם הלקוח</label>
              <input style={inp} placeholder="לין אביטל ושלומי פורמן" value={clientName} onChange={e => setClientName(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '5px', display: 'block' }}>תאריך</label>
              <input style={inp} placeholder="17.03.26" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          {/* Transcript */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '5px', display: 'block' }}>תמלול הפגישה</label>
            <textarea style={{ ...inp, minHeight: '200px', resize: 'vertical', lineHeight: '1.6' }}
              placeholder={"הדביקו כאן את תמלול הפגישה...\n\nמתאים לתמלול גולמי מ-Otter, Fireflies, Zoom, או כתיב יד."}
              value={transcript} onChange={e => setTranscript(e.target.value)} />
            <div style={{ fontSize: '11px', color: '#bbb', marginTop: '3px', textAlign: 'left' }}>{transcript.length.toLocaleString()} תווים</div>
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: '8px', padding: '11px 14px', color: '#c00', fontSize: '13px', marginBottom: '12px' }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleGenerate} disabled={loading || !transcript.trim()}
            style={{ width: '100%', padding: '13px', background: loading || !transcript.trim() ? '#ccc' : GREEN, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: loading || !transcript.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {loading ? '⏳ מייצר סיכום...' : '✨ צור סיכום'}
          </button>
          {loading && <div style={{ textAlign: 'center', color: '#aaa', fontSize: '12px', marginTop: '8px' }}>קלוד קורא את הפגישה ובונה את הסיכום, כ-20-40 שניות</div>}
        </div>

        {/* Result */}
        {result && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '26px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#222' }}>{clientName || result.clientName || 'לקוח'}</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>{date || result.date || ''} | {MEETING_TYPES.find(t => t.id === meetingType)?.label}</div>
              </div>
              <button onClick={handleDownload}
                style={{ padding: '10px 18px', background: GREEN, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                📥 הורד כ-Word
              </button>
            </div>

            {'openingSentence' in result && result.openingSentence && (
              <div style={{ background: LIGHT_GREEN, borderRight: `3px solid ${GREEN}`, borderRadius: '6px', padding: '12px 14px', fontSize: '13px', color: '#555', lineHeight: '1.7', marginBottom: '20px', direction: 'rtl' }}>
                {result.openingSentence}
              </div>
            )}

            {(meetingType === 'checkup' || meetingType === 'intro') && getPreviewSections().map((s, i) => (
              <SectionCard key={i} section={s} />
            ))}

            {meetingType === 'investment' && (() => {
              const s = result as InvestmentSummary;
              return (
                <>
                  {s.narrative && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontWeight: 'bold', color: GREEN, fontSize: '14px', borderBottom: `2px solid ${LIGHT_GREEN}`, paddingBottom: '4px', marginBottom: '8px' }}>סיכום המסע</div>
                      {s.narrative.split('\n\n').map((p, i) => (
                        <p key={i} style={{ fontSize: '13px', color: '#333', lineHeight: '1.7', margin: '0 0 8px 0', direction: 'rtl', textAlign: 'right' }}>{p}</p>
                      ))}
                    </div>
                  )}
                  {(s.implementationSteps || []).length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontWeight: 'bold', color: GREEN, fontSize: '14px', borderBottom: `2px solid ${LIGHT_GREEN}`, paddingBottom: '4px', marginBottom: '8px' }}>
                        שלב היישום {s.implementationPrice && `| ${s.implementationPrice}`}
                      </div>
                      <ol style={{ direction: 'rtl', paddingRight: '18px', paddingLeft: 0, margin: 0 }}>
                        {s.implementationSteps.map((step, i) => (
                          <li key={i} style={{ fontSize: '13px', color: '#333', marginBottom: '6px', lineHeight: '1.6' }}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </>
              );
            })()}

            <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setResult(null)} style={{ padding: '9px 16px', background: '#f5f5f5', color: '#777', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                ← פגישה חדשה
              </button>
              <button onClick={handleDownload}
                style={{ padding: '9px 20px', background: GREEN, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                📥 הורד כ-Word (.doc)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
