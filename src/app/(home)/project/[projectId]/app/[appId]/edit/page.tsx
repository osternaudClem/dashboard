import EditAppForm from '@/components/EditAppForm';

type Props = {
  params: Promise<{ appId: string }>;
};

const EditAppPage = async ({ params }: Props) => {
  const { appId } = await params;

  return <EditAppForm appId={appId} />;
};

export default EditAppPage;
