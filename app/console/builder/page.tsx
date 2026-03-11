'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SchemaBuilder } from '@/components/builder/SchemaBuilder';
import { apiClient } from '@/lib/api-client';
import { FieldConfig, LogicRule } from '@/types/forms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, CircleDashed } from 'lucide-react';


import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { FormTemplate } from '@/lib/templates';

export default function BuilderPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);

  const handleSave = async (
    title: string,
    description: string,
    category: string,
    fields: FieldConfig[],
    rules: LogicRule[]
  ) => {
    try {
      setError(null);
      const newForm = await apiClient.createForm({
        title,
        description,
        category: category as any,
        fields,
        logic_rules: rules,
      });
      router.push(`/console/preview/${newForm.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save form');
    }
  };

  if (!selectedTemplate) {
    return (
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-black tracking-tight mb-4 text-foreground">
            Create New Form
          </h1>
          <p className="text-zinc-500 text-xl max-w-2xl mx-auto font-medium">
            Select a template to begin building, or start with a blank form.
          </p>
        </div>
        <TemplateSelector onSelect={setSelectedTemplate} />
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setSelectedTemplate(null)}
              className="w-10 h-10 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-foreground leading-none">
                {selectedTemplate.id === 'blank' ? 'Blank Form' : 'Template Selection'}
              </h1>
              <p className="text-zinc-500 text-lg font-medium max-w-xl mt-3">
                {selectedTemplate.id === 'blank'
                  ? 'Building a custom form from scratch.'
                  : `Refining the "${selectedTemplate.title}" template.`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
          <Sparkles className="w-4 h-4 text-primary" />
          Building Form
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 backdrop-blur-md">
          <p className="text-red-500 font-bold flex items-center gap-3">
            <CircleDashed className="w-4 h-4" />
            {error}
          </p>
        </div>
      )}

      <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-lg">
        <SchemaBuilder
          initialTitle={selectedTemplate.title}
          initialDescription={selectedTemplate.description}
          initialCategory={selectedTemplate.category}
          initialFields={selectedTemplate.fields}
          initialRules={selectedTemplate.logic_rules}
          onSave={handleSave}
        />
      </div>
    </div>
  );


}

