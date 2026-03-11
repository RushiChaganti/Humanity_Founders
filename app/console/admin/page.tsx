'use client';

import { useEffect, useState } from 'react';
import { FormSchema, BranchesResponse } from '@/types/forms';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty';
import Link from 'next/link';
import { Plus, Edit2, Eye, Trash2, History, CheckCircle2, CircleDashed, LayoutDashboard, LayoutGrid, LayoutList, Share2, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export default function AdminDashboard() {
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<BranchesResponse | null>(null);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const loadForms = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getForms();
      setForms(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleShowBranches = async (formId: string) => {
    try {
      const branchesData = await apiClient.getFormBranches(formId);
      setSelectedBranches(branchesData);
      setIsBranchesOpen(true);
    } catch (err) {
      alert('Failed to load version history');
    }
  };

  const handleCreateBranch = async (form: FormSchema) => {
    if (!confirm(`Create a new version based on v${form.version}?`)) return;
    try {
      const newVersion = await apiClient.createFormVersion(form.id, {
        title: form.title,
        description: form.description,
        fields: form.fields,
        logic_rules: form.logic_rules,
      });
      loadForms();
      alert(`Version ${newVersion.version} created as draft.`);
    } catch (err) {
      alert('Failed to create new version');
    }
  };

  const handleTogglePublish = async (form: FormSchema) => {
    try {
      await apiClient.updateForm(form.id, { is_published: !form.is_published });
      loadForms();
      // If we're updating a branch that's open in the dialog, we might want to refresh branches too
      if (selectedBranches && selectedBranches.root_id === form.id) {
        handleShowBranches(form.id);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const copyLiveLink = (formId: string) => {
    const url = `${window.location.origin}/public/form/${formId}`;
    navigator.clipboard.writeText(url);
    alert('Live form link copied to clipboard!\n\nNote: You can unpublish or manage versions from the History menu.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <CircleDashed className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading Forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      {/* Google Forms Inspired Template Section */}
      <div className="mb-16">
        <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 px-1">Start a new form</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <Link href="/console/builder" className="group">
            <div className="aspect-[4/3] bg-muted/30 border border-border rounded-2xl flex items-center justify-center group-hover:border-primary group-hover:bg-accent/5 transition-all duration-500 overflow-hidden relative shadow-sm hover:shadow-md">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-2 text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors px-1">Blank Form</p>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 px-1 border-t border-border pt-10">
        <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recent forms</h2>
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
          <button
            onClick={() => setViewMode('grid')}
            className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <Card className="mb-8 border-destructive/20 bg-destructive/5 backdrop-blur-md">
          <CardContent className="pt-6">
            <p className="text-destructive font-semibold flex items-center gap-2">
              <CircleDashed className="w-4 h-4" />
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Forms List */}
      {forms.length === 0 ? (
        <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-sm">
          <CardContent className="py-32">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <div className="p-4 bg-muted rounded-3xl mb-6">
                    <Plus className="w-12 h-12 text-muted-foreground" />
                  </div>
                </EmptyMedia>
                <EmptyTitle className="text-3xl font-bold text-foreground mb-2 text-center">No Forms Found</EmptyTitle>
                <EmptyDescription className="text-muted-foreground text-lg max-w-md mx-auto mb-8 text-center">
                  Create a new form to get started.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex justify-center">
                <Link href="/console/builder">
                  <Button className="h-12 px-8 gap-2 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold shadow-2xl transition-all text-center">
                    Create First Form
                  </Button>
                </Link>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="border-border bg-card hover:bg-accent/5 transition-all duration-500 rounded-2xl group border hover:border-primary/20 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md relative">
              {/* Form Preview Header */}
              <div className="aspect-[16/10] bg-muted/30 border-b border-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-2 right-2 z-10">
                  {form.is_published ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none py-0.5 text-[8px] font-black uppercase tracking-widest px-1.5 rounded-full">Live</Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-500 border-none py-0.5 text-[8px] font-black uppercase tracking-widest px-1.5 rounded-full">Draft</Badge>
                  )}
                  {form.category && (
                    <Badge className={cn(
                      "border-none py-0.5 text-[8px] font-black uppercase tracking-widest px-1.5 rounded-full",
                      form.category === 'safety' ? "bg-red-500/10 text-red-500" :
                        form.category === 'recruitment' ? "bg-blue-500/10 text-blue-500" :
                          form.category === 'feedback' ? "bg-emerald-500/10 text-emerald-500" :
                            "bg-muted text-muted-foreground"
                    )}>
                      {form.category}
                    </Badge>
                  )}
                </div>
                <div className="opacity-10 group-hover:opacity-20 transition-all duration-700 group-hover:scale-110">
                  <LayoutDashboard className="w-8 h-8 text-foreground" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 tracking-tight">{form.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 font-medium leading-relaxed">{form.description}</p>
                </div>

                <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4 border-t border-border pt-3">
                  <span>{form.fields.length} Questions</span>
                  <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                  <span>v{form.version}</span>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/console/submissions/${form.id}`} className="block">
                      <Button variant="outline" title="View Results" className="w-full h-8 text-[9px] font-black uppercase tracking-widest bg-white text-white hover:bg-zinc-200 border-none rounded-lg shadow-lg active:scale-95 transition-all">
                        Results
                      </Button>
                    </Link>
                    {form.is_published ? (
                      <Button
                        variant="ghost"
                        onClick={() => copyLiveLink(form.id)}
                        className="w-full h-8 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1"
                      >
                        <Share2 className="w-3 h-3" />
                        Copy Link
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => handleTogglePublish(form)}
                        className="w-full h-8 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none rounded-lg active:scale-95 transition-all"
                      >
                        Publish
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {form.is_published && (
                      <Button
                        variant="ghost"
                        onClick={() => handleTogglePublish(form)}
                        className="w-full h-8 text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none rounded-lg active:scale-95 transition-all"
                      >
                        Unpublish
                      </Button>
                    )}
                    <div className={cn(form.is_published ? "" : "col-span-2")}>
                      {form.is_published ? (
                        <Button
                          variant="ghost"
                          onClick={() => handleCreateBranch(form)}
                          className="w-full h-8 text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary/20 border-none rounded-lg active:scale-95 transition-all"
                        >
                          New Version
                        </Button>
                      ) : (
                        <Link href={`/console/builder/${form.id}`} className="block">
                          <Button variant="ghost" className="w-full h-8 text-[9px] font-black uppercase tracking-widest bg-muted/50 text-muted-foreground hover:text-foreground border-none rounded-lg active:scale-95 transition-all">
                            Edit Draft
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="px-4 py-2 bg-muted/10 border-t border-border flex justify-between items-center">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest font-mono">{new Date(form.updated_at).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <Link href={`/console/preview/${form.id}`} title="Preview">
                    <Eye className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                  </Link>
                  <button
                    onClick={() => handleShowBranches(form.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="History"
                  >
                    <History className="w-3 h-3" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Delete this form?')) {
                        try {
                          await apiClient.deleteForm(form.id);
                          loadForms();
                        } catch (err) {
                          alert('Deletion Failed');
                        }
                      }
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {forms.map((form) => (
            <div key={form.id} className="bg-card border border-border hover:border-primary/20 transition-all duration-500 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between group shadow-sm hover:shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-5 flex-1 min-w-0 mb-4 md:mb-0">
                <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500 shadow-inner">
                  <LayoutDashboard className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <h3 className="text-base font-black text-foreground group-hover:text-primary transition-colors tracking-tight truncate max-w-[200px] sm:max-w-[300px] md:max-w-none">{form.title}</h3>
                    <div className="flex gap-1.5">
                      {form.is_published ? (
                        <Badge className="bg-emerald-500 text-white border-none py-0 h-5 px-2 text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20">Live</Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 py-0 h-5 px-2 text-[8px] font-black uppercase tracking-widest rounded-full">Draft</Badge>
                      )}
                      {form.category && (
                        <Badge className={cn(
                          "border-none py-0 h-5 px-2 text-[8px] font-black uppercase tracking-widest rounded-full",
                          form.category === 'safety' ? "bg-red-500/10 text-red-500" :
                            form.category === 'recruitment' ? "bg-blue-500/10 text-blue-500" :
                              form.category === 'feedback' ? "bg-emerald-500/10 text-emerald-500" :
                                "bg-muted text-muted-foreground"
                        )}>
                          {form.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">{form.description || 'No description provided'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 md:pl-8 shrink-0 border-t md:border-t-0 border-border pt-4 md:pt-0">
                <div className="hidden lg:flex items-center gap-8 text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-4">
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="opacity-50">Content</span>
                    <span className="text-foreground">{form.fields.length} Questions</span>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="opacity-50">Version</span>
                    <span className="text-foreground">v{form.version}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/console/submissions/${form.id}`} className="flex-1 md:flex-none">
                    <Button variant="outline" title="View Results" className="w-full md:w-auto h-10 px-4 text-[10px] font-black uppercase tracking-widest bg-white text-white hover:bg-zinc-100 border-border rounded-xl transition-all shadow-sm">
                      Results
                    </Button>
                  </Link>

                  {form.is_published ? (
                    <Button
                      variant="ghost"
                      onClick={() => copyLiveLink(form.id)}
                      className="h-10 px-4 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white border-none rounded-xl transition-all flex items-center gap-2"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Copy Link</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => handleTogglePublish(form)}
                      className="h-10 px-4 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white border-none rounded-xl transition-all"
                    >
                      Publish
                    </Button>
                  )}

                  <div className="flex items-center gap-1.5 ml-2 bg-muted/30 p-1 rounded-xl border border-border">
                    <Link href={`/console/preview/${form.id}`} title="Preview">
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background shadow-none">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    {!form.is_published && (
                      <Link href={`/console/builder/${form.id}`} title="Edit">
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background shadow-none">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleShowBranches(form.id)} className="w-8 h-8 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background shadow-none" title="History">
                      <History className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={async () => {
                      if (confirm('Delete this form?')) {
                        try {
                          await apiClient.deleteForm(form.id);
                          loadForms();
                        } catch (err) {
                          alert('Deletion Failed');
                        }
                      }
                    }} className="w-8 h-8 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 shadow-none" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Version History Dialog */}
      <Dialog open={isBranchesOpen} onOpenChange={setIsBranchesOpen}>
        <DialogContent className="max-w-2xl bg-card border-border text-foreground backdrop-blur-2xl rounded-[2rem]">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold">Form History</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium font-mono text-xs uppercase tracking-widest">
              Root ID: {selectedBranches?.root_id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {selectedBranches?.branches.slice().reverse().map((branch) => (
              <div key={branch.id} className={cn(
                "p-4 rounded-xl border transition-all flex justify-between items-center group",
                branch.is_published ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted/30 border-border shadow-sm"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs",
                    branch.is_published ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    v{branch.version}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm tracking-tight">{branch.title}</h4>
                      {branch.is_published && (
                        <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black px-1.5 h-4">LIVE</Badge>
                      )}
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground">{new Date(branch.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/console/preview/${branch.id}`} title="Preview">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white hover:text-primary rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>

                  {!branch.is_published ? (
                    <>
                      <Link href={`/console/builder/${branch.id}`} title="Edit Draft">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white hover:text-foreground rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(branch as any)}
                        className="h-8 px-3 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg"
                      >
                        Publish
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyLiveLink(branch.id)}
                        className="h-8 px-3 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg flex gap-1 items-center"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Link
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(branch as any)}
                        className="h-8 px-3 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg"
                      >
                        Unpublish
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
