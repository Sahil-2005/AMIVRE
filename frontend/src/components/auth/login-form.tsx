'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

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
      router.push('/dashboard'); // Redirect to dashboard
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <div className="mb-8 space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-white"> Welcome back </h2>
<p className="text-[15px] text-slate-400"> Enter your credentials to access your dashboard. </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-300"> Email </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 border-white/10 bg-[#0a0f1e] text-white placeholder:text-slate-600 focus-visible:border-[#5d7bff]/60 focus-visible:ring-[#5d7bff]/20"

            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-slate-300"> Password </Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 border-white/10 bg-[#0a0f1e] text-white placeholder:text-slate-600 focus-visible:border-[#5d7bff]/60 focus-visible:ring-[#5d7bff]/20"
            />
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <Button type="submit" className="h-11 w-full bg-[#b7c6ff] text-base font-semibold text-[#0a0e1a] shadow-lg shadow-[#5d7bff]/20 transition-all hover:bg-[#c9d5ff] hover:shadow-[#5d7bff]/30" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button> 
             <div className="text-center text-sm text-slate-500">
                 Don&apos;t have an account?{' '}
              <Button variant="link" className="p-0 font-semibold text-[#8fa4ff] hover:text-[#a9bcff]" onClick={(e) => { e.preventDefault(); router.push('/register'); }} >
              Sign up
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
