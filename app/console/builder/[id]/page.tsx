'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FormSchema, FieldConfig, LogicRule } from '@/types/forms';
import { SchemaBuilder } from '@/components/builder/SchemaBuilder';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CircleDashed, Trash2, LayoutDashboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


export default function EditBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const formData = await apiClient.getForm(formId);
        setForm(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form');
      } finally {
        setIsLoading(false);
      }
    };

    if (formId) {
      loadForm();
    }
  }, [formId]);

  const handleSave = async (
    title: string,
    description: string,
    category: string,
    fields: FieldConfig[],
    rules: LogicRule[]
  ) => {
    try {
      setError(null);
      await apiClient.updateForm(formId, {
        title,
        description,
        category: category as any,
        fields,
        logic_rules: rules,
      });
      router.push(`/console/preview/${formId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save form');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <CircleDashed className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading Form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md border-border bg-card rounded-[2rem] overflow-hidden shadow-lg">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="p-4 bg-red-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-8">{error || 'Form Not Found'}</p>
            <Button
              onClick={() => router.push('/console/admin')}
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 animate-in fade-in duration-700">
      <div className="mb-12 space-y-4 border-b border-border pb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center border border-border">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-foreground">
              Edit Form: {form.title}
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-xl">
              Edit your form questions and logic rules.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-10 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 backdrop-blur-md">
          <p className="text-red-500 font-bold flex items-center gap-3">
            <Trash2 className="w-5 h-5" />
            {error}
          </p>
        </div>
      )}

      <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-lg">
        <SchemaBuilder
          initialTitle={form.title}
          initialDescription={form.description}
          initialFields={form.fields}
          initialRules={form.logic_rules}
          onSave={handleSave}
          isLoading={isLoading}
        />
      </div>
    </div>
  );

}
