import SignUpForm from '@/components/SignupForm';
import { isRegistrationEnabled } from '@/lib/config';
import { redirect } from 'next/navigation';

const SignupPage = () => {
  if (!isRegistrationEnabled()) {
    redirect('/');
  }

  return <SignUpForm />;
};

export default SignupPage;
