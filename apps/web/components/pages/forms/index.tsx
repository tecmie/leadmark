'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  ExternalLink,
  Copy,
  MoreHorizontal,
  Eye,
  Trash2,
  BarChart3,
  Search,
  Calendar,
  Users,
  Share,
  Link as LinkIcon,
  CheckCircle,
} from 'lucide-react';
import { createClient } from '@/supabase/client';
import { getUserForms, toggleFormStatus, deleteForm, getFormResponses } from '@/actions/server/forms';
import { routes } from '@/utils/routes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FormData {
  id: string;
  name: string;
  slug: string;
  description: string;
  fieldCount: number;
  responseCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  formUrl: string;
  mailboxAddress: string | null;
}

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormData[]>([]);
  const [filteredForms, setFilteredForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    // Filter forms based on search query
    const filtered = forms.filter(form =>
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredForms(filtered);
  }, [forms, searchQuery]);

  const loadForms = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/signin');
        return;
      }

      const result = await getUserForms(user.id);
      if (result.success) {
        setForms(result.data || []);
      } else {
        setError(result.message || 'Failed to load forms');
      }
    } catch {
      setError('Failed to load forms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (formId: string, currentStatus: boolean) => {
    try {
      const result = await toggleFormStatus(formId, !currentStatus);
      if (result.success) {
        setForms(forms.map(form =>
          form.id === formId ? { ...form, isActive: !currentStatus } : form
        ));
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Failed to update form status');
      }
    } catch {
      toast.error('Failed to update form status');
    }
  };

  const handleDeleteForm = async () => {
    if (!selectedForm) return;

    try {
      const result = await deleteForm(selectedForm.id);
      if (result.success) {
        setForms(forms.filter(form => form.id !== selectedForm.id));
        toast.success(result.message);
        setDeleteDialogOpen(false);
        setSelectedForm(null);
      } else {
        toast.error(result.message || 'Failed to delete form');
      }
    } catch {
      toast.error('Failed to delete form');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleCreateNewForm = () => {
    router.push(routes.ONBOARDING_CHOOSE_TEMPLATE);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your forms...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-600 mt-1">
            Manage your lead capture forms and view their performance
          </p>
        </div>
        <Button onClick={handleCreateNewForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Form
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <LinkIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {forms.reduce((sum, form) => sum + form.responseCount, 0)}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && filteredForms.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No forms found' : 'No forms yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'Create your first form to start capturing leads'}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateNewForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Form
            </Button>
          )}
        </div>
      )}

      {/* Forms Grid */}
      {filteredForms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <Card key={form.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate">
                      {form.name}
                    </CardTitle>
                    {form.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => window.open(form.formUrl, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Form
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedForm(form);
                          setShareDialogOpen(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Share className="h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(form.formUrl)}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedForm(form);
                          setDeleteDialogOpen(true);
                        }}
                        className="flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Status and Stats */}
                  <div className="flex items-center justify-between">
                    <Badge variant={form.isActive ? 'default' : 'secondary'}>
                      {form.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Switch
                        checked={form.isActive}
                        onCheckedChange={() => handleToggleStatus(form.id, form.isActive)}
                      />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Fields</p>
                      <p className="font-medium">{form.fieldCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Responses</p>
                      <p className="font-medium">{form.responseCount}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-500 border-t pt-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created {formatDate(form.createdAt)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(form.formUrl, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedForm(form);
                        setShareDialogOpen(true);
                      }}
                      className="flex-1"
                    >
                      <Share className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Form</DialogTitle>
            <DialogDescription>
              Share this form link with your audience to start collecting leads.
            </DialogDescription>
          </DialogHeader>
          
          {selectedForm && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Form Name</label>
                <p className="text-lg font-semibold">{selectedForm.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Form URL</label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={selectedForm.formUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(selectedForm.formUrl)}
                    className="flex items-center gap-1"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {selectedForm.mailboxAddress && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Responses will be sent to
                  </label>
                  <p className="text-sm text-gray-600 font-mono">
                    {selectedForm.mailboxAddress}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => selectedForm && window.open(selectedForm.formUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedForm?.name}&quot;? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteForm}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}