'use client';

import { useState, useMemo } from 'react';
import { FieldConfig, LogicRule } from '@/types/forms';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
import { SelectField } from './SelectField';
import { RadioField } from './RadioField';
import { CheckboxField } from './CheckboxField';
import { DateField } from './DateField';
import { Button } from '@/components/ui/button';
import { getRequiredFields, getVisibleFields } from '@/lib/logic';
import { cn } from '@/lib/utils';


interface FormRendererProps {
  title: string;
  description?: string;
  fields: FieldConfig[];
  logicRules: LogicRule[];
  onSubmit: (responses: Record<string, any>) => Promise<void>;
  isLoading?: boolean;
}

export function FormRenderer({
  title,
  description,
  fields,
  logicRules,
  onSubmit,
  isLoading = false,
}: FormRendererProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);

  // Calculate visible and required fields based on logic rules
  const { visibleFields, requiredFields } = useMemo(() => {
    const visible = getVisibleFields(fields, logicRules, responses);
    const required = getRequiredFields(fields, logicRules, responses);
    return { visibleFields: visible, requiredFields: required };
  }, [fields, logicRules, responses]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of fields) {
      if (!visibleFields.has(field.id)) continue;
      const value = responses[field.id];
      const isRequired = requiredFields.has(field.id);

      if (
        isRequired &&
        (value === undefined || value === null || value === '' || value.length === 0)
      ) {
        newErrors[field.id] = `${field.label} is required`;
        continue;
      }

      if (field.validation_regex && value) {
        const regex = new RegExp(field.validation_regex);
        if (!regex.test(value)) {
          newErrors[field.id] = field.validation_message || `${field.label} format is invalid`;
        }
      }

      if (field.max_length && value && value.length > field.max_length) {
        newErrors[field.id] = `${field.label} must be ${field.max_length} characters or less`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await onSubmit(responses);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-3 pb-24">
      {/* Header Card */}
      <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-3xl relative">
        <div className="h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50 w-full" />
        <div className="p-8 sm:p-10 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-xl">{description}</p>
          )}
          <div className="border-t border-border pt-6">
            <p className="text-[10px] text-destructive font-black uppercase tracking-widest">* Required field</p>
          </div>
        </div>
      </div>

      {/* Field Cards */}
      <div className="space-y-4">
        {fields.map((field) => {
          if (!visibleFields.has(field.id)) return null;

          const fieldValue = responses[field.id];
          const fieldError = errors[field.id];
          const isRequired = requiredFields.has(field.id);
          const disabled = isLoading || submitting;
          const isFocused = focusedFieldId === field.id;

          return (
            <div
              key={field.id}
              onClick={() => setFocusedFieldId(field.id)}
              className={cn(
                "relative bg-card/50 border transition-all duration-300 rounded-[1.5rem] p-8 sm:p-10 space-y-6 group overflow-hidden backdrop-blur-2xl",
                isFocused ? "border-primary shadow-2xl bg-card" : "border-border hover:border-primary/20 hover:bg-card/80",
                fieldError ? "border-destructive/40" : ""
              )}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <label className="text-lg font-bold text-foreground flex items-center gap-1.5 leading-tight group-hover:text-primary transition-colors">
                    {field.label}
                    {isRequired && <span className="text-destructive text-xl ml-1 leading-none">*</span>}
                  </label>
                </div>
                {field.description && (
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-lg">{field.description}</p>
                )}
              </div>

              <div className="pt-2">
                {(field.type === 'text' || field.type === 'email' || field.type === 'phone') && (
                  <TextField
                    config={{ ...field, required: isRequired }}
                    value={fieldValue || ''}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={fieldError}
                    disabled={disabled}
                  />
                )}

                {field.type === 'textarea' && (
                  <TextAreaField
                    config={{ ...field, required: isRequired }}
                    value={fieldValue || ''}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={fieldError}
                    disabled={disabled}
                  />
                )}

                {field.type === 'select' && (
                  <SelectField
                    config={{ ...field, required: isRequired }}
                    value={fieldValue || ''}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={fieldError}
                    disabled={disabled}
                  />
                )}

                {field.type === 'radio' && (
                  <RadioField
                    config={{ ...field, required: isRequired }}
                    value={fieldValue || ''}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={fieldError}
                    disabled={disabled}
                  />
                )}

                {field.type === 'checkbox' && (
                  <CheckboxField
                    config={{ ...field, required: isRequired }}
                    value={fieldValue || []}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={fieldError}
                    disabled={disabled}
                  />
                )}

                {field.type === 'date' && (
                  <DateField
                    config={{ ...field, required: isRequired }}
                    value={fieldValue || ''}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={fieldError}
                    disabled={disabled}
                  />
                )}
              </div>

              {fieldError && (
                <div className="flex items-center gap-2 text-destructive pt-2 text-sm font-bold uppercase tracking-widest animate-in fade-in duration-300">
                  <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  {fieldError}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-8 flex items-center justify-between">
        <Button
          type="submit"
          disabled={submitting || isLoading}
          className="h-12 px-8 bg-primary text-primary-foreground hover:opacity-90 font-black text-sm rounded-xl shadow-2xl transition-all disabled:opacity-20 uppercase tracking-widest"
        >
          {submitting ? 'Submitting...' : 'Submit Response'}
        </Button>
        <button
          type="button"
          onClick={() => setResponses({})}
          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em]"
        >
          Clear form
        </button>
      </div>
    </form>
  );
}
