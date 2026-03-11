'use client';

import { FieldConfig } from '@/types/forms';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';

interface CheckboxFieldProps {
  config: FieldConfig;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export function CheckboxField({
  config,
  value,
  onChange,
  error,
  disabled,
}: CheckboxFieldProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <Field>
      <FieldLabel>{config.label}</FieldLabel>
      <div className="grid grid-cols-1 gap-3" role="group" aria-labelledby={`${config.id}-label`}>
        {config.options?.map((option) => (
          <div key={option.value} className="flex items-center gap-3 group px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
            <Checkbox
              id={`${config.id}-${option.value}`}
              checked={value.includes(option.value)}
              onCheckedChange={(checked) =>
                handleChange(option.value, checked as boolean)
              }
              disabled={disabled}
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
      </div>

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
