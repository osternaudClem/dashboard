import EditAppForm from '@/components/edit-app-form';

type Props = {
  params: Promise<{ appId: string }>;
};

export default async function EditAppPage({ params }: Props) {
  const { appId } = await params;

  return <EditAppForm appId={appId} />;
}
