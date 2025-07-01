"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Chrome } from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth(); // We use 'login' from context to sign the user in

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast({ variant: "destructive", title: "Sign Up Failed", description: "Passwords do not match." });
      return;
    }
    // With our mock auth, signup automatically logs the user in.
    login(email);
    toast({ title: "Account Created", description: "Welcome to FocusForge!" });
    router.push('/');
  };
  
  const handleGoogleSignIn = () => {
    // Simulate Google sign-up with a mock user.
    login("demo@google.com");
    toast({ title: "Account Created", description: "Welcome!" });
    router.push('/');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create an account to start your focus journey.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
             {error && <p className="text-destructive text-sm">{error}</p>}
             <Button type="submit" className="w-full">Create Account</Button>
          </CardContent>
        </form>
         <div className="px-6 pb-4">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
             <Chrome className="mr-2 h-4 w-4" /> Google
            </Button>
        </div>
        <CardFooter className="flex justify-center text-sm">
          Already have an account?&nbsp;
          <Link href="/login" className="underline">
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
