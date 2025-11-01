import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      const result = await login(email, password);
      
      // Redirect based on user role
      if (result.role === 'admin') {
        navigate('/admin');
      } else if (result.role === 'house' && result.houseId) {
        navigate(`/house/${result.houseId}`);
      } else {
        navigate('/broadcast');
      }
      
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md p-8 bg-paper shadow-strong">
        <h2 className="text-3xl font-black text-center text-foreground mb-6">Log In</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={isLoggingIn} className="w-full gradient-primary text-primary-foreground">
            {isLoggingIn ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account? <Link to="/signup" className="font-medium text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;