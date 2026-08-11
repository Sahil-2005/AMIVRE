import { RegisterForm } from '@/components/auth/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | AMIVRE',
  description: 'Create a new AMIVRE account',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
