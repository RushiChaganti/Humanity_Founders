'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { FieldConfig } from '@/types/forms';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Field, FieldLabel } from '@/components/ui/field';
import { motion, AnimatePresence } from 'framer-motion';

interface DateFieldProps {
    config: FieldConfig;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export function DateField({
    config,
    value,
    onChange,
    error,
    disabled,
}: DateFieldProps) {
    const date = value ? new Date(value) : undefined;

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            // Store in ISO format for consistency
            onChange(format(selectedDate, 'yyyy-MM-dd'));
        } else {
            onChange('');
        }
    };

    return (
        <Field className="space-y-4">
            <FieldLabel className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] mb-1 block">
                {config.label}
            </FieldLabel>

            <Popover>
                <PopoverTrigger asChild>
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <Button
                            variant={"outline"}
                            disabled={disabled}
                            className={cn(
                                "h-14 w-full justify-between bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all rounded-2xl px-6 font-bold text-left shadow-sm group",
                                !value && "text-zinc-600",
                                value && "text-white",
                                error && "border-red-500/50"
                            )}
                        >
                            <span className="truncate">
                                {value ? format(date!, "PPP") : (config.placeholder || "Select system date...")}
                            </span>
                            <CalendarIcon className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                        </Button>
                    </motion.div>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 bg-[#0a0a0a]/95 border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark"
                    align="start"
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        initialFocus
                        className="p-4"
                    />
                </PopoverContent>
            </Popover>

            <AnimatePresence mode="wait">
                {error ? (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px] mt-2"
                    >
                        {error}
                    </motion.p>
                ) : config.description && (
                    <p className="text-[10px] text-zinc-600 font-medium tracking-wide uppercase">
                        {config.description}
                    </p>
                )}
            </AnimatePresence>
        </Field>
    );
}
