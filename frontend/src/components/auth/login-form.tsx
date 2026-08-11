'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tokens = await authApi.login({ username: email, password });
      setTokens(tokens.access_token, tokens.refresh_token);
      
      const user = await authApi.getMe();
      setUser(user);
      
      toast.success('Logged in successfully');
      router.push('/'); // Redirect to dashboard
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">Enter your credentials to access your dashboard.</p>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" className="p-0 font-semibold" onClick={(e) => { e.preventDefault(); router.push('/register'); }}>
              Sign up
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
