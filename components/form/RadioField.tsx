'use client';

import { FieldConfig } from '@/types/forms';
import { RadioGroup, Radio } from '@/components/ui/radio';

import { Field, FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';

interface RadioFieldProps {
  config: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function RadioField({
  config,
  value,
  onChange,
  error,
  disabled,
}: RadioFieldProps) {
  return (
    <Field>
      <FieldLabel>{config.label}</FieldLabel>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className="space-y-3"
      >
        {config.options?.map((option) => (
          <div key={option.value} className="flex items-center gap-3 group px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
            <Radio
              id={`${config.id}-${option.value}`}
              value={option.value}
              className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor={`${config.id}-${option.value}`}
              className="font-bold text-sm text-zinc-400 group-hover:text-white cursor-pointer transition-colors flex-1"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {config.description && (
        <p className="text-sm text-muted-foreground mt-2">
          {config.description}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-2">
          {error}
        </p>
      )}
    </Field>
  );
}
