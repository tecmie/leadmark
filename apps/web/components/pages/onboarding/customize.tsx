'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, X, Eye, Save } from 'lucide-react';
import { completeOnboardingWorkflow } from '@/actions/server/onboarding';
import { routes } from '@/utils/routes';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface FormTemplate {
  name: string;
  description: string;
  fields: FormField[];
}

export default function CustomizePage() {
  const router = useRouter();

  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Load selected template from session storage
    const onboardingData = sessionStorage.getItem('onboarding-data');
    if (!onboardingData) {
      router.push(routes.ONBOARDING_SETUP_MAIL_ACCOUNT);
      return;
    }

    const data = JSON.parse(onboardingData);
    if (!data.selectedTemplate) {
      router.push(routes.ONBOARDING_CHOOSE_TEMPLATE);
      return;
    }

    const selectedTemplate = data.selectedTemplate;
    setTemplate(selectedTemplate);
    setFormName(selectedTemplate.name);
    setFormDescription(selectedTemplate.description);
    setFields([...selectedTemplate.fields]);
  }, [router]);

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates } as FormField;
    setFields(updatedFields);
  };

  const addField = () => {
    const newField: FormField = {
      name: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false,
      placeholder: '',
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const addOption = (fieldIndex: number) => {
    const updatedFields = [...fields];
    if (!updatedFields[fieldIndex]?.options) {
      updatedFields[fieldIndex]!.options = [];
    }
    updatedFields[fieldIndex]!.options!.push('New Option');
    setFields(updatedFields);
  };

  const updateOption = (
    fieldIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex]!.options![optionIndex] = value;
    setFields(updatedFields);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex]!.options = updatedFields[
      fieldIndex
    ]!.options!.filter((_, i) => i !== optionIndex);
    setFields(updatedFields);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setError('');

    try {
      // Get all onboarding data
      const onboardingData = JSON.parse(
        sessionStorage.getItem('onboarding-data') || '{}'
      );

      // Complete the onboarding workflow
      const result = await completeOnboardingWorkflow({
        userId: 'current-user-id', // This should come from auth context
        unique_address: onboardingData.unique_address,
        rawObjective: onboardingData.rawObjective,
        resources: onboardingData.resources,
      });

      if (result.success) {
        // Clear session storage
        sessionStorage.removeItem('onboarding-data');

        // Redirect to dashboard page
        router.push(routes.INBOX_OVERVIEW);
      } else {
        setError(result.message || 'Failed to publish form');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p>Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="text-center w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Customize Your Form
          </h1>
          <p className="text-gray-600">
            Fine-tune your form fields and settings
          </p>
        </div>
        <Button
          variant="outline"
          className="ml-4 whitespace-nowrap"
          onClick={() => setShowPreview(true)}
        >
          <Eye className="h-5 w-5 mr-2" /> Preview
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Form Editor */}
        <div className="space-y-6 bg-white/90 border border-gray-200 rounded-xl p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="form-name">Form Name</Label>
              <Input
                id="form-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="form-description">Description</Label>
              <Textarea
                id="form-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            Form Fields
            <Button size="sm" onClick={addField}>
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="border-gray-200 border rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize text-xs">
                      {field.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) =>
                          updateField(index, { label: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) =>
                          updateField(index, { type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="tel">Phone</SelectItem>
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
                      onChange={(e) =>
                        updateField(index, { placeholder: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) =>
                        updateField(index, { required: checked })
                      }
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
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-2"
                          >
                            <Input
                              value={option}
                              onChange={(e) =>
                                updateOption(index, optionIndex, e.target.value)
                              }
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
          </div>
        </div>
      </div>

      {/* Sheet for Preview */}
      <Sheet open={showPreview} onOpenChange={setShowPreview}>
        <SheetContent className="max-w-lg w-full">
          <SheetHeader>
            <SheetTitle>Form Preview</SheetTitle>
          </SheetHeader>
          <div className="p-6">
            <h3 className="text-base font-semibold mb-2">{formName}</h3>
            <p className="text-gray-600 mb-6">{formDescription}</p>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
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
                      <span className="text-sm">
                        {field.placeholder || field.label}
                      </span>
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

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-center gap-4 w-full mt-8">
        <Button
          variant="outline"
          className="w-full hidden"
          onClick={() => router.push(routes.ONBOARDING_CHOOSE_TEMPLATE)}
        >
          Back to Templates
        </Button>
        <Button
          className="w-full"
          onClick={handlePublish}
          disabled={isPublishing || !formName.trim()}
        >
          {isPublishing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Publish Form
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
