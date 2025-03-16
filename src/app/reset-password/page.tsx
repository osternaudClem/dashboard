import Logo from '@/components/Logo';
import NewPasswordForm from '@/components/NewPasswordForm';

type LoginPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  const token = params.token;
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo vertical />
        </div>
        <NewPasswordForm token={token} />
      </div>
    </div>
  );
};

export default LoginPage;
