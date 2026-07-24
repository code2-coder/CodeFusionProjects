import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/login');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
      <div className="bg-card p-10 rounded-3xl border border-[color:var(--border)] shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-foreground text-center">Create Account</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm font-semibold">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-foreground/60 text-sm font-medium mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-background border border-[color:var(--border)] rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors text-foreground"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-foreground/60 text-sm font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-background border border-[color:var(--border)] rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-foreground/60 text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-background border border-[color:var(--border)] rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-foreground text-background font-bold py-4 rounded-xl mt-2 hover:scale-[1.02] transition-transform">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-6 text-foreground/60 text-sm font-medium">
          Already have an account? <Link to="/login" className="text-purple-500 hover:text-purple-400">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
