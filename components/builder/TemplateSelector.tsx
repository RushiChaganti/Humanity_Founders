'use client';

import { TEMPLATES, FormTemplate } from '@/lib/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout, FileText, Activity, Users, MessageSquare, ClipboardCheck } from 'lucide-react';

interface TemplateSelectorProps {
    onSelect: (template: FormTemplate) => void;
}

const getCategoryIcon = (category?: string, id?: string) => {
    switch (category) {
        case 'safety':
            return <Activity className="w-5 h-5" />;
        case 'recruitment':
            return <Users className="w-5 h-5" />;
        case 'feedback':
            return <MessageSquare className="w-5 h-5" />;
        case 'general':
            return <ClipboardCheck className="w-5 h-5" />;
        default:
            return <Layout className="w-5 h-5" />;
    }
};

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
                className="hover:border-dashed border-dashed bg-muted/30 cursor-pointer transition-all hover:bg-muted/50"
                onClick={() => onSelect({ id: 'blank', title: '', description: '', fields: [], logic_rules: [] })}
            >
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                            <FileText className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-lg">Blank Form</CardTitle>
                    </div>
                    <CardDescription>Start from scratch with a completely empty form.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end">
                        <Button variant="ghost" size="sm">
                            Create Blank →
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {TEMPLATES.map((template) => (
                <Card
                    key={template.id}
                    className="hover:border-primary/50 cursor-pointer transition-all hover:shadow-md group"
                    onClick={() => onSelect(template)}
                >
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                {getCategoryIcon(template.category, template.id)}
                            </div>
                            <CardTitle className="text-lg">{template.title}</CardTitle>
                        </div>
                        <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground font-medium">
                                {template.fields.length} Fields • {template.logic_rules.length} Logic Rules
                            </span>
                            <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                                Use Template →
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
