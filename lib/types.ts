export type MeetingType = 'checkup' | 'investment' | 'intro' | 'process';

export interface Section {
  title: string;
  content: string;
}

export interface Summary {
  clientName: string;
  date: string;
  meetingTitle: string;
  sections: Section[];
}
