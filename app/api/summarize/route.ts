import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { getPrompt } from '@/lib/prompts';
import { MeetingType } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const client = new OpenAI();
    const { meetingType, transcript, clientName, date } = await req.json() as {
      meetingType: MeetingType;
      transcript: string;
      clientName?: string;
      date?: string;
    };

    if (!transcript?.trim()) {
      return NextResponse.json({ error: 'חסר תמלול' }, { status: 400 });
    }

    const userMessage = [
      clientName && `שם הלקוח: ${clientName}`,
      date && `תאריך הפגישה: ${date}`,
      '',
      'תמלול הפגישה:',
      transcript
    ].filter(Boolean).join('\n');

    const message = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 16000,
      messages: [
        { role: 'system', content: getPrompt(meetingType) },
        { role: 'user', content: userMessage }
      ]
    });

    const raw = message.choices[0]?.message?.content ?? '';
    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) {
      return NextResponse.json({ error: 'שגיאה בפרסור תשובת AI' }, { status: 500 });
    }

    const summary = JSON.parse(match[0]);
    return NextResponse.json({ summary });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
