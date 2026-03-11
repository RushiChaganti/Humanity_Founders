'use client';

import { useState } from 'react';
import { FieldConfig, LogicRule } from '@/types/forms';
import { FieldBuilder } from './FieldBuilder';
import { RuleBuilder } from './RuleBuilder';
import { ImportJSONDialog } from './ImportJSONDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Field, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Sparkles, Upload } from 'lucide-react';


interface SchemaBuilderProps {
  initialTitle?: string;
  initialDescription?: string;
  initialFields?: FieldConfig[];
  initialRules?: LogicRule[];
  initialCategory?: string;
  onSave: (
    title: string,
    description: string,
    category: string,
    fields: FieldConfig[],
    rules: LogicRule[]
  ) => Promise<void>;
  isLoading?: boolean;
}

export function SchemaBuilder({
  initialTitle = '',
  initialDescription = '',
  initialFields = [],
  initialRules = [],
  initialCategory = 'general',
  onSave,
  isLoading = false,
}: SchemaBuilderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState<string>(initialCategory);
  const [fields, setFields] = useState<FieldConfig[]>(initialFields);
  const [rules, setRules] = useState<LogicRule[]>(initialRules);

  const [showFieldBuilder, setShowFieldBuilder] = useState(false);
  const [editingField, setEditingField] = useState<FieldConfig | undefined>();
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | undefined>();

  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [editingRule, setEditingRule] = useState<LogicRule | undefined>();
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | undefined>();

  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleAddField = () => {
    setEditingField(undefined);
    setEditingFieldIndex(undefined);
    setShowFieldBuilder(true);
  };

  const handleEditField = (index: number) => {
    setEditingField(fields[index]);
    setEditingFieldIndex(index);
    setShowFieldBuilder(true);
  };

  const handleSaveField = (field: FieldConfig) => {
    if (editingFieldIndex !== undefined) {
      const newFields = [...fields];
      newFields[editingFieldIndex] = field;
      setFields(newFields);
    } else {
      setFields([...fields, field]);
    }
    setShowFieldBuilder(false);
  };

  const handleDeleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleAddRule = () => {
    setEditingRule(undefined);
    setEditingRuleIndex(undefined);
    setShowRuleBuilder(true);
  };

  const handleEditRule = (index: number) => {
    setEditingRule(rules[index]);
    setEditingRuleIndex(index);
    setShowRuleBuilder(true);
  };

  const handleSaveRule = (rule: LogicRule) => {
    if (editingRuleIndex !== undefined) {
      const newRules = [...rules];
      newRules[editingRuleIndex] = rule;
      setRules(newRules);
    } else {
      setRules([...rules, rule]);
    }
    setShowRuleBuilder(false);
  };

  const handleDeleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleImportJSON = (data: { title: string; description: string; category?: string; fields: FieldConfig[]; logic_rules: LogicRule[] }) => {
    setTitle(data.title);
    setDescription(data.description);
    if (data.category) setCategory(data.category);
    setFields(data.fields);
    setRules(data.logic_rules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(title, description, category, fields, rules);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Basic Info */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">General Configuration</h2>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowImportDialog(true)}
            className="h-10 px-6 bg-muted border-border hover:border-primary/50 text-muted-foreground hover:text-foreground rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2"
          >
            <Upload className="w-4 h-4" />
            Import JSON
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Field>
            <FieldLabel className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] mb-3 block">Form Title</FieldLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Emergency Response Protocol"
              required
              className="h-14 bg-muted border-border hover:border-primary/50 transition-all rounded-2xl px-6 text-foreground placeholder:text-muted-foreground font-bold focus:ring-primary/20 text-lg"
            />
          </Field>

          <Field>
            <FieldLabel className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] mb-3 block">Form Description</FieldLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for this form..."
              rows={4}
              className="bg-muted border-border hover:border-primary/50 transition-all rounded-2xl p-6 text-foreground placeholder:text-muted-foreground font-medium focus:ring-primary/20 resize-none leading-relaxed"
            />
          </Field>

          <Field>
            <FieldLabel className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] mb-3 block">Category</FieldLabel>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 bg-muted border-border hover:border-primary/50 transition-all rounded-xl font-medium text-foreground">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border rounded-xl">
                <SelectItem value="general" className="font-medium">General / Default</SelectItem>
                <SelectItem value="safety" className="font-medium">Safety & Inspection</SelectItem>
                <SelectItem value="recruitment" className="font-medium">Recruitment & Hiring</SelectItem>
                <SelectItem value="feedback" className="font-medium">Feedback & Surveys</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      {/* Fields and Rules Tabs */}
      <Tabs defaultValue="fields" className="w-full">
        <TabsList className="flex w-full bg-muted border border-border p-1 rounded-2xl h-14 mb-8">
          <TabsTrigger
            value="fields"
            className="flex-1 rounded-xl text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground transition-all font-black uppercase tracking-widest text-[10px] shadow-none data-[state=active]:shadow-sm"
          >
            Questions ({fields.length})
          </TabsTrigger>
          <TabsTrigger
            value="rules"
            className="flex-1 rounded-xl text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground transition-all font-black uppercase tracking-widest text-[10px] shadow-none data-[state=active]:shadow-sm"
          >
            Visibility Rules ({rules.length})
          </TabsTrigger>
        </TabsList>

        {/* Fields Tab */}
        <TabsContent value="fields" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-2 px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Form Questions</h2>
            <Button
              type="button"
              onClick={handleAddField}
              className="h-10 px-6 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-24 bg-muted/20 border border-dashed border-border rounded-[2.5rem]">
              <p className="text-muted-foreground font-black uppercase tracking-widest text-xs mb-2">No questions yet</p>
              <p className="text-muted-foreground text-sm font-medium">Add questions to your form to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between bg-card border border-border p-5 rounded-[1.5rem] hover:bg-accent/5 hover:border-primary/20 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-mono text-[10px] text-muted-foreground border border-border">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-0.5">{field.label}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                        {field.type}
                        {field.required && (
                          <span className="text-primary bg-primary/10 px-2 py-0.5 rounded leading-none border border-primary/10">Required</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleEditField(index)}
                      className="h-10 w-10 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleDeleteField(index)}
                      className="h-10 w-10 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-2 px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Visibility Rules</h2>
            <Button
              type="button"
              onClick={handleAddRule}
              className="h-10 px-6 bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Rule
            </Button>
          </div>

          {rules.length === 0 ? (
            <div className="text-center py-24 bg-muted/20 border border-dashed border-border rounded-[2.5rem]">
              <p className="text-muted-foreground font-black uppercase tracking-widest text-xs mb-2">No rules yet</p>
              <p className="text-muted-foreground text-sm font-medium">No visibility rules have been added to this form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between bg-card border border-border p-5 rounded-[1.5rem] hover:bg-accent/5 hover:border-primary/20 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-accent">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{rule.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] font-black uppercase bg-muted border-border text-muted-foreground">
                          {rule.conditions.length} Trigger{rule.conditions.length !== 1 ? 's' : ''}
                        </Badge>
                        <span className="text-muted-foreground text-xs">→</span>
                        <Badge variant="outline" className="text-[9px] font-black uppercase bg-muted border-border text-muted-foreground">
                          {rule.actions.length} Executable{rule.actions.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleEditRule(index)}
                      className="h-10 w-10 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleDeleteRule(index)}
                      className="h-10 w-10 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Submit Button */}
      <div className="flex justify-end border-t border-white/5 pt-12">
        <Button
          type="submit"
          disabled={isLoading || !title || fields.length === 0}
          className="h-16 px-12 bg-primary text-primary-foreground hover:opacity-90 rounded-2xl font-black text-lg shadow-xl transition-all disabled:opacity-20 flex items-center gap-3"
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
              Saving Form...
            </>
          ) : (
            <>
              Save & Preview
            </>
          )}
        </Button>
      </div>

      {/* Dialogs */}
      <FieldBuilder
        field={editingField}
        onSave={handleSaveField}
        onClose={() => setShowFieldBuilder(false)}
        isOpen={showFieldBuilder}
      />

      <RuleBuilder
        fields={fields}
        rule={editingRule}
        onSave={handleSaveRule}
        onClose={() => setShowRuleBuilder(false)}
        isOpen={showRuleBuilder}
      />

      <ImportJSONDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImportJSON}
      />
    </form >
  );
}
