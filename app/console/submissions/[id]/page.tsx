'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FormSchema, FormSubmission } from '@/types/forms';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Trash2, CircleDashed, History, Download, Search, ChevronLeft, ChevronRight, AlertCircle, FileSpreadsheet, ShieldAlert, ShieldQuestion, LifeBuoy, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function SubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<FormSchema | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'individual'>('summary');
  const [individualIndex, setIndividualIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [formData, submissionsData] = await Promise.all([
          apiClient.getForm(formId),
          apiClient.getFormSubmissions(formId),
        ]);
        setForm(formData);
        const allSubmissions = submissionsData.submissions;
        setSubmissions(allSubmissions);
        if (allSubmissions.length > 0) {
          setSelectedSubmission(allSubmissions[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    if (formId) {
      loadData();
    }
  }, [formId]);

  const handleExportCSV = () => {
    if (!form || submissions.length === 0) return;

    const headers = ['ID', 'Timestamp', ...form.fields.map(f => f.label)];
    const rows = submissions.map(s => [
      s.id,
      new Date(s.submitted_at).toISOString(),
      ...form.fields.map(f => {
        const val = s.responses[f.id];
        return Array.isArray(val) ? val.join('|') : String(val || '');
      })
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${form.title.toLowerCase().replace(/\s+/g, '_')}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <CircleDashed className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading Submissions...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md border-border bg-card rounded-[1.5rem] overflow-hidden shadow-lg">
          <CardContent className="pt-8 text-center">
            <p className="text-destructive font-bold mb-6 flex items-center justify-center gap-2">
              <Trash2 className="w-5 h-5" />
              {error || 'Form not found'}
            </p>
            <Link href="/console/admin">
              <Button className="w-full h-12 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-bold shadow-xl transition-all">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredSubmissions = searchQuery
    ? submissions.filter(s =>
      Object.values(s.responses).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : submissions;

  const getCategoryTheme = () => {
    const category = form.category || 'general';
    switch (category) {
      case 'recruitment':
        return {
          patterns: {
            positive: /shortlist|hire|accept|expert|senior|lead|experienced|qualified/i,
            negative: /reject|decline|unqualified|low experience|no-show/i,
            neutral: /interview|pending|maybe/i
          },
          status: {
            positive: { label: 'Shortlisted', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
            negative: { label: 'Rejected', icon: Trash2, color: 'text-red-500', bg: 'bg-red-500/20' },
            neutral: { label: 'Pending Review', icon: Search, color: 'text-blue-500', bg: 'bg-blue-500/20' }
          }
        };
      case 'feedback':
        return {
          patterns: {
            positive: /excellent|great|good|happy|satisfied|amazing|awsome/i,
            negative: /bad|poor|unhappy|dissatisfied|terrible|horrible|broken/i,
            neutral: /average|okay|recommend/i
          },
          status: {
            positive: { label: 'Positive', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
            negative: { label: 'Negative', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/20' },
            neutral: { label: 'Neutral', icon: History, color: 'text-blue-500', bg: 'bg-blue-500/20' }
          }
        };
      case 'safety':
      default:
        return {
          patterns: {
            positive: /safe|clear|ok|good|ready/i,
            negative: /major|critical|missile|attack|danger|high|emergency|sos|death|severe|unsafe/i,
            neutral: /minor|warning|low|medium|caution|incident|repair|leak/i
          },
          status: {
            positive: { label: 'Safe / Clear', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
            negative: { label: 'Major Incident', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/20' },
            neutral: { label: 'Minor Warning', icon: ShieldQuestion, color: 'text-amber-500', bg: 'bg-amber-500/20' }
          }
        };
    }
  };

  const theme = getCategoryTheme();

  const getStats = () => {
    const category = form.category || 'general';

    if (category === 'recruitment') {
      return {
        cards: [
          {
            label: 'Total Applicants',
            value: submissions.length,
            sub: 'candidates',
            color: 'blue',
            icon: Search
          },
          {
            label: 'Shortlisted',
            value: submissions.filter(s => Object.values(s.responses).some(v => theme.patterns.positive.test(String(v)))).length,
            sub: 'high potential',
            color: 'emerald',
            icon: CheckCircle
          },
          {
            label: 'Rejected',
            value: submissions.filter(s => Object.values(s.responses).some(v => theme.patterns.negative.test(String(v)))).length,
            sub: 'declined',
            color: 'red',
            icon: Trash2
          }
        ]
      };
    }

    if (category === 'feedback') {
      return {
        cards: [
          {
            label: 'Positive',
            value: submissions.filter(s => Object.values(s.responses).some(v => theme.patterns.positive.test(String(v)))).length,
            sub: 'satisfied users',
            color: 'emerald',
            icon: CheckCircle
          },
          {
            label: 'Negative',
            value: submissions.filter(s => Object.values(s.responses).some(v => theme.patterns.negative.test(String(v)))).length,
            sub: 'critiques',
            color: 'red',
            icon: AlertCircle
          },
          {
            label: 'Total Feedback',
            value: submissions.length,
            sub: 'responses',
            color: 'blue',
            icon: History
          }
        ]
      };
    }

    if (category === 'safety') {
      return {
        cards: [
          {
            label: 'Major Incidents',
            value: submissions.filter(s => Object.values(s.responses).some(v => theme.patterns.negative.test(String(v)))).length,
            sub: 'critical',
            color: 'red',
            icon: ShieldAlert
          },
          {
            label: 'Minor Warning',
            value: submissions.filter(s => Object.values(s.responses).some(v => theme.patterns.neutral.test(String(v)))).length,
            sub: 'incidents',
            color: 'amber',
            icon: ShieldQuestion
          },
          {
            label: 'Emergency Help',
            value: submissions.some(s => Object.values(s.responses).some(v => /help|call|sos|ambulance|police|fire|911/i.test(String(v)))) ? 'Active' : 'No Calls',
            sub: 'assistance',
            color: submissions.some(s => Object.values(s.responses).some(v => /help|call|sos|ambulance|police|fire|911/i.test(String(v)))) ? 'blue' : 'muted',
            icon: LifeBuoy
          }
        ]
      };
    }

    // Default: Generic
    return {
      cards: [
        {
          label: 'Total Responses',
          value: submissions.length,
          sub: 'submissions',
          color: 'blue',
          icon: FileSpreadsheet
        },
        {
          label: 'Last Response',
          value: submissions.length > 0 ? new Date(submissions[0].submitted_at).toLocaleDateString() : 'N/A',
          sub: 'latest entry',
          color: 'emerald',
          icon: History
        },
        {
          label: 'Form Status',
          value: form.is_published ? 'Live' : 'Draft',
          sub: 'active version',
          color: form.is_published ? 'emerald' : 'amber',
          icon: CheckCircle
        }
      ]
    };
  };

  const dynamicStats = getStats();

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-700">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/console/admin')}
            className="w-10 h-10 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-foreground">{form.title}</h1>
              <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary font-mono text-[9px] px-1.5 rounded-md">
                v{form.version}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm font-medium mt-0.5">
              {submissions.length} total responses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <input
              type="text"
              placeholder="Search responses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted border border-border rounded-xl h-10 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all w-64"
            />
          </div>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-10 border-border bg-muted/50 hover:bg-muted rounded-xl text-xs font-bold gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl w-fit mb-8 border border-border">
        <button
          onClick={() => setActiveTab('summary')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === 'summary' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Summary
        </button>
        <button
          onClick={() => {
            setActiveTab('individual');
            if (filteredSubmissions.length > 0) {
              setSelectedSubmission(filteredSubmissions[individualIndex] || filteredSubmissions[0]);
            }
          }}
          className={cn(
            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === 'individual' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Individual
        </button>
      </div>

      {error && (
        <Card className="mb-8 border-destructive/20 bg-destructive/5 backdrop-blur-md">
          <CardContent className="pt-6 text-destructive text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </CardContent>
        </Card>
      )}

      {submissions.length === 0 ? (
        <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-sm">
          <CardContent className="py-24 text-center">
            <div className="p-4 bg-muted rounded-3xl mb-6 inline-block">
              <History className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 uppercase tracking-tight">No Responses Yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Your form is live, but no data has been received for this version yet.
            </p>
          </CardContent>
        </Card>
      ) : activeTab === 'summary' ? (
        <div className="space-y-8">
          {/* Quick Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dynamicStats.cards.map((card, i) => (
              <Card key={i} className={cn(
                "backdrop-blur-xl rounded-3xl p-6 flex items-center gap-6 group transition-all duration-500",
                card.color === 'red' ? "bg-destructive/5 border-destructive/20 hover:bg-destructive/10" :
                  card.color === 'emerald' ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10" :
                    card.color === 'blue' ? "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10" :
                      card.color === 'amber' ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10" :
                        "bg-muted/50 border-border hover:bg-muted"
              )}>
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform",
                  card.color === 'red' ? "bg-destructive/20 text-destructive" :
                    card.color === 'emerald' ? "bg-emerald-500/20 text-emerald-500" :
                      card.color === 'blue' ? "bg-blue-500/20 text-blue-500" :
                        card.color === 'amber' ? "bg-amber-500/20 text-amber-500" :
                          "bg-muted text-muted-foreground"
                )}>
                  <card.icon className={cn("w-7 h-7", card.label === 'Emergency Help' && card.value === 'Active' && "animate-spin-slow")} />
                </div>
                <div>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest mb-1",
                    card.color === 'red' ? "text-destructive/60" :
                      card.color === 'emerald' ? "text-emerald-500/60" :
                        card.color === 'blue' ? "text-blue-500/60" :
                          card.color === 'amber' ? "text-amber-500/60" :
                            "text-muted-foreground"
                  )}>{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-foreground">{card.value}</span>
                    <span className={cn(
                      "text-xs font-bold",
                      card.color === 'red' ? "text-destructive" :
                        card.color === 'emerald' ? "text-emerald-500" :
                          card.color === 'blue' ? "text-blue-500" :
                            card.color === 'amber' ? "text-amber-500" :
                              "text-muted-foreground"
                    )}>{card.sub}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Submissions Table Section */}
          <div className="pt-4">
            <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30 border-b border-border">
                    <TableRow className="hover:bg-transparent border-none h-14">
                      <TableHead className="pl-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entry ID</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</TableHead>
                      {form.fields.slice(0, 3).map((field) => (
                        <TableHead key={field.id} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{field.label}</TableHead>
                      ))}
                      <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => {
                      const isPositive = Object.values(submission.responses).some(v => theme.patterns.positive.test(String(v)));
                      const isNegative = Object.values(submission.responses).some(v => theme.patterns.negative.test(String(v)));
                      const isNeutral = Object.values(submission.responses).some(v => theme.patterns.neutral.test(String(v)));

                      return (
                        <TableRow
                          key={submission.id}
                          className={cn(
                            "border-l-2 transition-all group cursor-default h-20",
                            isNegative ? "border-l-red-500/50 hover:bg-red-500/[0.02]" :
                              isPositive ? "border-l-emerald-500/50 hover:bg-emerald-500/[0.02]" :
                                isNeutral ? "border-l-blue-500/50 hover:bg-blue-500/[0.02]" :
                                  "border-l-transparent hover:bg-muted/30"
                          )}
                        >
                          <TableCell className="pl-8">
                            <span className="text-zinc-500 font-mono text-[10px]">#{submission.id.slice(0, 8)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1.5 flex-wrap max-w-[120px]">
                              {isNegative && (
                                <div className={cn("h-5 w-5 rounded flex items-center justify-center", theme.status.negative.bg, theme.status.negative.color)} title={theme.status.negative.label}>
                                  <theme.status.negative.icon className="w-3 h-3" />
                                </div>
                              )}
                              {isPositive && (
                                <div className={cn("h-5 w-5 rounded flex items-center justify-center", theme.status.positive.bg, theme.status.positive.color)} title={theme.status.positive.label}>
                                  <theme.status.positive.icon className="w-3 h-3" />
                                </div>
                              )}
                              {isNeutral && (
                                <div className={cn("h-5 w-5 rounded flex items-center justify-center", theme.status.neutral.bg, theme.status.neutral.color)} title={theme.status.neutral.label}>
                                  <theme.status.neutral.icon className="w-3 h-3" />
                                </div>
                              )}
                              {!isPositive && !isNegative && !isNeutral && (
                                <div className="h-5 w-5 rounded bg-muted/20 flex items-center justify-center text-muted-foreground opacity-20" title="Neutral">
                                  <CheckCircle className="w-3 h-3 grayscale" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-foreground font-bold text-xs">
                              {new Date(submission.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="text-zinc-600 font-medium text-[10px]">
                              {new Date(submission.submitted_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </TableCell>
                          {form.fields.slice(0, 3).map((field) => (
                            <TableCell key={field.id} className="text-muted-foreground text-xs font-medium">
                              <div className="line-clamp-1 max-w-[200px]">
                                {String(submission.responses[field.id] || '-')}
                              </div>
                            </TableCell>
                          ))}
                          <TableCell className="text-right pr-8 whitespace-nowrap">
                            {submission.is_preview ? (
                              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter border-amber-500/20 bg-amber-500/10 text-amber-600">Preview Data</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter border-border bg-muted text-muted-foreground">Recorded</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto pb-32">
          {/* Navigation Control Bar */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between mb-8 shadow-md sticky top-4 z-20">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  disabled={individualIndex === 0}
                  onClick={() => {
                    const next = individualIndex - 1;
                    setIndividualIndex(next);
                    setSelectedSubmission(filteredSubmissions[next]);
                  }}
                  className="w-9 h-9 p-0 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2 px-2">
                  <span className="text-foreground font-black text-sm">{individualIndex + 1}</span>
                  <span className="text-zinc-600 font-bold text-xs">of</span>
                  <span className="text-zinc-400 font-black text-sm">{filteredSubmissions.length}</span>
                </div>
                <Button
                  variant="ghost"
                  disabled={individualIndex === filteredSubmissions.length - 1}
                  onClick={() => {
                    const next = individualIndex + 1;
                    setIndividualIndex(next);
                    setSelectedSubmission(filteredSubmissions[next]);
                  }}
                  className="w-9 h-9 p-0 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-lg"
                onClick={() => confirm('Delete this response?')}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Response Container */}
          {selectedSubmission && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg relative">
                <div className="h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40 w-full" />
                <div className="p-10">
                  <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">{form.title}</h2>
                  <p className="text-muted-foreground text-sm font-medium">{form.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-10 pt-8 border-t border-border">
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Entry Status</p>
                      {selectedSubmission.is_preview ? (
                        <Badge className="bg-amber-500/10 text-amber-500 border-none text-[8px] font-black px-2 h-5 tracking-widest rounded-full uppercase">Preview</Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black px-2 h-5 tracking-widest rounded-full uppercase">Verified</Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Date</p>
                      <p className="text-foreground font-bold text-xs">{new Date(selectedSubmission.submitted_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Time</p>
                      <p className="text-foreground font-bold text-xs">{new Date(selectedSubmission.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Version</p>
                      <p className="text-foreground font-bold text-xs">v{form.version}</p>
                    </div>
                  </div>
                </div>
              </div>

              {form.fields.map((field) => {
                const value = selectedSubmission.responses[field.id];
                const displayValue = Array.isArray(value) ? value.join(', ') : String(value || 'N/A');
                const isPositive = theme.patterns.positive.test(displayValue);
                const isNegative = theme.patterns.negative.test(displayValue);
                const isNeutral = theme.patterns.neutral.test(displayValue);

                return (
                  <div key={field.id} className={cn(
                    "bg-card border rounded-[2rem] p-10 space-y-4 shadow-md transition-all duration-500 group/field hover:bg-accent/5",
                    isNegative ? "border-red-500/20 bg-red-500/[0.02]" :
                      isPositive ? "border-emerald-500/10 bg-emerald-500/[0.01]" :
                        isNeutral ? "border-blue-500/10 bg-blue-500/[0.01]" :
                          "border-border hover:border-primary/20"
                  )}>
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover/field:text-primary transition-colors">{field.label}</label>
                      <div className="flex items-center gap-3">
                        {isNegative && (
                          <div className={cn("flex items-center gap-2", theme.status.negative.color)}>
                            <theme.status.negative.icon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{theme.status.negative.label}</span>
                          </div>
                        )}
                        {isPositive && !isNegative && (
                          <div className={cn("flex items-center gap-2", theme.status.positive.color)}>
                            <theme.status.positive.icon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{theme.status.positive.label}</span>
                          </div>
                        )}
                        {isNeutral && !isPositive && !isNegative && (
                          <div className={cn("flex items-center gap-2", theme.status.neutral.color)}>
                            <theme.status.neutral.icon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{theme.status.neutral.label}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-muted/30 border border-border rounded-2xl p-6 shadow-inner group-hover/field:bg-muted/50 transition-all">
                      <p className={cn(
                        "text-lg font-medium leading-relaxed italic",
                        isNegative ? "text-destructive dark:text-red-400" :
                          isPositive ? "text-emerald-900 dark:text-emerald-100" :
                            isNeutral ? "text-blue-900 dark:text-blue-100" :
                              "text-foreground"
                      )}>
                        {displayValue}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer Decoration */}
      <div className="mt-20 py-10 border-t border-border flex justify-center">
        <div className="p-3 bg-muted rounded-2xl flex items-center gap-3 grayscale opacity-30">
          <FileSpreadsheet className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">End of Record Set</span>
        </div>
      </div>
    </div>
  );
}
