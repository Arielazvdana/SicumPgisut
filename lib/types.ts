export type MeetingType = 'checkup' | 'investment' | 'intro';

export interface Section {
  id?: string;
  title: string;
  content: string;
}

export interface CheckupSummary {
  clientName: string;
  date: string;
  openingSentence: string;
  sections: Section[];
  dynamicSections: Section[];
  sections2: Section[];
  stage1Price: string;
  ongoingPriceRange: string;
}

export interface CashflowItem {
  label: string;
  amount: string;
  vehicle: string;
}

export interface CapitalItem {
  amount: string;
  purpose: string;
  vehicle: string;
}

export interface FinancialSummary {
  monthlyRequired: string;
  currentSavings: string;
  cashflowBreakdown: CashflowItem[];
  ownCapital: string;
  capitalAllocation: CapitalItem[];
}

export interface InvestmentSummary {
  clientName: string;
  date: string;
  narrative: string;
  implementationSteps: string[];
  implementationPrice: string;
  financialSummary: FinancialSummary;
  ongoingPriceRange: string;
}

export interface IntroSummary {
  clientName: string;
  date: string;
  openingSentence: string;
  sections: Section[];
  checkupPrice: string;
}

export type AnySummary = CheckupSummary | InvestmentSummary | IntroSummary;
