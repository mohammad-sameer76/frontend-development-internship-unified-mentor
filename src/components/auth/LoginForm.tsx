import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { createDemoAccounts } from '@/utils/createDemoAccounts';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Create demo accounts on component mount
    createDemoAccounts();
  }, []);


 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !password) {
    toast({
      title: "Error",
      description: "Please fill in all fields",
      variant: "destructive"
    });
    return;
  }

  setLoading(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ fetch role from Firestore
    const { getDoc, doc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.exists() ? userDoc.data().role : null;

    toast({
      title: "Success",
      description: "Logged in successfully"
    });

    // ✅ Navigate based on role
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "member") {
      navigate("/member");
    } else {
      navigate("/user");
    }

  } catch (error: any) {
    toast({
      title: "Login Failed",
      description: error.message,
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">GYM Management System</CardTitle>
          <CardDescription>Login to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button 
              type="button" 
              variant="link" 
              onClick={() => navigate('/register')}
            >
              Don't have an account? Register
            </Button>
          </div>

          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <div className="text-center font-medium">Demo Accounts:</div>
            <div><strong>Admin:</strong> admin@gym.com / admin123</div>
            <div><strong>Member:</strong> member@gym.com / member123</div>
            <div><strong>User:</strong> user@gym.com / user123</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}