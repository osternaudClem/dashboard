import Logo from '@/components/Logo';
import SignUpForm from '@/components/SignupForm';

const SignupPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo vertical />
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignupPage;
