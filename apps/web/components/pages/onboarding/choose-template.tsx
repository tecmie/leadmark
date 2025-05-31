'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { CheckCircleFilledIcon } from '@/components/icons/InboxIcons';
import { generateFormTemplates } from '@/actions/server/onboarding';
import { routes } from '@/utils/routes';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { updateOnboardingProgress } from '@/actions/server/user-profile';
import { OnboardingStatusEnum, OnboardingStepEnum } from '@repo/types';
import { createClient } from '@/supabase/client';
import { toast } from 'sonner';

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

export default function ChooseTemplatePage() {
  const router = useRouter();

  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(
    null
  );
  const [previewTemplate, setPreviewTemplate] = useState<FormTemplate | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const existingData = JSON.parse(
          sessionStorage.getItem('onboarding-data') || '{}'
        );
        const processedObjective = existingData.processedObjective;
        const resourcesSummary = existingData.resourcesSummary;
        // Generate templates using AI
        const result = await generateFormTemplates({
          processedObjective,
          resourcesSummary,
        });

        if (result.success) {
          setTemplates(result.data || []);
        } else {
          setError(result.message || 'Failed to generate templates');
        }
      } catch {
        setError('Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [router]);

  const handleSelectTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template);
  };

  const handleContinue = async () => {
    if (!selectedTemplate) return;

    try {
      // Save selected template to session storage
      const existingData = JSON.parse(
        sessionStorage.getItem('onboarding-data') || '{}'
      );
      const updatedData = {
        ...existingData,
        selectedTemplate,
      };

      sessionStorage.setItem('onboarding-data', JSON.stringify(updatedData));

      // Update onboarding progress
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;
      if (userId) {
        const updateResult = await updateOnboardingProgress(
          userId,
          OnboardingStatusEnum.IN_PROGRESS,
          OnboardingStepEnum.CUSTOMIZE
        );
        if (!updateResult.success) {
          toast.error(
            updateResult.message || 'Failed to update onboarding progress'
          );
          return;
        }
      }

      router.push(routes.ONBOARDING_CUSTOMIZE);
    } catch {
      toast.error('Failed to save template selection');
    }
  };

  if (isLoading) {
    return (
      <div className="mt-30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Generating Templates</h3>
          <p className="text-gray-600">
            Our AI is creating custom form templates based on your business...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 sm:px-4 w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Form Template
        </h1>
        <p className="text-gray-600">
          Select a template that best fits your lead capture needs
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Card List */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template, index) => {
          const isSelected = selectedTemplate?.name === template.name;
          return (
            <div
              key={index}
              onClick={() => handleSelectTemplate(template)}
              className={`relative group border rounded-2xl p-6 bg-white transition-all duration-300 cursor-pointer
                  ${isSelected ? 'border-blue-600 shadow-lg bg-blue-50 scale-[1.03]' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}
                  hover:scale-[1.01] active:scale-100
                `}
              style={{ minHeight: 170 }}
            >
              {/* Animated Check Icon */}
              <span
                className={`absolute top-4 right-4 transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-30'}`}
              >
                <CheckCircleFilledIcon
                  className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-300'}`}
                />
              </span>
              <div className="flex items-center mb-4">
                <h3 className="font-semibold text-gray-900 text-base">
                  {template.name}
                </h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                {template.description}
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-2">
                    Form Fields:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 4).map((field, fieldIndex) => (
                      <Badge
                        key={fieldIndex}
                        variant="secondary"
                        className="text-xs"
                      >
                        {field.label}
                      </Badge>
                    ))}
                    {template.fields.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.fields.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.fields.length} fields</span>
                    <span>
                      {template.fields.filter((f) => f.required).length}{' '}
                      required
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Dialog for Preview */}
      <Sheet
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Preview: {previewTemplate?.name}</SheetTitle>
          </SheetHeader>
          {previewTemplate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {previewTemplate.fields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {field.type === 'textarea' ? (
                    <div className="h-20 bg-gray-100 rounded border p-2 text-sm text-gray-500">
                      {field.placeholder || 'Textarea field'}
                    </div>
                  ) : field.type === 'select' ? (
                    <div className="h-10 bg-gray-100 rounded border p-2 text-sm text-gray-500">
                      Select dropdown
                    </div>
                  ) : (
                    <div className="h-10 bg-gray-100 rounded border p-2 text-sm text-gray-500">
                      {field.placeholder || `${field.type} input`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <div className="flex justify-between mt-8 w-full">
        <Button
          variant="outline"
          className="hidden"
          onClick={() => router.push(routes.ONBOARDING_SETUP_RESOURCE)}
        >
          Back to Resources
        </Button>
        <Button
          className="w-full"
          onClick={handleContinue}
          disabled={!selectedTemplate}
        >
          Customize Template
        </Button>
      </div>
    </div>
  );
}
