'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FormSchema } from '@/types/forms';
import { FormRenderer } from '@/components/form/FormRenderer';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, CircleDashed, AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PublicFormPage() {
    const params = useParams();
    const formId = params.id as string;

    const [form, setForm] = useState<FormSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const loadForm = async () => {
            try {
                const formData = await apiClient.getForm(formId);

                // Enforcement: If not published, don't allow public access
                if (!formData.is_published) {
                    setError('This form is not currently accepting submissions.');
                    return;
                }

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

    if (error || !form) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden border shadow-2xl">
                    <CardContent className="pt-12 pb-12 text-center">
                        <div className="p-4 bg-amber-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                            <AlertCircle className="w-8 h-8 text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-black text-foreground mb-4">Form Unavailable</h2>
                        <p className="text-muted-foreground font-medium mb-8">
                            {error || 'The form you are looking for could not be found or is no longer active.'}
                        </p>
                        <Link href="/">
                            <Button className="w-full h-12 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                <Home className="w-4 h-4" />
                                Return Home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent)]">
                <Card className="w-full max-w-lg border-border bg-card/50 backdrop-blur-2xl rounded-[3rem] overflow-hidden border shadow-2xl animate-in zoom-in-95 duration-500">
                    <CardContent className="pt-16 pb-16 px-12 text-center">
                        <div className="p-6 bg-emerald-500/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]">
                            <CheckCircle className="w-12 h-12 text-emerald-500" />
                        </div>
                        <div className="space-y-4 mb-2">
                            <h2 className="text-4xl font-black text-foreground tracking-tight">Success!</h2>
                            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                                Thank you for your submission. Your response has been securely recorded.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <FormRenderer
                        title={form.title}
                        description={form.description}
                        fields={form.fields}
                        logicRules={form.logic_rules}
                        onSubmit={handleSubmit}
                        isLoading={false}
                    />
                </div>

                <footer className="mt-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                        Powered by Humanity Founders
                    </p>
                </footer>
            </div>
        </div>
    );
}
