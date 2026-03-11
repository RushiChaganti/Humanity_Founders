'use client';

import { useState, useEffect } from 'react';
import { FieldConfig } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { X, Plus } from 'lucide-react';

interface FieldBuilderProps {
  field?: FieldConfig;
  onSave: (field: FieldConfig) => void;
  onClose: () => void;
  isOpen: boolean;
}

const FIELD_TYPES = ['text', 'textarea', 'email', 'phone', 'select', 'radio', 'checkbox', 'date'] as const;

export function FieldBuilder({
  field,
  onSave,
  onClose,
  isOpen,
}: FieldBuilderProps) {
  const [formData, setFormData] = useState<FieldConfig>(
    field || {
      id: `field-${Date.now()}`,
      type: 'text',
      label: '',
      required: false,
      options: [],
    }
  );

  const [options, setOptions] = useState<any[]>([]);
  const [optionInput, setOptionInput] = useState('');
  const [optionValueInput, setOptionValueInput] = useState('');

  // Reset form data when the dialog opens or field changes
  useEffect(() => {
    if (isOpen) {
      if (field) {
        setFormData(field);
        setOptions(field.options || []);
      } else {
        setFormData({
          id: `field-${Date.now()}`,
          type: 'text',
          label: '',
          required: false,
          options: [],
        });
        setOptions([]);
      }
      setOptionInput('');
      setOptionValueInput('');
    }
  }, [isOpen, field]);

  const handleAddOption = () => {
    if (optionInput.trim() && optionValueInput.trim()) {
      setOptions([
        ...options,
        { label: optionInput, value: optionValueInput },
      ]);
      setOptionInput('');
      setOptionValueInput('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      options: ['select', 'radio', 'checkbox'].includes(formData.type)
        ? options
        : undefined,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background border-border text-foreground rounded-[2rem] overflow-hidden">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {field ? 'Edit Question' : 'Add New Question'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Configure question settings and validation rules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Basic Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2 block">Question Type</FieldLabel>
              <Select
                value={formData.type}
                onValueChange={(type) =>
                  setFormData({ ...formData, type: type as any })
                }
              >
                <SelectTrigger className="h-12 bg-muted border-border hover:border-primary/50 transition-all rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="hover:bg-accent cursor-pointer">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2 block">Question Text</FieldLabel>
              <Input
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Enter your question here"
                className="h-12 bg-muted border-border hover:border-primary/50 transition-all rounded-xl placeholder:text-muted-foreground text-foreground"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2 block">Help Text</FieldLabel>
            <Input
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Help text for users (optional)"
              className="h-12 bg-muted border-border hover:border-primary/50 transition-all rounded-xl placeholder:text-muted-foreground text-foreground"
            />
          </Field>

          <Field>
            <FieldLabel className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2 block">Placeholder</FieldLabel>
            <Input
              value={formData.placeholder || ''}
              onChange={(e) =>
                setFormData({ ...formData, placeholder: e.target.value })
              }
              placeholder="Example: Enter your name"
              className="h-12 bg-muted border-border hover:border-primary/50 transition-all rounded-xl placeholder:text-muted-foreground text-foreground"
            />
          </Field>

          {/* Validation Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2 block">Max Length</FieldLabel>
              <Input
                type="number"
                value={formData.max_length || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_length: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="No limit"
                className="h-12 bg-muted border-border hover:border-primary/50 transition-all rounded-xl placeholder:text-muted-foreground text-foreground"
              />
            </Field>

            <Field>
              <FieldLabel className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2 block">Validation Pattern (Regex)</FieldLabel>
              <Input
                value={formData.validation_regex || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    validation_regex: e.target.value || undefined,
                  })
                }
                placeholder="e.g., ^[0-9]+$"
                className="h-12 bg-muted border-border hover:border-primary/50 transition-all rounded-xl font-mono text-sm placeholder:text-muted-foreground text-foreground"
              />
            </Field>

            <Field>
              <FieldLabel className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2 block">Validation Error Message</FieldLabel>
              <Input
                value={formData.validation_message || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    validation_message: e.target.value || undefined,
                  })
                }
                placeholder="e.g., Must contain only numbers"
                className="h-12 bg-muted border-border hover:border-primary/50 transition-all rounded-xl placeholder:text-muted-foreground text-foreground"
              />
            </Field>
          </div>

          {/* Required Checkbox */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted border border-border">
            <Checkbox
              id="required"
              checked={formData.required}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, required: checked as boolean })
              }
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="required" className="text-sm font-bold text-foreground cursor-pointer select-none">
              Required question
            </label>
          </div>

          {['select', 'radio', 'checkbox'].includes(formData.type) && (
            <Card className="bg-muted/30 border-border rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/50 border-b border-border px-6 py-4">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Answer Options</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Option Input */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Display Label</FieldLabel>
                      <Input
                        value={optionInput}
                        onChange={(e) => setOptionInput(e.target.value)}
                        placeholder="Label"
                        className="bg-background border-border h-10 text-sm text-foreground"
                      />
                    </Field>
                    <Field>
                      <FieldLabel className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Value</FieldLabel>
                      <Input
                        value={optionValueInput}
                        onChange={(e) => setOptionValueInput(e.target.value)}
                        placeholder="Value"
                        className="bg-background border-border h-10 text-sm font-mono text-foreground"
                      />
                    </Field>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddOption}
                    variant="outline"
                    className="w-full h-10 gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 font-bold text-xs uppercase tracking-widest"
                  >
                    <Plus className="w-4 h-4" />
                    Add Option
                  </Button>
                </div>

                {/* Options List */}
                {options.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted/50 p-3 rounded-xl border border-border group transition-all hover:bg-muted"
                      >
                        <div>
                          <p className="text-sm font-bold text-foreground leading-none mb-1">{option.label}</p>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter italic">
                            {option.value}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOption(index)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex gap-3 justify-end mt-8 border-t border-border pt-6">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground hover:bg-muted h-12 px-6 font-bold">
            Cancel
          </Button>
          <Button onClick={handleSave} className="h-12 px-8 bg-primary text-primary-foreground hover:opacity-90 font-black rounded-xl shadow-lg transition-all">
            Save Question
          </Button>
        </div>
      </DialogContent >
    </Dialog >

  );
}
