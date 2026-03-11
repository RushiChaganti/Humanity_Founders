'use client';

import { useState } from 'react';
import { FieldConfig, LogicRule, LogicCondition, LogicAction } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface RuleBuilderProps {
  fields: FieldConfig[];
  rule?: LogicRule;
  onSave: (rule: LogicRule) => void;
  onClose: () => void;
  isOpen: boolean;
}

const OPERATORS = [
  'equals',
  'not_equals',
  'contains',
  'is_selected',
  'matches_regex',
  'is_empty',
  'is_not_empty',
  'greater_than',
  'less_than',
  'in_list',
];

const ACTIONS = ['show', 'hide', 'require', 'unrequire', 'style'];

export function RuleBuilder({
  fields,
  rule,
  onSave,
  onClose,
  isOpen,
}: RuleBuilderProps) {
  const [name, setName] = useState(rule?.name || '');
  const [conditionType, setConditionType] = useState<'all' | 'any'>(
    rule?.condition_type || 'all'
  );
  const [conditions, setConditions] = useState<LogicCondition[]>(
    rule?.conditions || []
  );
  const [actions, setActions] = useState<LogicAction[]>(rule?.actions || []);

  const [tempCondition, setTempCondition] = useState<Partial<LogicCondition>>({
    field_id: '',
    operator: 'equals',
    value: '',
  });

  const [tempAction, setTempAction] = useState<Partial<LogicAction>>({
    field_id: '',
    action: 'show',
    value: '',
  });

  const handleAddCondition = () => {
    if (tempCondition.field_id && tempCondition.operator && tempCondition.value !== '') {
      setConditions([
        ...conditions,
        tempCondition as LogicCondition,
      ]);
      setTempCondition({
        field_id: '',
        operator: 'equals',
        value: '',
      });
    }
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleAddAction = () => {
    if (tempAction.field_id && tempAction.action) {
      setActions([
        ...actions,
        tempAction as LogicAction,
      ]);
      setTempAction({
        field_id: '',
        action: 'show',
        value: '',
      });
    }
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (name && conditions.length > 0 && actions.length > 0) {
      onSave({
        id: rule?.id || `rule-${Date.now()}`,
        name,
        condition_type: conditionType,
        conditions,
        actions,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-border text-foreground rounded-[2rem] p-8 custom-scrollbar">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-bold italic tracking-tight text-foreground">Edit Visibility Rule</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Define the logic that controls which questions are visible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Rule Name */}
          <Field>
            <FieldLabel className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2 block">Rule Name</FieldLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Show Question B if Answer is Yes"
              className="h-12 bg-muted border-border hover:border-primary/50 transition-all rounded-xl placeholder:text-muted-foreground font-medium text-foreground"
            />
          </Field>

          {/* Conditions */}
          <Card className="bg-card border-border rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted border-b border-border px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Conditions</CardTitle>
              <div className="flex bg-muted p-1 rounded-lg border border-border">
                {(['all', 'any'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setConditionType(type)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${conditionType === type ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {type === 'all' ? 'And' : 'Or'}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Add Condition Form */}
              <div className="space-y-4 p-5 bg-muted/50 rounded-2xl border border-border">
                <div className="grid grid-cols-3 gap-3">
                  <Field>
                    <FieldLabel className="text-[10px] text-muted-foreground font-bold uppercase mb-1">When</FieldLabel>
                    <Select
                      value={tempCondition.field_id || ''}
                      onValueChange={(value) =>
                        setTempCondition({ ...tempCondition, field_id: value })
                      }
                    >
                      <SelectTrigger className="bg-background border-border h-10 text-xs text-foreground">
                        <SelectValue placeholder="..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-foreground">
                        {fields.map((field) => (
                          <SelectItem key={field.id} value={field.id} className="text-xs">
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Is</FieldLabel>
                    <Select
                      value={tempCondition.operator || ''}
                      onValueChange={(value) =>
                        setTempCondition({ ...tempCondition, operator: value as any })
                      }
                    >
                      <SelectTrigger className="bg-background border-border h-10 text-xs text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-foreground">
                        {OPERATORS.map((op) => {
                          // Allow all operators for text/email/phone, but filter logically where needed
                          return (
                            <SelectItem key={op} value={op} className="text-xs font-mono">
                              {op.replace('_', ' ')}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Value</FieldLabel>
                    <Input
                      value={tempCondition.value as any}
                      onChange={(e) =>
                        setTempCondition({ ...tempCondition, value: e.target.value })
                      }
                      placeholder="Value"
                      className="bg-background border-border h-10 text-xs text-foreground"
                    />
                  </Field>
                </div>

                <Button
                  type="button"
                  onClick={handleAddCondition}
                  variant="outline"
                  className="w-full h-10 gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 font-bold text-xs uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4" />
                  Add Condition
                </Button>
              </div>

              {/* Conditions List */}
              {conditions.length > 0 && (
                <div className="space-y-2">
                  {conditions.map((cond, index) => {
                    const field = fields.find((f) => f.id === cond.field_id);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted/50 p-3 rounded-xl border border-border group transition-all"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold text-muted-foreground">If:</span>
                          <span className="text-foreground font-medium underline decoration-primary/30 underline-offset-4">{field?.label}</span>
                          <span className="text-primary font-mono text-[10px] px-1.5 py-0.5 bg-primary/10 rounded border border-primary/10">{cond.operator}</span>
                          <span className="text-muted-foreground italic">"{String(cond.value)}"</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCondition(index)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-card border-border rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="bg-muted border-b border-border px-6 py-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Add Action Form */}
              <div className="space-y-4 p-5 bg-muted/50 rounded-2xl border border-border">
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Select Question</FieldLabel>
                    <Select
                      value={tempAction.field_id || ''}
                      onValueChange={(value) =>
                        setTempAction({ ...tempAction, field_id: value })
                      }
                    >
                      <SelectTrigger className="bg-background border-border h-10 text-xs text-foreground">
                        <SelectValue placeholder="..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-foreground">
                        {fields.map((field) => (
                          <SelectItem key={field.id} value={field.id} className="text-xs">
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Action</FieldLabel>
                    <Select
                      value={tempAction.action || ''}
                      onValueChange={(value) =>
                        setTempAction({ ...tempAction, action: value as any })
                      }
                    >
                      <SelectTrigger className="bg-background border-border h-10 text-xs text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-foreground">
                        {ACTIONS.map((action) => (
                          <SelectItem key={action} value={action} className="text-xs uppercase font-bold">
                            {action}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                {tempAction.action === 'style' && (
                  <Field>
                    <FieldLabel className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Style Parameters (JSON)</FieldLabel>
                    <Input
                      value={tempAction.value as any}
                      onChange={(e) =>
                        setTempAction({ ...tempAction, value: e.target.value })
                      }
                      placeholder='{"opacity": 0.5, "pointerEvents": "none"}'
                      className="bg-background border-border h-10 text-xs font-mono text-foreground"
                    />
                  </Field>
                )}

                <Button
                  type="button"
                  onClick={handleAddAction}
                  variant="outline"
                  className="w-full h-10 gap-2 border-accent/20 bg-accent/5 text-accent hover:bg-accent/10 font-bold text-xs uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4" />
                  Add Action
                </Button>
              </div>

              {/* Actions List */}
              {actions.length > 0 && (
                <div className="space-y-2">
                  {actions.map((action, index) => {
                    const field = fields.find((f) => f.id === action.field_id);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted/50 p-3 rounded-xl border border-border group transition-all hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase text-accent bg-accent/10 px-2 py-0.5 rounded leading-none border border-accent/10">{action.action}</span>
                          <span className="text-sm font-medium text-foreground">{field?.label}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAction(index)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 justify-end mt-12 border-t border-border pt-8">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground hover:bg-muted h-12 px-6 font-bold">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name || conditions.length === 0 || actions.length === 0}
            className="h-12 px-8 bg-primary text-primary-foreground hover:opacity-90 font-black rounded-xl shadow-lg transition-all disabled:opacity-20"
          >
            Save Rule
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  );
}
