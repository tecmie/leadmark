'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, FileText, Loader2, Trash2Icon } from 'lucide-react';
import { routes } from '@/utils/routes';
import { updateOnboardingProgress } from '@/actions/server/user-profile';
import { OnboardingStatusEnum, OnboardingStepEnum } from '@repo/types';
import { createClient } from '@/supabase/client';
import { toast } from 'sonner';
import { useRouter } from '@bprogress/next/app';

interface Resource {
  id: string;
  name: string;
  type: 'text' | 'file';
  content?: string;
  file?: File;
}

// Utility to format file size
function formatFileSize(size: number): string {
  if (size < 1024) return `${size} bytes`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ResourcePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resources, setResources] = useState<Resource[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newResource: Resource = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: 'file',
        file,
      };
      setResources((prev) => [...prev, newResource]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const handleContinue = async () => {
    setIsProcessing(true);
    setError('');

    // Validate at least one file is uploaded
    if (resources.length === 0) {
      setError('Please upload at least one file to continue.');
      setIsProcessing(false);
      return;
    }

    try {
      // Get existing onboarding data
      const existingData = JSON.parse(
        sessionStorage.getItem('onboarding-data') || '{}'
      );

      // Add resources to onboarding data
      const updatedData = {
        ...existingData,
        resources: resources.map((r) => ({
          name: r.name,
          type: r.type,
          content: r.content,
          file: r.file,
        })),
      };

      sessionStorage.setItem('onboarding-data', JSON.stringify(updatedData));

      // Update onboarding progress
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const updateResult = await updateOnboardingProgress(
          userId,
          OnboardingStatusEnum.IN_PROGRESS,
          OnboardingStepEnum.CHOOSE_TEMPLATE
        );
        if (!updateResult.success) {
          toast.error(
            updateResult.message || 'Failed to update onboarding progress'
          );
        }
      }

      router.push(routes.ONBOARDING_CHOOSE_TEMPLATE);
    } catch {
      setError('Failed to save resources');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Business Resources
        </h1>
        <p className="text-gray-600">
          Help our AI understand your business better
        </p>
      </div>

      {/* Upload Files */}
      <div className="mb-4">
        <div className="flex items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Upload Files</h2>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 transition-colors mb-6"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-1">
            Click to upload files
          </p>
          <p className="text-sm text-gray-500">
            PDF, Word documents, or text files
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div>
          <h3 className="font-medium text-gray-900 mb-3">
            Suggested Resources:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Company brochures or presentations</li>
            <li>• Service descriptions and pricing</li>
            <li>• Case studies or testimonials</li>
            <li>• FAQ documents</li>
            <li>• Process documentation</li>
          </ul>
        </div>
      </div>

      {/* Resources List */}
      {resources.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Added Resources ({resources.length})
          </h3>
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{resource.name}</p>
                    <p className="text-sm text-gray-500">
                      {resource.type === 'file' && resource.file
                        ? `File upload • ${formatFileSize(resource.file.size)}`
                        : 'Text content'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeResource(resource.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Trash2Icon className="h-4 w-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 w-full mt-8">
        <Button
          className="w-full"
          onClick={handleContinue}
          disabled={isProcessing || resources.length === 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Continue to Templates'
          )}
        </Button>
      </div>
    </div>
  );
}
