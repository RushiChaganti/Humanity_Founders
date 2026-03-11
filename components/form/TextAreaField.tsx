'use client';

import { FieldConfig } from '@/types/forms';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldLabel } from '@/components/ui/field';

interface TextAreaFieldProps {
  config: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function TextAreaField({
  config,
  value,
  onChange,
  error,
  disabled,
}: TextAreaFieldProps) {
  return (
    <Field>
      <FieldLabel>{config.label}</FieldLabel>
      <Textarea
        id={config.id}
        placeholder={config.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-h-[120px] bg-white/[0.03] border-white/5 hover:border-white/10 transition-all rounded-xl p-4 text-white placeholder:text-zinc-700 focus:ring-primary/20 resize-none"
      />

      {config.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {config.description}
        </p>
      )}
      {error && (
        <p id={`${config.id}-error`} className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </Field>
  );
}
