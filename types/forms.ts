/**
 * Form-related TypeScript types
 */

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'email' | 'phone';
  label: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: FieldOption[];
  validation_regex?: string;
  validation_message?: string;
  max_length?: number;
}

export interface LogicCondition {
  field_id: string;
  operator:
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'starts_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'greater_than'
  | 'less_than'
  | 'in_list'
  | 'matches_regex'
  | 'is_selected';

  value: any;
}

export interface LogicAction {
  field_id: string;
  action: 'show' | 'hide' | 'require' | 'unrequire' | 'style';
  value?: any;
}

export interface LogicRule {
  id: string;
  name: string;
  conditions: LogicCondition[];
  condition_type: 'all' | 'any';
  actions: LogicAction[];
}

export interface FormSchema {
  id: string;
  parent_id?: string;
  version: number;
  title: string;
  category?: 'safety' | 'recruitment' | 'feedback' | 'general';
  description?: string;
  fields: FieldConfig[];
  logic_rules: LogicRule[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  schema_id: string;
  responses: Record<string, any>;
  is_preview: boolean;
  submitted_at: string;
}

export interface BranchInfo {
  id: string;
  parent_id?: string;
  version: number;
  title: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BranchesResponse {
  root_id: string;
  branches: BranchInfo[];
}
export interface FormSchemaCreate {
  title: string;
  category?: 'safety' | 'recruitment' | 'feedback' | 'general';
  description?: string;
  fields: FieldConfig[];
  logic_rules: LogicRule[];
}

export interface FormSchemaUpdate {
  title?: string;
  category?: 'safety' | 'recruitment' | 'feedback' | 'general';
  description?: string;
  fields?: FieldConfig[];
  logic_rules?: LogicRule[];
  is_published?: boolean;
}

export interface FormSubmissionCreate {
  schema_id: string;
  responses: Record<string, any>;
  is_preview?: boolean;
}
