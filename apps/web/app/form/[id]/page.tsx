import FormViewer from '@/components/pages/form/viewer';

export default async function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FormViewer formId={id} />;
}