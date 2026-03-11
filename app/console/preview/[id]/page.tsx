'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FormSchema } from '@/types/forms';
import { FormRenderer } from '@/components/form/FormRenderer';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, CircleDashed, Trash2, LayoutDashboard, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';


export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleSubmit = async (responses: Record<string, any>) => {
    try {
      await apiClient.submitForm({
        schema_id: formId,
        responses,
        is_preview: true,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
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
        <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="p-4 bg-destructive/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-destructive/20">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive font-black uppercase tracking-widest text-sm mb-8">{error || 'Form Not Found'}</p>
            <Link href="/admin">
              <Button className="w-full h-12 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-bold shadow-xl transition-all">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        </div>

        <Card className="relative z-10 w-full max-w-lg border-border bg-card/50 backdrop-blur-2xl rounded-[3rem] overflow-hidden border">
          <CardContent className="pt-16 pb-16 px-12 text-center">
            <div className="p-6 bg-emerald-500/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <div className="space-y-4 mb-12">
              <h2 className="text-4xl font-black text-foreground tracking-tight">Form Submitted</h2>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                Your response has been successfully verified and saved to our database.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/console/admin">
                <Button
                  className="w-full h-14 bg-primary text-primary-foreground hover:opacity-90 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3">
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Admin Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => window.close()}
                className="w-full h-14 text-muted-foreground hover:text-foreground font-bold text-lg">
                Close Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 sticky top-0 border-b border-border bg-background/50 backdrop-blur-2xl px-6 h-20 flex items-center justify-between">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <Link href="/console/admin">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground transition-all bg-muted border border-border px-4 rounded-lg h-10 font-bold">
              <ArrowLeft className="w-4 h-4" />
              Exit Preview
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mr-4">
              <span className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                form.is_published ? "bg-emerald-500" : "bg-amber-500"
              )} />
              {form.is_published ? 'Live Form' : 'Draft Preview'}
            </div>
            {!form.is_published && (
              <Button
                onClick={async () => {
                  try {
                    await apiClient.updateForm(form.id, { is_published: true });
                    setForm({ ...form, is_published: true });
                  } catch (err) {
                    setError('Failed to publish form');
                  }
                }}
                className="h-10 px-6 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Publish Now
              </Button>
            )}
          </div>
        </div>
      </nav>

      {form.is_published && (
        <div className="relative z-10 bg-emerald-500/10 border-b border-emerald-500/20 py-3 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                Live
              </div>
              <p className="text-xs font-bold text-emerald-600">
                This form is currently live at its public link. You are viewing the <span className="underline decoration-2">preview mode</span>.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = `${window.location.origin}/public/form/${form.id}`;
                navigator.clipboard.writeText(url);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
              }}
              className="h-8 gap-2 bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 transition-all font-bold text-[10px] uppercase tracking-widest px-4 rounded-lg"
            >
              {copySuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Live Link
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {error && (
          <div className="mb-12 p-6 rounded-3xl bg-destructive/10 border border-destructive/20 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-destructive font-bold flex items-center gap-3">
              <Trash2 className="w-5 h-5" />
              {error}
            </p>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <FormRenderer
            title={form.title}
            description={form.description}
            fields={form.fields}
            logicRules={form.logic_rules}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );

}
