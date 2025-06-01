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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { createNewForm } from '@/actions/server/forms';
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
  Trash2,
  Search,
  Calendar,
  Users,
  Share,
  Link as LinkIcon,
  CheckCircle,
  X,
  Eye,
  Settings,
} from 'lucide-react';
import { createClient } from '@/supabase/client';
import { getUserForms, toggleFormStatus, deleteForm } from '@/actions/server/forms';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  pattern?: string;
}

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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [newFormDescription, setNewFormDescription] = useState('');
  const [formFields, setFormFields] = useState<FormField[]>([
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      placeholder: 'Enter your name'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: false,
      placeholder: 'Enter your message'
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [showFormPreview, setShowFormPreview] = useState(false);

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

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = [...formFields];
    updatedFields[index] = { ...updatedFields[index], ...updates } as FormField;
    setFormFields(updatedFields);
  };

  const addField = () => {
    const newField: FormField = {
      name: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false,
      placeholder: '',
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const addOption = (fieldIndex: number) => {
    const updatedFields = [...formFields];
    if (!updatedFields[fieldIndex]?.options) {
      updatedFields[fieldIndex]!.options = [];
    }
    updatedFields[fieldIndex]!.options!.push('New Option');
    setFormFields(updatedFields);
  };

  const updateOption = (
    fieldIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex]!.options![optionIndex] = value;
    setFormFields(updatedFields);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex]!.options = updatedFields[
      fieldIndex
    ]!.options!.filter((_, i) => i !== optionIndex);
    setFormFields(updatedFields);
  };

  const handleCreateNewForm = () => {
    setCreateDialogOpen(true);
    setShowFieldEditor(false);
    setNewFormName('');
    setNewFormDescription('');
    setFormFields([
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        required: true,
        placeholder: 'Enter your name'
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        placeholder: 'Enter your email'
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        required: false,
        placeholder: 'Enter your message'
      }
    ]);
  };

  const handleCreateForm = async () => {
    if (!newFormName.trim()) {
      toast.error('Please enter a form name');
      return;
    }

    setIsCreating(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please log in to create a form');
        return;
      }

      const result = await createNewForm({
        userId: user.id,
        name: newFormName,
        description: newFormDescription || 'A simple contact form',
        fields: formFields
      });

      if (result.success) {
        toast.success(result.message);
        setCreateDialogOpen(false);
        setNewFormName('');
        setNewFormDescription('');
        setShowFieldEditor(false);
        setFormFields([
          {
            name: 'name',
            type: 'text',
            label: 'Name',
            required: true,
            placeholder: 'Enter your name'
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            required: true,
            placeholder: 'Enter your email'
          },
          {
            name: 'message',
            type: 'textarea',
            label: 'Message',
            required: false,
            placeholder: 'Enter your message'
          }
        ]);
        loadForms(); // Refresh the forms list
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Failed to create form');
    } finally {
      setIsCreating(false);
    }
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your forms...</p>
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
          <h1 className="text-3xl font-bold text-foreground">Forms</h1>
          <p className="text-muted-foreground mt-1">
            Manage your lead capture forms and view their performance
          </p>
        </div>
        <Button onClick={handleCreateNewForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Form
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                <p className="text-sm font-medium text-muted-foreground">Total Forms</p>
                <p className="text-2xl font-bold text-foreground">{forms.length}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <LinkIcon className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Responses</p>
                <p className="text-2xl font-bold text-foreground">
                  {forms.reduce((sum, form) => sum + form.responseCount, 0)}
                </p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
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
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery ? 'No forms found' : 'No forms yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
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
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
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
                        className="flex items-center gap-2 text-destructive"
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Switch
                        checked={form.isActive}
                        onCheckedChange={() => handleToggleStatus(form.id, form.isActive)}
                      />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Fields</p>
                      <p className="font-medium">{form.fieldCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Responses</p>
                      <p className="font-medium">{form.responseCount}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-muted-foreground border-t border-border pt-3">
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
             <DialogContent className="bg-white p-6 dark:bg-background text-neutral sm:max-w-[425px] border-none rounded-t-[40px] sm:rounded-[40px] translate-y-0 sm:translate-y-[-50%] bottom-0 sm:top-[50%] sm:h-fit data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%]">

          <DialogHeader>
            <DialogTitle>Share Form</DialogTitle>
            <DialogDescription>
              Share this form link with your audience to start collecting leads.
            </DialogDescription>
          </DialogHeader>
          
          {selectedForm && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Form Name</label>
                <p className="text-lg font-semibold">{selectedForm.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Form URL</label>
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
                  <label className="text-sm font-medium text-foreground">
                    Responses will be sent to
                  </label>
                  <p className="text-sm text-muted-foreground font-mono">
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
                  <DialogContent className="bg-white p-6 dark:bg-background text-neutral sm:max-w-[425px] border-none rounded-t-[40px] sm:rounded-[40px] translate-y-0 sm:translate-y-[-50%] bottom-0 sm:top-[50%] sm:h-fit data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%]">

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

      {/* Create Form Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-white p-6 dark:bg-background text-neutral sm:max-w-[900px] border-none rounded-t-[40px] sm:rounded-[40px] translate-y-0 sm:translate-y-[-50%] bottom-0 sm:top-[50%] sm:h-fit data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              Create and customize your contact form.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Form Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="form-name">Form Name</Label>
                <Input
                  id="form-name"
                  placeholder="e.g., Contact Form, Lead Capture, Demo Request"
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="form-description">Description (Optional)</Label>
                <Textarea
                  id="form-description"
                  placeholder="Brief description of what this form is for..."
                  value={newFormDescription}
                  onChange={(e) => setNewFormDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Form Fields Section */}
            {!showFieldEditor ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm text-foreground">Form Fields</h4>
                    <p className="text-sm text-muted-foreground">Your form will include {formFields.length} field{formFields.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowFormPreview(true)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowFieldEditor(true)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Customize Fields
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="space-y-2">
                    {formFields.map((field, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{field.type}</Badge>
                          <span className="font-medium">{field.label}</span>
                          {field.required && <span className="text-destructive">*</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm text-foreground">Customize Form Fields</h4>
                    <p className="text-sm text-muted-foreground">Add, remove, and configure your form fields</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowFormPreview(true)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" onClick={addField}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Field
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {formFields.map((field, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize text-xs">
                          {field.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(index)}
                          disabled={formFields.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Label</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value) => updateField(index, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="tel">Phone</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="url">URL</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="radio">Radio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Placeholder</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => updateField(index, { required: checked })}
                        />
                        <Label>Required field</Label>
                      </div>

                      {(field.type === 'select' || field.type === 'radio') && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Options</Label>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addOption(index)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {field.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeOption(index, optionIndex)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => setShowFieldEditor(false)}
                  className="w-full"
                >
                  Done Customizing
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateForm}
              disabled={!newFormName.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Form'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Preview Sheet */}
      <Sheet open={showFormPreview} onOpenChange={setShowFormPreview}>
        <SheetContent className="max-w-lg w-full">
          <SheetHeader>
            <SheetTitle>Form Preview</SheetTitle>
          </SheetHeader>
          <div className="p-6">
            <h3 className="text-base font-semibold mb-2">{newFormName || 'Form Preview'}</h3>
            <p className="text-muted-foreground mb-6">{newFormDescription || 'Form description...'}</p>
            <div className="space-y-4">
              {formFields.map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full p-2 border rounded-md"
                      placeholder={field.placeholder}
                      rows={3}
                      disabled
                    />
                  ) : field.type === 'select' ? (
                    <select className="w-full p-2 border rounded-md" disabled>
                      <option>{field.placeholder || 'Select an option'}</option>
                      {field.options?.map((option, i) => (
                        <option key={i}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" disabled />
                      <span className="text-sm">{field.placeholder || field.label}</span>
                    </div>
                  ) : field.type === 'radio' ? (
                    <div className="space-y-2">
                      {field.options?.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <input type="radio" name={field.name} disabled />
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      className="w-full p-2 border rounded-md"
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      disabled
                    />
                  )}
                </div>
              ))}
              <Button className="w-full" disabled>
                Submit
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}