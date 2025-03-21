import Logo from '@/components/Logo';
import ThemeToggle from '@/components/sidebar/ThemeToggle';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo vertical />
        </div>
        <ThemeToggle />
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
