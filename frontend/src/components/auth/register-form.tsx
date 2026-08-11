'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authApi.register({ email, password });
      toast.success('Registration successful. Please log in.');
      router.push('/login');
    } catch (error) {
      toast.error('Registration failed. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Create an Account</h2>
        <p className="text-muted-foreground">Sign up to start analyzing business ideas with AMIVRE.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11"
            />
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" className="p-0 font-semibold" onClick={(e) => { e.preventDefault(); router.push('/login'); }}>
              Log in
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
