'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send } from 'lucide-react';
import { getFormBySlug, submitFormResponse } from '@/actions/server/forms';

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
  description: string;
  fields: FormField[];
  mailbox: {
    unique_address: string;
    dotcom: string;
  };
}

interface FormViewerProps {
  formId: string;
}

export default function FormViewer({ formId }: FormViewerProps) {
  const [form, setForm] = useState<FormData | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const result = await getFormBySlug(formId);
        if (result.success && result.data) {
          setForm(result.data);
          // Initialize form values
          const initialValues: Record<string, any> = {};
          result.data.fields.forEach((field: FormField) => {
            initialValues[field.name] = field.type === 'checkbox' ? false : '';
          });
          setFormValues(initialValues);
        } else {
          setError(result.message || 'Form not found');
        }
      } catch {
        setError('Failed to load form');
      } finally {
        setIsLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields with more comprehensive validation
      const missingFields = form.fields
        .filter(field => {
          if (!field.required) return false;
          const value = formValues[field.name];
          
          // Handle different field types
          if (field.type === 'checkbox') {
            return value !== true;
          }
          if (field.type === 'email') {
            return !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string);
          }
          return !value || (typeof value === 'string' && value.trim() === '');
        })
        .map(field => field.label);

      if (missingFields.length > 0) {
        setError(`Please fill in required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      // Submit form
      const result = await submitFormResponse({
        formId: form.id,
        responseData: formValues,
        leadEmail: formValues.email || '',
        leadName: formValues.name || formValues.first_name || '',
        mailboxAddress: form.mailbox.unique_address,
        mailboxDomain: form.mailbox.dotcom,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message || 'Failed to submit form');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldValue = formValues[field.name];
    const commonProps = {
      id: field.name,
      'aria-describedby': field.required ? `${field.name}-required` : undefined,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="resize-vertical"
          />
        );
      
      case 'select':
        return (
          <Select
            value={fieldValue || ''}
            onValueChange={(value) => handleFieldChange(field.name, value)}
            required={field.required}
          >
            <SelectTrigger {...commonProps}>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              {...commonProps}
              checked={fieldValue === true}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
              required={field.required}
            />
            <Label htmlFor={field.name} className="text-sm cursor-pointer">
              {field.placeholder || field.label}
            </Label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2" role="radiogroup" aria-labelledby={`${field.name}-label`}>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.name}_${index}`}
                  name={field.name}
                  value={option}
                  checked={fieldValue === option}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  required={field.required}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Label htmlFor={`${field.name}_${index}`} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'date':
        return (
          <Input
            {...commonProps}
            type="date"
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            min={field.min}
            max={field.max}
          />
        );

      case 'url':
        return (
          <Input
            {...commonProps}
            type="url"
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder || 'https://example.com'}
            required={field.required}
            pattern="https?://.*"
          />
        );
      
      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-gray-600">Your form has been submitted successfully. We&apos;ll get back to you soon.</p>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.name}</h1>
              {form.description && (
                <p className="text-gray-600">{form.description}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}