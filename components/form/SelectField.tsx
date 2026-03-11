'use client';

import { FieldConfig } from '@/types/forms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldLabel } from '@/components/ui/field';

interface SelectFieldProps {
  config: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function SelectField({
  config,
  value,
  onChange,
  error,
  disabled,
}: SelectFieldProps) {
  return (
    <Field>
      <FieldLabel>{config.label}</FieldLabel>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={config.id}
          className="h-14 bg-white/[0.03] border-white/5 hover:border-white/10 transition-all rounded-xl px-4 text-zinc-300 focus:ring-primary/20"
        >
          <SelectValue placeholder={config.placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent className="bg-[#0f0f0f] border-white/10 text-white backdrop-blur-3xl rounded-xl">
          {config.options?.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="hover:bg-white/10 focus:bg-white/10 transition-colors py-3"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
