/**
 * Client-side logic engine for evaluating form conditional rules.
 * This mirrors the backend logic engine for consistency.
 */

import { FieldConfig, LogicRule, LogicCondition, LogicAction } from '@/types/forms';

export function evaluateCondition(
  condition: LogicCondition,
  responses: Record<string, any>
): boolean {
  const fieldValue = responses[condition.field_id];

  switch (condition.operator) {
    case 'equals':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value);
      }
      return fieldValue === condition.value;

    case 'not_equals':
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(condition.value);
      }
      return fieldValue !== condition.value;

    case 'contains':
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(String(condition.value).toLowerCase());
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value);
      }
      return false;

    case 'is_selected':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value);
      }
      return fieldValue === condition.value;

    case 'matches_regex':
      if (typeof fieldValue === 'string' && condition.value) {
        try {
          const regex = new RegExp(condition.value);
          return regex.test(fieldValue);
        } catch {
          return false;
        }
      }
      return false;

    case 'is_empty':
      return (
        fieldValue === null ||
        fieldValue === '' ||
        fieldValue === undefined ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );

    case 'is_not_empty':
      return (
        fieldValue !== null &&
        fieldValue !== '' &&
        fieldValue !== undefined &&
        (!Array.isArray(fieldValue) || fieldValue.length > 0)
      );


    case 'greater_than':
      try {
        return Number(fieldValue) > Number(condition.value);
      } catch {
        return false;
      }

    case 'less_than':
      try {
        return Number(fieldValue) < Number(condition.value);
      } catch {
        return false;
      }

    case 'in_list':
      if (Array.isArray(condition.value)) {
        return condition.value.includes(fieldValue);
      }
      return false;

    default:
      return false;
  }
}

export function evaluateConditions(
  conditions: LogicCondition[],
  conditionType: 'all' | 'any',
  responses: Record<string, any>
): boolean {
  if (conditions.length === 0) return true;

  const results = conditions.map((cond) => evaluateCondition(cond, responses));

  if (conditionType === 'all') {
    return results.every((r) => r);
  } else {
    return results.some((r) => r);
  }
}

export function evaluateRule(
  rule: LogicRule,
  responses: Record<string, any>
): LogicAction[] {
  if (evaluateConditions(rule.conditions, rule.condition_type, responses)) {
    return rule.actions;
  }
  return [];
}

export function evaluateAllRules(
  rules: LogicRule[],
  responses: Record<string, any>
): Record<string, LogicAction[]> {
  const fieldActions: Record<string, LogicAction[]> = {};

  for (const rule of rules) {
    const actions = evaluateRule(rule, responses);
    for (const action of actions) {
      if (!fieldActions[action.field_id]) {
        fieldActions[action.field_id] = [];
      }
      fieldActions[action.field_id].push(action);
    }
  }

  return fieldActions;
}

export function getVisibleFields(
  fields: FieldConfig[],
  rules: LogicRule[],
  responses: Record<string, any>
): Set<string> {
  // By default, all fields are visible
  const visibleFields = new Set(fields.map((f) => f.id));
  const fieldActions = evaluateAllRules(rules, responses);

  for (const [fieldId, actions] of Object.entries(fieldActions)) {
    for (const action of actions) {
      if (action.action === 'hide') {
        visibleFields.delete(fieldId);
      } else if (action.action === 'show') {
        visibleFields.add(fieldId);
      }
    }
  }

  return visibleFields;
}

export function getRequiredFields(
  fields: FieldConfig[],
  rules: LogicRule[],
  responses: Record<string, any>
): Set<string> {
  // Start with statically required fields
  const requiredFields = new Set(
    fields.filter((f) => f.required).map((f) => f.id)
  );

  const fieldActions = evaluateAllRules(rules, responses);

  for (const [fieldId, actions] of Object.entries(fieldActions)) {
    for (const action of actions) {
      if (action.action === 'require') {
        requiredFields.add(fieldId);
      } else if (action.action === 'unrequire') {
        requiredFields.delete(fieldId);
      }
    }
  }

  return requiredFields;
}

export function getFieldStyles(
  rules: LogicRule[],
  responses: Record<string, any>
): Record<string, Record<string, any>> {
  const fieldStyles: Record<string, Record<string, any>> = {};
  const fieldActions = evaluateAllRules(rules, responses);

  for (const [fieldId, actions] of Object.entries(fieldActions)) {
    for (const action of actions) {
      if (action.action === 'style' && action.value) {
        if (!fieldStyles[fieldId]) {
          fieldStyles[fieldId] = {};
        }
        Object.assign(fieldStyles[fieldId], action.value);
      }
    }
  }

  return fieldStyles;
}
