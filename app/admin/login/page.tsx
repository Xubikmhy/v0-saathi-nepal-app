'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { setClientSession } from '@/lib/sessionUtils';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                toast.error('Invalid credentials');
                setLoading(false);
                return;
            }

            // Set session in localStorage
            setClientSession();
            toast.success('Welcome back, Admin');
            
            // Delay slightly to ensure everything is set before navigation
            await new Promise(resolve => setTimeout(resolve, 100));
            router.push('/admin');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute inset-0 bg-background">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">Admin Access</CardTitle>
                        <CardDescription>
                            Enter your credentials to access God Mode
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@escortnepal.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="bg-background/50"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-700 hover:to-primary/90 text-white shadow-lg shadow-primary/20 transition-all duration-300"
                                disabled={loading}
                            >
                                {loading ? 'Authenticating...' : 'Enter God Mode'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
