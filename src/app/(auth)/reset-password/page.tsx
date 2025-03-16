import NewPasswordForm from '@/components/NewPasswordForm';

type LoginPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  const token = params.token;
  return <NewPasswordForm token={token} />;
};

export default LoginPage;
