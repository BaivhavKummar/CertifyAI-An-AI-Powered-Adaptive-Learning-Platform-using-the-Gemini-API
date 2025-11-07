
import React, { useState } from 'react';
import { Role, User } from '../../types';
import Button from './Button';
import { BookOpenIcon, UserIcon } from '../icons/Icons';

interface LoginProps {
  onLogin: (username: string) => Promise<User | null>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<Role>(Role.Student);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '') {
        setError('Please enter a username.');
        return;
    }

    // Optional: Basic frontend check before hitting API for the demo
    if (
        (role === Role.Student && username.toLowerCase() !== 'student') ||
        (role === Role.Instructor && username.toLowerCase() !== 'instructor')
    ) {
        setError(`For this demo, use the username '${role.toLowerCase()}' to log in.`);
        return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const user = await onLogin(username);
      if (!user) {
        setError(`Login failed. Please check the username.`);
      } else if (user.role !== role) {
        setError(`'${username}' is a ${user.role}, not a ${role}. Please switch roles.`);
        // Note: In a real app, the parent component would clear the user state.
        // For this demo, we prevent login.
      }
    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-900"
      style={{
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(147, 51, 234, 0.2) 0%, transparent 50%), " +
          "radial-gradient(circle at 80% 90%, rgba(251, 191, 36, 0.15) 0%, transparent 40%)",
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
            <BookOpenIcon className="w-16 h-16 mx-auto text-amber-400" />
            <h1 className="mt-4 text-3xl font-extrabold text-white">CertifyAI Platform</h1>
            <p className="mt-2 text-gray-400">Powered by Gemini AI</p>
        </div>
        
        <div className="flex p-1 bg-gray-700 rounded-full">
            <button
                onClick={() => setRole(Role.Student)}
                className={`w-1/2 py-2.5 text-sm font-semibold leading-5 text-center rounded-full transition-colors duration-300
                ${role === Role.Student ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
                Student
            </button>
            <button
                onClick={() => setRole(Role.Instructor)}
                className={`w-1/2 py-2.5 text-sm font-semibold leading-5 text-center rounded-full transition-colors duration-300
                ${role === Role.Instructor ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
                Instructor
            </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
                    placeholder={`Enter username (try '${role.toLowerCase()}')`}
                />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : `Sign In as ${role === Role.Student ? 'Student' : 'Instructor'}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
