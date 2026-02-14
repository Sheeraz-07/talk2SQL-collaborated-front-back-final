"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading, isAuthenticated } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to create account');
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (

    <div className="min-h-screen lg:h-screen flex w-full overflow-hidden">
      {/* Left Section - Branding - Matches Login Page */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900 items-center justify-center p-8">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-900/40 to-background/20" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] animate-pulse-slow" />
        {/* Adjusted accent color for Register page variety but consistency */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />

        {/* Glass Content Container */}
        <div className="relative z-10 max-w-md space-y-6 backdrop-blur-sm bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl animate-fade-in scale-95">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/10 shadow-lg">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span className="tracking-wide">Secure & Reliable Platform</span>
            </div>

            <h2 className="text-4xl font-bold leading-tight text-white drop-shadow-sm">
              Join the future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">database querying</span>
            </h2>

            <p className="text-base text-zinc-300 leading-relaxed font-medium">
              Create your account and start making SQL queries using natural language. Simple, fast, and powerful.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <span className="text-emerald-300 font-bold text-base">✓</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm">Natural Language Processing</div>
                <div className="text-xs text-zinc-400 font-medium">Convert plain English to SQL instantly</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <span className="text-emerald-300 font-bold text-base">✓</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm">Enterprise Security</div>
                <div className="text-xs text-zinc-400 font-medium">Bank-level encryption for your data</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <span className="text-emerald-300 font-bold text-base">✓</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm">Real-time Results</div>
                <div className="text-xs text-zinc-400 font-medium">Get insights in milliseconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Ambient Background for Form Side */}
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute top-0 right-0 w-full h-full bg-background/90 backdrop-blur-3xl -z-10" />

        <Card className="w-full max-w-md border-border/50 shadow-2xl animate-fade-in glass-card relative z-20">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Talk2SQL</h1>
                <p className="text-xs text-muted-foreground font-medium">AI-Powered Database Queries</p>
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
              <CardDescription className="text-base">
                Get started with Talk2SQL for natural database queries
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-foreground/80">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 h-11 rounded-xl border-border bg-background/50 focus:bg-background transition-all hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-destructive mt-1 font-medium animate-slide-down">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold text-foreground/80">Email address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-11 rounded-xl border-border bg-background/50 focus:bg-background transition-all hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive mt-1 font-medium animate-slide-down">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold text-foreground/80">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 h-11 rounded-xl border-border bg-background/50 focus:bg-background transition-all hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1 font-medium animate-slide-down">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-bold text-foreground/80">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    className="pl-10 h-11 rounded-xl border-border bg-background/50 focus:bg-background transition-all hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1 font-medium animate-slide-down">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 mt-6 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create account
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col space-y-3 pt-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground text-center font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{' '}
              <Link href="#" className="underline hover:text-foreground transition-colors">Terms</Link>
              {' '}and{' '}
              <Link href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

