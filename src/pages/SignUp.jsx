import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password, name);
      navigate('/admin');
    } catch (err) {
      setError('Failed to create an account.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md p-8 bg-paper shadow-strong">
        <h2 className="text-3xl font-black text-center text-foreground mb-6">Create Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password (min. 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full gradient-primary text-primary-foreground">Sign Up</Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log In</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;