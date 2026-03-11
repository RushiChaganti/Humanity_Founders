'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileDown, Upload, FileCode } from 'lucide-react';

interface ImportJSONDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: { title: string; description: string; fields: any[]; logic_rules: any[] }) => void;
}

const SAMPLE_JSON = {
    title: "Emergency Response Protocol",
    description: "Standard operating procedure for safety incidents.",
    fields: [
        {
            id: "field_1",
            type: "text",
            label: "Incident Location",
            required: true,
            placeholder: "e.g., Sector 7G"
        },
        {
            id: "field_2",
            type: "select",
            label: "Severity level",
            required: true,
            options: [
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "Critical", value: "critical" }
            ]
        }
    ],
    logic_rules: [
        {
            id: "rule_1",
            name: "Show alert on critical",
            condition_type: "any",
            conditions: [
                {
                    field_id: "field_2",
                    operator: "equals",
                    value: "critical"
                }
            ],
            actions: [
                {
                    field_id: "field_1",
                    action: "style",
                    value: "{\"border\": \"2px solid red\"}"
                }
            ]
        }
    ]
};

export function ImportJSONDialog({ isOpen, onClose, onImport }: ImportJSONDialogProps) {
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleImport = () => {
        try {
            const parsed = JSON.parse(jsonText);
            if (!parsed.fields || !Array.isArray(parsed.fields)) {
                throw new Error('Invalid JSON: "fields" must be an array');
            }
            onImport({
                title: parsed.title || 'Imported Form',
                description: parsed.description || '',
                fields: parsed.fields,
                logic_rules: parsed.logic_rules || [],
            });
            setJsonText('');
            setError(null);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid JSON format');
        }
    };

    const loadSample = () => {
        setJsonText(JSON.stringify(SAMPLE_JSON, null, 2));
        setError(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl bg-background border-border text-foreground rounded-[2rem] overflow-hidden">
                <DialogHeader className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Upload className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">Import JSON Schema</DialogTitle>
                    </div>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Paste your JSON form definition below to quickly initialize your form.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="relative group">
                        <Textarea
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            placeholder='{ "title": "Example", "fields": [...] }'
                            className="min-h-[400px] font-mono text-xs bg-muted border-border hover:border-primary/30 transition-all rounded-2xl p-6 resize-none focus:ring-primary/20 leading-relaxed"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={loadSample}
                                className="bg-background/50 backdrop-blur-sm border border-border hover:bg-background text-xs gap-2 font-bold uppercase tracking-widest px-3 h-8 shadow-sm"
                            >
                                <FileCode className="w-3.5 h-3.5" />
                                Load Template
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                            <p className="text-destructive text-xs font-bold uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t border-border">
                        <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground font-bold h-12 px-6">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={!jsonText.trim()}
                            className="h-12 px-8 bg-primary text-primary-foreground hover:opacity-90 font-black rounded-xl shadow-lg transition-all disabled:opacity-20 gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Import Schema
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
