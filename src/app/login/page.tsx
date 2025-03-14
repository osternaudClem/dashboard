import { LoginForm } from '@/components/login-form';
import Logo from '@/components/logo';

const LoginPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo vertical />
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
