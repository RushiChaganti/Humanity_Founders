'use client';

import { FieldConfig } from '@/types/forms';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field, FieldLabel } from '@/components/ui/field';

interface TextFieldProps {
  config: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function TextField({
  config,
  value,
  onChange,
  error,
  disabled,
}: TextFieldProps) {
  return (
    <Field>
      <FieldLabel>{config.label}</FieldLabel>
      <Input
        type={config.type === 'email' ? 'email' : config.type === 'phone' ? 'tel' : 'text'}
        id={config.id}
        placeholder={config.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-14 bg-white/[0.03] border-white/5 hover:border-white/10 transition-all rounded-xl px-4 text-white placeholder:text-zinc-700 focus:ring-primary/20"
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
