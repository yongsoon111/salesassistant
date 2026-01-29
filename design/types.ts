
export type Category = 'General' | 'Sales' | 'Inquiry' | 'Conflict' | 'Closing' | 'Greeting';

export interface StrategicGoal {
  id: string;
  label: string;
  icon: string;
  description: string;
  isCustom?: boolean;
}

export interface Script {
  id: string;
  title: string;
  content: string;
  category: Category;
  updatedAt: number;
}

export interface Resource {
  id: string;
  name: string;
  type: 'Link' | 'File';
  url: string;
  description: string;
  updatedAt: number;
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface Customer {
  id: string;
  name: string;
  status: 'Lead' | 'Active' | 'VIP' | 'Churned';
  notes: string;
  purchaseHistory: string;
  lastContact: string;
}

export type ViewType = 'scripts' | 'resources' | 'assistant' | 'crm';
